const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfToday() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

export function startOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function daysInCurrentMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function dayOfMonth() {
  return new Date().getDate();
}

export function isSameDay(a?: Date, b = new Date()) {
  if (!a) return false;
  return dateKey(a) === dateKey(b);
}

export function isYesterday(date?: Date) {
  if (!date) return false;
  return dateKey(date) === dateKey(new Date(Date.now() - ONE_DAY_MS));
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * ONE_DAY_MS);
}

export function weekStart(date = new Date()) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = addDays(date, diff);
  start.setHours(0, 0, 0, 0);
  return start;
}
