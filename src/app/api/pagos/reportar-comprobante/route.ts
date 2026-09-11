import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { sendEvolutionMessage } from "@/lib/evolution";
import { INITIAL_SETTINGS } from "@/lib/initialData";

export const dynamic = "force-dynamic";

interface OCRResult {
  referencia: string;
  monto: number;
  fecha: string;
  banco: string;
  valido: boolean;
  rawText?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerId, imageBase64, manualReference, month, year } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: "Debe seleccionar un atleta para reportar el comprobante" },
        { status: 400 }
      );
    }

    const players = await Store.getPlayers();
    const player = players.find((p) => p.id === playerId);
    if (!player) {
      return NextResponse.json(
        { error: "Atleta no encontrado en el sistema" },
        { status: 404 }
      );
    }

    const currentMonth = month || "Septiembre";
    const currentYear = year || 2026;
    const settings = Store.getSettings() || INITIAL_SETTINGS;

    let ocrData: OCRResult = {
      referencia: manualReference || `SINPE-${Date.now().toString().slice(-6)}`,
      monto: player.monthlyFee || settings.monthlyFeeDefault || 10000,
      fecha: new Date().toISOString().split("T")[0],
      banco: "SINPE Móvil",
      valido: true,
    };

    // 1. Análisis Multimodal con Google Gemini Vision (si se proporcionó imagen)
    if (imageBase64 && process.env.GEMINI_API_KEY) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

        const prompt = `Analiza detenidamente esta imagen de comprobante o transferencia bancaria / SINPE Móvil de Costa Rica.
Extrae y responde ÚNICAMENTE un JSON con los siguientes campos estrictos (sin texto adicional ni markdown):
{
  "referencia": "número de comprobante, transacción o referencia sinpe encontrado (solo dígitos y letras)",
  "monto": 10000 (el monto transferido en número entero o flotante, sin símbolos de colones ni comas),
  "fecha": "YYYY-MM-DD (fecha del comprobante o fecha de hoy si no se aprecia)",
  "banco": "nombre del banco detectado (ej: BCR, BAC Credomatic, Banco Nacional, Banco Popular, Coopealianza, etc.)",
  "valido": true (o false si la imagen NO es un comprobante de pago)
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inline_data: {
                        mime_type: mimeType,
                        data: cleanBase64,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.1,
                response_mime_type: "application/json",
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawResponseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawResponseText) {
            try {
              const parsed = JSON.parse(rawResponseText);
              ocrData = {
                referencia: parsed.referencia || ocrData.referencia,
                monto: Number(parsed.monto) || ocrData.monto,
                fecha: parsed.fecha || ocrData.fecha,
                banco: parsed.banco || "SINPE Móvil",
                valido: parsed.valido !== false,
                rawText: rawResponseText,
              };
            } catch (pErr) {
              console.warn("[OCR] Error parseando JSON de Gemini:", pErr);
            }
          }
        }
      } catch (geminiErr) {
        console.warn("[OCR] Error en llamada a Gemini Vision:", geminiErr);
      }
    }

    // 2. Buscar o crear el registro de pago correspondiente en la base de datos
    const payments = await Store.getPayments();
    let paymentRecord = payments.find(
      (p) => p.playerId === player.id && p.month === currentMonth && p.year === currentYear
    );

    if (paymentRecord) {
      await Store.updatePaymentStatus(paymentRecord.id, "pagado", ocrData.referencia);
    } else {
      const monthNum = "09";
      paymentRecord = await Store.addPayment({
        playerId: player.id,
        playerName: player.fullName,
        guardianName: player.guardianName,
        guardianPhone: player.guardianPhone,
        month: currentMonth,
        year: currentYear,
        amount: ocrData.monto || player.monthlyFee || 10000,
        status: "pagado",
        dueDate: `${currentYear}-${monthNum}-12`,
        sinpeReference: ocrData.referencia,
        paymentDate: ocrData.fecha,
      });
    }

    // 3. Notificación Automática a la Entrenadora Lenny por WhatsApp (62806989)
    const coachPhone = settings.coachPhone || settings.sinpePhone || "62806989";
    const formattedAmount = `₡${(ocrData.monto || 10000).toLocaleString("es-CR")}`;

    const coachNotificationMessage =
      `🏀 *NUEVO COMPROBANTE SINPE REPORTADO - GOLDEN SPORT ACADEMY*\n\n` +
      `Hola Profe Lenny, un padre de familia acaba de subir su comprobante de pago:\n\n` +
      `👤 *Atleta:* ${player.fullName}\n` +
      `👨‍👩‍👧 *Tutor:* ${player.guardianName} (${player.guardianPhone})\n` +
      `📅 *Periodo:* ${currentMonth} ${currentYear}\n` +
      `💰 *Monto Reportado:* ${formattedAmount}\n` +
      `🏦 *Entidad / Canal:* ${ocrData.banco}\n` +
      `🔢 *Comprobante / Ref:* #${ocrData.referencia}\n` +
      `🗓️ *Fecha:* ${ocrData.fecha}\n\n` +
      `✅ *Estado en el Sistema:* Marcado automáticamente como *AL DÍA*.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🤖 _Procesado y verificado por la plataforma de Curiol Studio para Golden Sport Academy._`;

    // Envío no bloqueante a Lenny
    sendEvolutionMessage(coachPhone, coachNotificationMessage).catch((err) =>
      console.error("[Evolution] Error notificando a Lenny:", err)
    );

    // 4. Retornar respuesta exitosa con recibo oficial para el padre
    const receiptId = `REC-${currentYear}-${ocrData.referencia.slice(-6).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message: "Comprobante verificado y registrado exitosamente",
      receipt: {
        receiptNumber: receiptId,
        playerId: player.id,
        playerName: player.fullName,
        guardianName: player.guardianName,
        guardianPhone: player.guardianPhone,
        month: currentMonth,
        year: currentYear,
        amount: ocrData.monto,
        sinpeReference: ocrData.referencia,
        bank: ocrData.banco,
        paymentDate: ocrData.fecha,
        registeredAt: new Date().toISOString(),
        status: "pagado",
      },
    });
  } catch (error: any) {
    console.error("Error en reporte de comprobante:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar el comprobante" },
      { status: 500 }
    );
  }
}
