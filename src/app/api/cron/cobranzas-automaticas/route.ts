import { NextRequest, NextResponse } from "next/server";
import { sendEvolutionMessage } from "@/lib/evolution";
import { generatePaymentWhatsAppMessage, getSuggestedReminderLevel, ReminderLevel } from "@/lib/whatsapp";
import { INITIAL_PLAYERS, INITIAL_PAYMENTS, INITIAL_SETTINGS } from "@/lib/initialData";
import { PaymentRecord, Player, SystemSettings } from "@/types";

export const dynamic = "force-dynamic";

interface DispatchResult {
  playerId: string;
  playerName: string;
  guardianName: string;
  phone: string;
  level: ReminderLevel;
  status: "enviado" | "omitido" | "error" | "simulado";
  error?: string;
  messageId?: string;
}

export async function GET(req: NextRequest) {
  return handleAutomatedCobranzas(req);
}

export async function POST(req: NextRequest) {
  return handleAutomatedCobranzas(req);
}

async function handleAutomatedCobranzas(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dryRun = searchParams.get("dryRun") === "true";
    const testPhone = searchParams.get("testPhone") || "";
    const forceLevel = searchParams.get("forceLevel") as ReminderLevel | null;

    const now = new Date();
    const currentDay = now.getDate();
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const currentMonthName = months[now.getMonth()];
    const currentYear = now.getFullYear();

    const settings: SystemSettings = INITIAL_SETTINGS;
    const players: Player[] = INITIAL_PLAYERS.filter(p => p.isActive);
    const payments: PaymentRecord[] = INITIAL_PAYMENTS;

    const results: DispatchResult[] = [];

    // Determinar qué nivel corresponde hoy según la política de fechas:
    // • Día 10: Nivel 1 (Preventivo - 2 días antes del corte del 12)
    // • Día 14: Nivel 2 (Seguimiento - 2 días después del corte)
    // • Día 17: Nivel 3 (Formativo - 5 días después)
    // • Día 20+: Nivel 4 (Opciones de Beca / Comité y Cierre cordial)
    let activeLevel: ReminderLevel = "nivel1_preventivo";
    if (forceLevel) {
      activeLevel = forceLevel;
    } else if (currentDay <= 12) {
      activeLevel = "nivel1_preventivo";
    } else if (currentDay <= 15) {
      activeLevel = "nivel2_seguimiento";
    } else if (currentDay <= 18) {
      activeLevel = "nivel3_formativo";
    } else {
      activeLevel = "nivel4_beca_comite";
    }

    // Filtrar cobros pendientes
    const pendingRecords = payments.filter(
      p => p.status === "pendiente" || p.status === "atrasado"
    );

    for (const payment of pendingRecords) {
      const recipientPhone = testPhone ? testPhone : payment.guardianPhone;
      
      const messageText = generatePaymentWhatsAppMessage(payment, settings, activeLevel);

      if (dryRun) {
        results.push({
          playerId: payment.playerId,
          playerName: payment.playerName,
          guardianName: payment.guardianName,
          phone: recipientPhone,
          level: activeLevel,
          status: "simulado",
        });
        continue;
      }

      // Envío real mediante Evolution API
      const sendRes = await sendEvolutionMessage(recipientPhone, messageText);

      results.push({
        playerId: payment.playerId,
        playerName: payment.playerName,
        guardianName: payment.guardianName,
        phone: recipientPhone,
        level: activeLevel,
        status: sendRes.success ? "enviado" : "error",
        error: sendRes.error,
        messageId: sendRes.messageId,
      });

      // Pausa de 1.5s entre envíos para respetar límites de WhatsApp
      await new Promise(r => setTimeout(r, 1500));
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      currentDay,
      currentMonth: currentMonthName,
      currentYear,
      levelApplied: activeLevel,
      dryRun,
      testPhoneApplied: testPhone || "N/A (Envíos reales a cada padre)",
      totalEvaluated: pendingRecords.length,
      dispatchedCount: results.filter(r => r.status === "enviado").length,
      simulatedCount: results.filter(r => r.status === "simulado").length,
      errorCount: results.filter(r => r.status === "error").length,
      details: results,
    });
  } catch (error: any) {
    console.error("Error en barrido de cobranzas automáticas:", error);
    return NextResponse.json({ error: error.message || "Error en cron de cobranzas" }, { status: 500 });
  }
}
