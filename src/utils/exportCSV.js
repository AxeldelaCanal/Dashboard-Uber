function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

export function exportCSV(earnings, fuelLogs, expenses) {
  const rows = [
    ['Tipo', 'Fecha', 'Descripcion', 'Monto', 'Horas', 'Viajes', 'Litros', 'Categoria'],
    ...earnings.map(e  => ['Ingreso', e.date, '', e.amount, e.hours || 0, e.trips || 0, '', '']),
    ...fuelLogs.map(f  => ['Nafta',   f.date, '', f.amount, '', '', f.liters || '', '']),
    ...expenses.map(ex => ['Gasto',   ex.date, ex.description, ex.amount, '', '', '', ex.category || 'Otros']),
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  download(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }), `dashboard-uber-${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportBackup(state) {
  download(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), `dashboard-uber-backup-${new Date().toISOString().split('T')[0]}.json`);
}

export function importBackup(onRestore) {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try { onRestore(JSON.parse(ev.target.result)); }
      catch { alert('Archivo inválido'); }
    };
    reader.readAsText(file);
  };
  input.click();
}
