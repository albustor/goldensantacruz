import { NextRequest, NextResponse } from "next/server";
import { sendEvolutionMessage, checkEvolutionConnection } from "@/lib/evolution";
import { generatePaymentWhatsAppMessage, generatePaymentReceiptWhatsApp } from "@/lib/whatsapp";
import { PaymentRecord, SystemSettings } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone, message, payment, settings, level, refSinpe } = body;

    if (!phone) {
      return NextResponse.json({ error: "Número telefónico requerido" }, { status: 400 });
    }

    let textToSend = message;

    if (action === "reminder" && payment && settings) {
      textToSend = generatePaymentWhatsAppMessage(payment, settings, level);
    } else if (action === "receipt" && payment && settings) {
      textToSend = generatePaymentReceiptWhatsApp(payment, settings, refSinpe);
    }

    if (!textToSend) {
      return NextResponse.json({ error: "Texto del mensaje no especificado" }, { status: 400 });
    }

    const result = await sendEvolutionMessage(phone, textToSend);

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        recipient: phone,
        status: "enviado",
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || "No se pudo enviar el mensaje por Evolution API",
      }, { status: 502 });
    }
  } catch (error: any) {
    console.error("Error en endpoint /api/notificaciones/whatsapp:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  const status = await checkEvolutionConnection();
  return NextResponse.json({
    service: "Evolution API WhatsApp Gateway - Golden Sport Academy",
    connection: status,
    timestamp: new Date().toISOString(),
  });
}
