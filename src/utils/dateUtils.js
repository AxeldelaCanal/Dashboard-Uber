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

export function getPreviousPeriodData(data, period) {
  if (period === 'all') return [];
  const today = new Date();
  if (period === 'month') {
    const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const prevYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    return data.filter(e => {
      const d = new Date(e.date + 'T12:00:00');
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });
  }
  const curr = new Date(today);
  const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
  const weekStart = new Date(today.getFullYear(), today.getMonth(), first);
  const prevWeekStart = new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const prevWeekEnd = new Date(weekStart.getTime() - 1);
  return data.filter(e => {
    const d = new Date(e.date + 'T12:00:00');
    return d >= prevWeekStart && d <= prevWeekEnd;
  });
}

export const fmtDate = (date) =>
  new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' });
