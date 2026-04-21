import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function BarChart({ chartData }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:sticky lg:top-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-lg font-bold dark:text-white">Últimos 7 días</h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" /> Ingresos</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-400 inline-block" /> Costos</span>
        </div>
      </div>
      <div className="h-48 flex items-end justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        {chartData.days.map((day, idx) => {
          const h = chartData.maxAmount > 0 ? (day.amount / chartData.maxAmount) * 100 : 0;
          const costH = chartData.maxAmount > 0 ? Math.min((day.cost / chartData.maxAmount) * 100, h) : 0;
          return (
            <div key={idx} className="flex flex-col items-center justify-end w-full h-full group">
              <div className="w-full flex-1 flex flex-col justify-end items-center relative">
                {day.amount > 0 && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-indigo-600 dark:text-indigo-300 font-bold absolute bottom-full mb-1 bg-white dark:bg-slate-800 shadow-sm px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800 z-10 whitespace-nowrap pointer-events-none">
                    {formatCurrency(day.amount)}
                    {day.cost > 0 && <span className="text-rose-500 block">-{formatCurrency(day.cost)}</span>}
                  </div>
                )}
                <div
                  className={`w-full rounded-t-sm transition-all duration-500 relative overflow-hidden ${day.amount > 0 ? 'bg-indigo-500 dark:bg-indigo-600 group-hover:bg-indigo-400' : 'bg-slate-100 dark:bg-slate-800'}`}
                  style={{ height: `${Math.max(h, 1)}%`, minHeight: '4px' }}>
                  {costH > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-rose-400/60 dark:bg-rose-500/50" style={{ height: `${costH}%` }} />
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">{day.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
