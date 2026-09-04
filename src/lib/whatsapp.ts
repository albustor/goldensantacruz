import { AcademySettings, PaymentRecord } from '../types';

export type ReminderLevel = 
  | "nivel1_preventivo"     // 2 días antes del corte (Día 10)
  | "nivel2_seguimiento"    // 2 días después del corte (Día 14)
  | "nivel3_formativo"      // 5 días después / cada 3 días (Día 17)
  | "nivel4_beca_comite";   // 8+ días después / Instancia de Apoyo y Beca (Día 20+)

export interface ReminderLevelInfo {
  id: ReminderLevel;
  title: string;
  shortLabel: string;
  badgeColor: string;
  description: string;
  timing: string;
}

export const REMINDER_LEVELS: ReminderLevelInfo[] = [
  {
    id: "nivel1_preventivo",
    title: "Nivel 1: Recordatorio Preventivo",
    shortLabel: "Nivel 1 (Día 10 - Preventivo)",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description: "Aviso positivo y amistoso previo a la fecha de corte del 12.",
    timing: "2 días antes del corte (Día 10)",
  },
  {
    id: "nivel2_seguimiento",
    title: "Nivel 2: Seguimiento Amistoso",
    shortLabel: "Nivel 2 (Día 14 - Seguimiento)",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    description: "Consulta cordial sobre dificultades con Sinpe Móvil o transferencias.",
    timing: "2 días después del corte (Día 14)",
  },
  {
    id: "nivel3_formativo",
    title: "Nivel 3: Refuerzo Formativo & Continuidad",
    shortLabel: "Nivel 3 (Día 17 - Formativo)",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    description: "Destaca la importancia de los recursos para entrenamientos, balones y partidos.",
    timing: "5 días después / cada 3 días (Día 17)",
  },
  {
    id: "nivel4_beca_comite",
    title: "Nivel 4: Instancia de Apoyo & Opción de Beca / Comité",
    shortLabel: "Nivel 4 (Día 20+ - Opción Beca)",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description: "Ofrecimiento solidario de Beca (100% o 60/40) con apoyo al Comité de Padres.",
    timing: "8+ días de retraso (Día 20 en adelante)",
  },
];

export function formatWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 8) {
    return `506${digits}`;
  }
  return digits;
}

/**
 * Determina automáticamente el nivel sugerido de recordatorio según la fecha actual respecto al día 12.
 */
export function getSuggestedReminderLevel(payment: PaymentRecord): ReminderLevel {
  if (payment.status === "pagado") return "nivel1_preventivo";

  const now = new Date();
  const currentDay = now.getDate();

  // Si se especifica una fecha límite personalizada, intentar calcular la diferencia en días
  if (payment.dueDate) {
    const due = new Date(payment.dueDate);
    if (!isNaN(due.getTime())) {
      const diffTime = now.getTime() - due.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return "nivel1_preventivo";
      if (diffDays <= 3) return "nivel2_seguimiento";
      if (diffDays <= 7) return "nivel3_formativo";
      return "nivel4_beca_comite";
    }
  }

  // Fallback por día del mes con fecha de corte oficial: Día 12
  if (currentDay <= 12) return "nivel1_preventivo";
  if (currentDay <= 15) return "nivel2_seguimiento";
  if (currentDay <= 19) return "nivel3_formativo";
  return "nivel4_beca_comite";
}

/**
 * Genera el mensaje estructurado y empático para WhatsApp según el nivel seleccionado.
 */
