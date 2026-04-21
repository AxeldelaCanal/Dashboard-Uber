import { useMemo } from 'react';
import { BarChart2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function WeekdayStats({ earnings }) {
  const stats = useMemo(() => {
    const totals = Array(7).fill(0), counts = Array(7).fill(0);
    earnings.forEach(e => {
      const idx = (new Date(e.date + 'T12:00:00').getDay() + 6) % 7;
      totals[idx] += +e.amount; counts[idx]++;
    });
    return DAYS.map((label, i) => ({ label, avg: counts[i] > 0 ? Math.round(totals[i] / counts[i]) : 0, count: counts[i] }));
  }, [earnings]);

  const max = Math.max(...stats.map(s => s.avg), 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="text-violet-500 dark:text-violet-400" />
        <h2 className="text-lg font-bold dark:text-white">Promedio por día de semana</h2>
      </div>
      <div className="h-32 flex items-end justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        {stats.map(s => {
          const h = (s.avg / max) * 100;
          return (
            <div key={s.label} className="flex flex-col items-center justify-end w-full h-full group">
              <div className="w-full flex-1 flex flex-col justify-end items-center relative">
                {s.avg > 0 && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-violet-600 dark:text-violet-300 font-bold absolute bottom-full mb-1 bg-white dark:bg-slate-800 shadow-sm px-1.5 py-0.5 rounded border border-violet-100 dark:border-violet-800 z-10 whitespace-nowrap pointer-events-none">
                    {formatCurrency(s.avg)}
                  </div>
                )}
                <div className={`w-full rounded-t-sm transition-all duration-500 ${s.avg > 0 ? 'bg-violet-500 dark:bg-violet-600 group-hover:bg-violet-400' : 'bg-slate-100 dark:bg-slate-800'}`}
                  style={{ height: `${Math.max(h, 1)}%`, minHeight: '4px' }} />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">{s.label}</span>
              {s.count > 0 && <span className="text-[9px] text-slate-400">×{s.count}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
