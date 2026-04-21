export function exportCSV(earnings, fuelLogs, expenses) {
  const rows = [
    ['Tipo', 'Fecha', 'Descripcion', 'Monto', 'Horas', 'Viajes', 'Categoria'],
    ...earnings.map(e => ['Ingreso', e.date, '', e.amount, e.hours || 0, e.trips || 0, '']),
    ...fuelLogs.map(f => ['Nafta', f.date, '', f.amount, '', '', '']),
    ...expenses.map(ex => ['Gasto', ex.date, ex.description, ex.amount, '', '', ex.category || 'Otros']),
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-uber-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
