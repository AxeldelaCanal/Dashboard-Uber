import { Car, Moon, Sun, Download } from 'lucide-react';

export default function Header({ isDarkMode, onToggleDark, filterPeriod, onFilterChange, onExport }) {
  const btn = (val, label) => (
    <button onClick={() => onFilterChange(val)}
      className={`px-4 py-2 text-sm rounded-md transition-colors ${filterPeriod === val ? 'bg-white dark:bg-slate-600 shadow-sm font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
      {label}
    </button>
  );
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="bg-black dark:bg-indigo-600 text-white p-3 rounded-xl shadow-md transition-colors"><Car size={28} /></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Dashboard Uber</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gestión de Ganancias</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onExport} title="Exportar CSV"
          className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
          <Download size={20} />
        </button>
        <button onClick={onToggleDark}
          className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
          {btn('all', 'Todos')}{btn('week', 'Semana')}{btn('month', 'Mes')}
        </div>
      </div>
    </header>
  );
}