export function generatePaymentWhatsAppMessage(
  payment: PaymentRecord,
  settings: AcademySettings,
  level?: ReminderLevel
): string {
  const actualLevel = level || getSuggestedReminderLevel(payment);
  const formattedAmount = `₡${payment.amount.toLocaleString('es-CR')}`;

  switch (actualLevel) {
    case "nivel1_preventivo":
      return `🏀 *Recordatorio Amistoso de Cuota - Golden Sport Academy Santa Cruz*\n\n` +
        `Estimado(a) *${payment.guardianName}*,\n\n` +
        `Esperamos que se encuentre muy bien. Le saludamos con mucho aprecio de parte de la directiva y entrenadores de Golden Sport Academy Santa Cruz.\n\n` +
        `Le recordamos amablemente que este próximo *12 de ${payment.month}* corresponde la fecha de corte de la mensualidad de básquetbol de *${payment.playerName}*.\n\n` +
        `📌 *Detalle de Pago:*\n` +
        `• Atleta: *${payment.playerName}*\n` +
        `• Periodo: *${payment.month} ${payment.year}*\n` +
        `• Fecha de corte: *12 de ${payment.month}*\n` +
        `• Monto mensual: *${formattedAmount}*\n` +
        `• Sinpe Móvil: *${settings.sinpePhone}* (A nombre de: ${settings.sinpeOwner})\n` +
        `• Cuenta IBAN: ${settings.ibanAccount} (${settings.bankName})\n\n` +
        `Una vez realizada la transferencia, le agradecemos enviarnos el comprobante a este número (*${settings.sinpePhone}*) para actualizar la ficha deportiva.\n\n` +
        `¡Agradecemos enormemente su compromiso con el semillero dorado! 💛🖤 #FamiliaGolden`;

    case "nivel2_seguimiento":
      return `🏀 *Seguimiento de Mensualidad - Golden Sport Academy Santa Cruz*\n\n` +
        `Estimado(a) *${payment.guardianName}*,\n\n` +
        `Esperamos que todo marche excelente en su hogar. Le contactamos de la administración de Golden Sport Academy.\n\n` +
        `Revisando nuestros registros, notamos que la cuota de básquetbol de *${payment.playerName}* del mes de *${payment.month}* (fecha límite 12 de ${payment.month}) aún se encuentra pendiente. Deseamos consultar si tuvo algún inconveniente con la plataforma de Sinpe Móvil o si requiere algún apoyo con los datos bancarios.\n\n` +
        `📌 *Datos de Transferencia:*\n` +
        `• Atleta: *${payment.playerName}*\n` +
        `• Periodo: *${payment.month} ${payment.year}*\n` +
        `• Monto: *${formattedAmount}*\n` +
        `• Sinpe Móvil: *${settings.sinpePhone}* (${settings.sinpeOwner})\n` +
        `• Cuenta IBAN: ${settings.ibanAccount} (${settings.bankName})\n\n` +
        `Por favor envíenos el comprobante a este número cuando le sea posible para mantener al día el expediente deportivo.\n\n` +
        `¡Muchas gracias por su valioso apoyo y comprensión! 💛🖤`;

    case "nivel3_formativo":
      return `🌟 *Continuidad Deportiva y Formativa - Golden Sport Academy Santa Cruz*\n\n` +
        `Estimado(a) *${payment.guardianName}*,\n\n` +
        `Reciba un cordial saludo. Para Golden Sport Academy, el desarrollo integral, físico y en valores de *${payment.playerName}* en la cancha es nuestra mayor motivación. Su entusiasmo y progreso constante en cada entrenamiento nos llenan de satisfacción.\n\n` +
        `Le recordamos respetuosamente la importancia de mantener al día la cuota de *${payment.month}* (*${formattedAmount}*), ya que estos aportes son el sustento vital que nos permite garantizar el alquiler del gimnasio, material deportivo de calidad, hidratación y la logística de los partidos de nuestros muchachos.\n\n` +
        `📌 *Datos de Pago:*\n` +
        `• Atleta: *${payment.playerName}*\n` +
        `• Monto pendiente: *${formattedAmount}*\n` +
        `• Sinpe Móvil: *${settings.sinpePhone}* (${settings.sinpeOwner})\n` +
        `• Cuenta IBAN: ${settings.ibanAccount} (${settings.bankName})\n\n` +
        `Agradecemos de corazón su esfuerzo para ponernos al día. Por favor remítanos el comprobante a este chat. ¡Juntos seguimos impulsando su gran futuro deportivo! 🏀🔥`;

    case "nivel4_beca_comite":
      return `🤝 *Mensaje de Apoyo y Opciones para la Familia - Golden Sport Academy Santa Cruz*\n\n` +
        `Estimado(a) *${payment.guardianName}*,\n\n` +
        `Esperamos que se encuentre bien. Nos comunicamos con usted con total apertura, cariño y empatía de parte de la directiva y cuerpo técnico de Golden Sport Academy.\n\n` +
        `Observamos que la cuota de *${payment.month}* de *${payment.playerName}* presenta un atraso de varios días. Entendemos plenamente que como familias todos podemos atravesar momentos económicos complejos o imprevistos temporales. Queremos asegurarle con el corazón que *nuestro mayor anhelo es que ${payment.playerName} no tenga que interrumpir sus entrenamientos ni alejarse del equipo.*\n\n` +
        `Por esta razón, ponemos a su disposición nuestro **Programa Solidario de Becas Deportivas** (con cobertura del 100% o esquema compartido 60/40), en el cual, a cambio del subsidio de padrinos, la familia formaliza un compromiso de integrarse activamente al **Comité de Padres de Familia** para colaborar en tareas de apoyo, organización de eventos y actividades de la academia.\n\n` +
        `Si desea cancelar la cuota pendiente (*${formattedAmount}* al Sinpe *${settings.sinpePhone}*), o si prefiere coordinar la opción de Beca y Comité, por favor comuníquese en total confianza con nosotros al *${settings.coachPhone || settings.sinpePhone}* o responda a este mensaje.\n\n` +
        `¡En Golden Sport Academy las puertas siempre estarán abiertas para su familia! 💛🖤`;
  }
}

