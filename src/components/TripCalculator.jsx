import { Map, Gauge } from 'lucide-react';
import { formatCurrency, inputCls } from '../utils/formatters';

export default function TripCalculator({ tankCost, tankAutonomy, tripKm, onTankCost, onTankAutonomy, onTripKm, consumedPercentage, consumedTripCost }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Map size={100} /></div>
      <div className="flex items-center gap-2 mb-6">
        <Map className="text-blue-500 dark:text-blue-400" />
        <h2 className="text-xl font-bold dark:text-white">Viaje en Curso</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Costo Tanque ($)</label>
          <input type="number" value={tankCost} onChange={e => onTankCost(Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Autonomía (Km)</label>
          <input type="number" value={tankAutonomy} onChange={e => onTankAutonomy(Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Trip Velocímetro</label>
          <input type="number" value={tripKm} onChange={e => onTripKm(Number(e.target.value))}
            className="w-full px-3 py-2 border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-700 dark:text-blue-400 transition-colors" />
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Gauge size={16} /> Nivel de Nafta Estimado
          </label>
          <span className="font-bold text-lg text-slate-700 dark:text-slate-200">{((1 - consumedPercentage) * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex justify-end shadow-inner transition-colors">
          <div className={`h-full ${consumedPercentage > 0.85 ? 'bg-red-500' : consumedPercentage > 0.6 ? 'bg-amber-400' : 'bg-emerald-500'} transition-all duration-500`}
            style={{ width: `${Math.max(0, (1 - consumedPercentage) * 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          <span>Vacío ({tankAutonomy} km)</span>
          <span className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">Consumo: {formatCurrency(consumedTripCost)}</span>
          <span>Lleno (0 km)</span>
        </div>
      </div>
    </div>
  );
}
