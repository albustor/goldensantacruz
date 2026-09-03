import { AcademySettings, PaymentRecord } from '../types';

export function formatWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 8) {
    return `506${digits}`;
  }
  return digits;
}

export function generatePaymentWhatsAppMessage(
  payment: PaymentRecord,
  settings: AcademySettings
): string {
  const isOverdue = payment.status === 'overdue';

  const body = isOverdue
    ? `⚠️ *Recordatorio de Cuota Pendiente - Golden Sport Academy Santa Cruz*\n\nEstimado(a) *${payment.guardianName}*,\n\nLe saludamos cordialmente de la directiva de Golden Sport Academy (Sede Santa Bárbara de Santa Cruz).\n\nLe notificamos respetuosamente que la mensualidad de básquetbol de *${payment.playerName}* correspondiente al mes de *${payment.month}* se encuentra pendiente de cancelación (Fecha límite: ${payment.dueDate}).\n\n📌 *Detalle de Pago:*\n• Monto: *₡${payment.amount.toLocaleString('es-CR')}*\n• Sinpe Móvil: *${settings.sinpePhone}* (A nombre de: ${settings.sinpeOwner})\n• Cuenta IBAN: ${settings.ibanAccount} (${settings.bankName})\n\nPor favor envíenos el comprobante por este medio al número *${settings.sinpePhone}* una vez realizada la transferencia para actualizar la ficha deportiva.\n\n¡Agradecemos su valioso apoyo a nuestros muchachos!`
    : `🏀 *Aviso de Mensualidad - Golden Sport Academy Santa Cruz*\n\nEstimado(a) *${payment.guardianName}*,\n\nLe saludamos de parte de Golden Sport Academy (Sede Santa Bárbara de Santa Cruz).\n\nLe compartimos la información de la mensualidad de básquetbol de *${payment.playerName}* para el mes de *${payment.month}*.\n\n📌 *Detalle de Pago:*\n• Fecha de corte: *${payment.dueDate}*\n• Monto mensual: *₡${payment.amount.toLocaleString('es-CR')}*\n• Sinpe Móvil: *${settings.sinpePhone}* (${settings.sinpeOwner})\n• Cuenta IBAN: ${settings.ibanAccount} (${settings.bankName})\n\nAgradecemos remitir el comprobante a este número (*${settings.sinpePhone}*) para su debido registro en el sistema.\n\n¡Gracias por ser parte de la familia Golden! 💛🖤`;

  return body;
}

export function createWhatsAppPaymentLink(
  payment: PaymentRecord,
  settings: AcademySettings
): string {
  const phone = formatWhatsAppNumber(payment.guardianPhone);
  const message = generatePaymentWhatsAppMessage(payment, settings);
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
  return `🏆 *PRÓXIMO ENCUENTRO OFICIAL - GOLDEN SPORT ACADEMY* 🏆\n\n🏀 *Categoría:* ${category}\n🆚 *Rival:* ${opponent}\n📅 *Fecha:* ${date}\n⏰ *Hora:* ${time}\n📍 *Sede:* ${location}\n${locationUrl ? `🗺️ *Ubicación:* ${locationUrl}\n` : ''}\n📸 *Fotografía Oficial:* Cobertura por Golden Studio.\n\n¡Invitamos a todos los padres de familia a vestirnos de dorado y apoyar a nuestros muchachos en la cancha! 💛🖤 #PuraGarraGolden #SantaCruzBásquet`;
}