/**
 * Genera el asunto y cuerpo de correo electrónico para el recordatorio escalonado.
 */
export function generatePaymentEmailContent(
  payment: PaymentRecord,
  settings: AcademySettings,
  level?: ReminderLevel
): { subject: string; body: string } {
  const actualLevel = level || getSuggestedReminderLevel(payment);
  const formattedAmount = `₡${payment.amount.toLocaleString('es-CR')}`;

  let subject = "";
  let body = "";

  switch (actualLevel) {
    case "nivel1_preventivo":
      subject = `Recordatorio Preventivo de Mensualidad (${payment.month}) - ${payment.playerName} | Golden Sport Academy`;
      body = `Estimado(a) ${payment.guardianName},\n\n` +
        `Esperamos que se encuentre muy bien. Le saludamos cordialmente de la directiva de Golden Sport Academy Santa Cruz.\n\n` +
        `Le recordamos amablemente que el próximo 12 de ${payment.month} corresponde la fecha de corte de la cuota mensual de básquetbol de ${payment.playerName}.\n\n` +
        `DETALLE DE PAGO:\n` +
        `• Atleta: ${payment.playerName}\n` +
        `• Periodo: ${payment.month} ${payment.year}\n` +
        `• Fecha límite: 12 de ${payment.month}\n` +
        `• Monto mensual: ${formattedAmount}\n` +
        `• Sinpe Móvil: ${settings.sinpePhone} (Titular: ${settings.sinpeOwner})\n` +
        `• Cuenta IBAN: ${settings.ibanAccount} (${settings.bankName})\n\n` +
        `Una vez realizada la transferencia, le solicitamos remitir el comprobante al WhatsApp ${settings.sinpePhone} para la actualización de la ficha deportiva.\n\n` +
        `Agradecemos su constante apoyo y confianza.\n\n` +
        `Atentamente,\nDirectiva y Cuerpo Técnico\nGolden Sport Academy Santa Cruz`;
      break;

    case "nivel2_seguimiento":
      subject = `Seguimiento de Cuota Mensual (${payment.month}) - ${payment.playerName} | Golden Sport Academy`;
      body = `Estimado(a) ${payment.guardianName},\n\n` +
        `Esperamos que todo marche excelente en su hogar. Le contactamos de la administración de Golden Sport Academy.\n\n` +
        `Revisando nuestros registros, notamos que la cuota de básquetbol de ${payment.playerName} correspondiente al mes de ${payment.month} aún no se encuentra registrada (fecha de corte: 12 de ${payment.month}). Deseamos consultar si tuvo algún inconveniente con el sistema de Sinpe Móvil o si requiere confirmación de datos bancarios.\n\n` +
        `DATOS DE TRANSFERENCIA:\n` +
        `• Atleta: ${payment.playerName}\n` +
        `• Monto: ${formattedAmount}\n` +
        `• Sinpe Móvil: ${settings.sinpePhone} (${settings.sinpeOwner})\n` +
        `• Cuenta IBAN: ${settings.ibanAccount} (${settings.bankName})\n\n` +
        `Le agradecemos enviarnos el comprobante al WhatsApp ${settings.sinpePhone} tan pronto le sea posible para mantener al día el expediente deportivo del atleta.\n\n` +
        `Atentamente,\nGolden Sport Academy Santa Cruz`;
      break;

    case "nivel3_formativo":
      subject = `Importancia de la Continuidad Formativa de ${payment.playerName} - Golden Sport Academy`;
      body = `Estimado(a) ${payment.guardianName},\n\n` +
        `Reciba un cordial y atento saludo de parte de Golden Sport Academy Santa Cruz.\n\n` +
        `Para nuestra institución, el desarrollo integral, físico y en valores de ${payment.playerName} en la cancha es una prioridad absoluta. Su disciplina y entusiasmo en cada entrenamiento son motivo de orgullo para todo el equipo.\n\n` +
        `Le recordamos respetuosamente la importancia de mantener al día la cuota de ${payment.month} (${formattedAmount}), ya que estos aportes son el motor que permite sostener el alquiler de las instalaciones deportivas, balones, hidratación y arbitrajes oficiales.\n\n` +
        `DATOS DE PAGO:\n` +
        `• Sinpe Móvil: ${settings.sinpePhone} (${settings.sinpeOwner})\n` +
        `• Cuenta IBAN: ${settings.ibanAccount} (${settings.bankName})\n\n` +
        `Agradecemos de corazón su valioso esfuerzo para ponernos al día. Por favor remítanos el comprobante a nuestro número oficial ${settings.sinpePhone}.\n\n` +
        `Atentamente,\nCuerpo Técnico y Directiva\nGolden Sport Academy Santa Cruz`;
      break;

    case "nivel4_beca_comite":
      subject = `Opciones de Apoyo Solidario y Beca Deportiva para ${payment.playerName} - Golden Sport Academy`;
      body = `Estimado(a) ${payment.guardianName},\n\n` +
        `Esperamos que se encuentre bien. Nos comunicamos con usted con total apertura, empatía y respeto de parte de la directiva de Golden Sport Academy.\n\n` +
        `Observamos que la cuota de ${payment.month} de ${payment.playerName} presenta un atraso considerable. Entendemos plenamente que todas las familias podemos experimentar momentos económicos difíciles o gastos imprevistos. Queremos asegurarle con toda franqueza que nuestro mayor interés es que ${payment.playerName} continúe entrenando y no pierda su desarrollo deportivo con sus compañeros.\n\n` +
        `Por tal motivo, ponemos a su disposición el Programa de Becas Deportivas y Apadrinamiento (cobertura 100% o 60/40), en el cual la familia se integra formalmente al Comité de Padres de Familia para colaborar en actividades y eventos de la academia a cambio de la exoneración de cuota.\n\n` +
        `Le invitamos a comunicarse con nosotros al teléfono ${settings.coachPhone || settings.sinpePhone} para evaluar juntos la alternativa más favorable para su hijo(a).\n\n` +
        `Atentamente,\nDirección General\nGolden Sport Academy Santa Cruz`;
      break;
  }

  return { subject, body };
}

