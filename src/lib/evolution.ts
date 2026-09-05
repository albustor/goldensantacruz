/**
 * Evolution API Client Library - Golden Sport Academy Santa Cruz
 * Maneja el envío automatizado de comunicados de cobranza, recibos y avisos por WhatsApp
 * mediante el servidor Cloud DigitalOcean de Curiol Studio.
 */

const EVOLUTION_URL = process.env.EVOLUTION_URL || "http://165.227.77.203:8080";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "b00d9ce9195643d3";
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "curiol_agents";

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
  raw?: any;
}

/**
 * Formatea cualquier número telefónico de Costa Rica a formato JID internacional WhatsApp
 */
export function formatPhoneToWhatsAppJid(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 8) {
    return `506${clean}@s.whatsapp.net`;
  }
  if (clean.startsWith("506") && clean.length === 11) {
    return `${clean}@s.whatsapp.net`;
  }
  return `${clean}@s.whatsapp.net`;
}

/**
 * Envía un mensaje de texto por WhatsApp a través de Evolution API
 */
export async function sendEvolutionMessage(
  toPhone: string,
  text: string,
  options: { delayMs?: number; linkPreview?: boolean } = {}
): Promise<SendMessageResult> {
  if (!EVOLUTION_URL || !EVOLUTION_API_KEY || !INSTANCE_NAME) {
    console.warn("[EVOLUTION] Configuración faltante en variables de entorno.");
    return { success: false, error: "Faltan variables de entorno de Evolution API" };
  }

  const jid = formatPhoneToWhatsAppJid(toPhone);

  try {
    const endpoint = `${EVOLUTION_URL}/message/sendText/${INSTANCE_NAME}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        number: jid,
        options: {
          delay: options.delayMs || 1000,
          presence: "composing",
          linkPreview: options.linkPreview !== undefined ? options.linkPreview : true,
        },
        text: text,
      }),
    });

    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        messageId: data?.key?.id || data?.id,
        raw: data,
      };
    } else {
      return {
        success: false,
        error: data?.response?.message || data?.error || `HTTP ${response.status}`,
        raw: data,
      };
    }
  } catch (err: any) {
    console.error("[EVOLUTION] Error en solicitud:", err);
    return {
      success: false,
      error: err.message || "Error de red al conectar con Evolution API",
    };
  }
}

/**
 * Verifica el estado de conexión de la instancia de WhatsApp en Evolution API
 */
export async function checkEvolutionConnection(): Promise<{ state: string; isConnected: boolean }> {
  try {
    const endpoint = `${EVOLUTION_URL}/instance/connectionState/${INSTANCE_NAME}`;
    const res = await fetch(endpoint, {
      headers: {
        "apikey": EVOLUTION_API_KEY,
      },
    });
    const data = await res.json();
    const state = data?.instance?.state || "unknown";
    return { state, isConnected: state === "open" };
  } catch (e: any) {
    return { state: "unreachable", isConnected: false };
  }
}
