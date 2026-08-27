import { differenceInDays, parseISO, format, isValid } from "date-fns";
import { it } from "date-fns/locale";

export function formatDateIT(dateString) {
  if (!dateString) return null;
  const date = parseISO(dateString);
  if (!isValid(date)) return null;
  return format(date, "d MMMM yyyy", { locale: it });
}

export function getDaysRemaining(dateString) {
  if (!dateString) return null;
  const date = parseISO(dateString);
  if (!isValid(date)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInDays(date, today);
}

export function getPaymentStatus(rata) {
  if (rata.pagato) return "pagato";
  if (!rata.scadenza) return "futuro";
  const days = getDaysRemaining(rata.scadenza);
  if (days === null) return "futuro";
  if (days < 0) return "scaduto";
  if (days <= 14) return "urgente";
  if (days <= 60) return "in_scadenza";
  return "futuro";
}

export function formatCountdown(dateString) {
  if (!dateString) return null;
  const days = getDaysRemaining(dateString);
  if (days === null) return null;
  if (days < 0) return `scaduto da ${Math.abs(days)} giorni`;
  if (days === 0) return "oggi";
  if (days === 1) return "domani";
  return `tra ${days} giorni`;
}