export function createWhatsAppPaymentLink(
  payment: PaymentRecord,
  settings: AcademySettings,
  level?: ReminderLevel
): string {
  const phone = formatWhatsAppNumber(payment.guardianPhone);
  const message = generatePaymentWhatsAppMessage(payment, settings, level);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function createEmailPaymentLink(
  payment: PaymentRecord,
  settings: AcademySettings,
  emailRecipient?: string,
  level?: ReminderLevel
): string {
  const email = emailRecipient || "";
  const { subject, body } = generatePaymentEmailContent(payment, settings, level);
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Genera el texto del Comprobante de Pago Recibido para enviar por WhatsApp
 */
export function generatePaymentReceiptWhatsApp(
  payment: PaymentRecord,
  settings: AcademySettings,
  refSinpe?: string
): string {
  const today = new Date().toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });
  const ref = refSinpe || payment.sinpeReference || 'SINPE-CONFIRMADO';

  return `✅ *COMPROBANTE OFICIAL DE PAGO - GOLDEN SPORT ACADEMY*\n\n` +
    `Estimado(a) *${payment.guardianName}*,\n\n` +
    `Le confirmamos con mucho gusto que hemos registrado exitosamente el pago de la mensualidad de básquetbol.\n\n` +
    `🧾 *Detalle del Recibo Digital:*\n` +
    `• Atleta: *${payment.playerName}*\n` +
    `• Mes Cancelado: *${payment.month} ${payment.year}*\n` +
    `• Monto Recibido: *₡${payment.amount.toLocaleString('es-CR')}*\n` +
    `• Estado: *AL DÍA (PAGADO)*\n` +
    `• Referencia Sinpe: *${ref}*\n` +
    `• Fecha de Registro: *${today}*\n` +
    `• Academia: *Golden Sport Academy Santa Cruz*\n\n` +
    `¡Muchas gracias por su puntualidad y por creer en el talento y la formación de su hijo(a)! 🏀⭐💛🖤 #PuraGarraGolden`;
}

export function createPaymentReceiptWhatsAppLink(
  payment: PaymentRecord,
  settings: AcademySettings,
  refSinpe?: string
): string {
  const phone = formatWhatsAppNumber(payment.guardianPhone);
  const message = generatePaymentReceiptWhatsApp(payment, settings, refSinpe);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateMatchAnnouncementWhatsApp(
  opponent: string,
  category: string,
  date: string,
  time: string,
  location: string,
  locationUrl?: string
): string {
  return `🏆 *PRÓXIMO ENCUENTRO OFICIAL - GOLDEN SPORT ACADEMY* 🏆\n\n` +
    `🏀 *Categoría:* ${category}\n` +
    `🆚 *Rival:* ${opponent}\n` +
    `📅 *Fecha:* ${date}\n` +
    `⏰ *Hora:* ${time}\n` +
    `📍 *Sede:* ${location}\n` +
    `${locationUrl ? `🗺️ *Ubicación:* ${locationUrl}\n` : ''}\n` +
    `📸 *Fotografía Oficial:* Cobertura por Curiol Studio.\n\n` +
    `¡Invitamos a todos los padres de familia a vestirnos de dorado y apoyar a nuestros muchachos! 💛🖤 #PuraGarraGolden #SantaCruzBásquet`;
}
