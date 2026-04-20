export function filterByPeriod(data, period) {
  if (period === 'all') return data;
  const today = new Date();
  const month = today.getMonth(), year = today.getFullYear();
  const curr = new Date(today);
  const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
  const weekStart = new Date(curr.setDate(first)).setHours(0, 0, 0, 0);
  return data.filter(e => {
    const d = new Date(e.date + 'T12:00:00');
    return period === 'month'
      ? d.getMonth() === month && d.getFullYear() === year
      : d.getTime() >= weekStart;
  });
}

export const fmtDate = (date) =>
  new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' });
