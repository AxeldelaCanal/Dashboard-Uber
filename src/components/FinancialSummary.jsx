import { useState } from 'react';
import { Calculator, Clock, Route, TrendingUp, Target } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function FinancialSummary({ calculations, filterPeriod, profitMode, onProfitMode, tripKm, filteredFuelLogs, weeklyGoal, onWeeklyGoal }) {
  const { totalGross, appliedFuelCost, totalExpensesAmount, netProfit, efficiency, totalHours, totalTrips, netPerHour, grossPerTrip, periodChange, hasPrevData } = calculations;
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const periodLabel = filterPeriod === 'all' ? 'Histórico' : filterPeriod === 'month' ? 'Mes' : 'Semana';
  const goalProgress = weeklyGoal > 0 ? Math.min((totalGross / weeklyGoal) * 100, 100) : 0;
  const showComparison = filterPeriod !== 'all' && hasPrevData && periodChange !== null;

  return (
    <div className="bg-black dark:bg-slate-900 text-white rounded-3xl shadow-lg p-6 lg:sticky lg:top-[300px] border border-transparent dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-2 mb-6 opacity-90">
        <Calculator /><h2 className="text-xl font-bold">Resumen Financiero</h2>
      </div>
      <div className="space-y-6">

        {/* Meta */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-400"><Target size={14} /><span className="text-xs">Meta del período</span></div>
            {editingGoal ? (
              <div className="flex items-center gap-2">
                <input autoFocus type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)}
                  placeholder="$ meta" className="w-28 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-white/40" />
                <button onClick={() => { onWeeklyGoal(+goalInput || 0); setEditingGoal(false); }} className="text-xs text-emerald-400 hover:text-emerald-300">OK</button>
                <button onClick={() => setEditingGoal(false)} className="text-xs text-slate-400">✕</button>
              </div>
            ) : (
              <button onClick={() => { setGoalInput(weeklyGoal || ''); setEditingGoal(true); }}
                className="text-xs text-slate-400 hover:text-white transition-colors">
                {weeklyGoal > 0 ? formatCurrency(weeklyGoal) : '+ Agregar meta'}
              </button>
            )}
          </div>
          {weeklyGoal > 0 && (
            <>
              <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                <div className="h-2 rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${goalProgress}%` }} />
              </div>
              <p className="text-xs text-slate-400">{goalProgress.toFixed(0)}% alcanzado · faltan {formatCurrency(Math.max(weeklyGoal - totalGross, 0))}</p>
            </>
          )}
        </div>

        {/* Ingresos */}
        <div>
          <p className="text-slate-400 text-sm mb-1">Ingresos ({periodLabel})</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold">{formatCurrency(totalGross)}</p>
            {showComparison && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-1 ${periodChange >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                {periodChange >= 0 ? '↑' : '↓'} {Math.abs(periodChange)}% vs anterior
              </span>
            )}
          </div>
        </div>

        {/* Nafta */}
        <div className="bg-white/10 dark:bg-black/20 rounded-2xl p-4 border border-white/5">
          <p className="text-slate-300 text-sm mb-3">Nafta a descontar:</p>
          <div className="flex bg-black/50 dark:bg-slate-950 p-1 rounded-lg w-full mb-4">
            {['trip', 'logs'].map(mode => (
              <button key={mode} onClick={() => onProfitMode(mode)}
                className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-all ${profitMode === mode ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                {mode === 'trip' ? 'Consumo Trip' : 'Registro Cargas'}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1.5 rounded-full font-medium">
              {profitMode === 'trip' ? `${tripKm} km de viaje` : `${filteredFuelLogs.length} cargas reg.`}
            </span>
            <p className="text-xl font-semibold text-rose-400">- {formatCurrency(appliedFuelCost)}</p>
          </div>
        </div>

        {totalExpensesAmount > 0 && (
          <div className="flex justify-between items-center bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
            <span className="text-amber-200 text-sm">Gastos varios</span>
            <span className="font-semibold text-amber-400">- {formatCurrency(totalExpensesAmount)}</span>
          </div>
        )}

        <div className="border-t border-white/20" />

        <div>
          <p className="text-emerald-400 text-sm font-medium mb-1 uppercase tracking-wider">Bolsillo Neto</p>
          <p className={`text-4xl md:text-5xl font-extrabold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(netProfit)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {totalHours > 0 && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1"><Clock size={14} /><span className="text-xs">Ganancia / Hora</span></div>
              <p className="text-white font-bold">{formatCurrency(netPerHour)}</p>
            </div>
          )}
          {totalTrips > 0 && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1"><Route size={14} /><span className="text-xs">Ticket Promedio</span></div>
              <p className="text-white font-bold">{formatCurrency(grossPerTrip)}</p>
            </div>
          )}
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 mt-1"><TrendingUp size={20} /></div>
          <div>
            <p className="text-emerald-300 text-sm font-medium">Rendimiento de Inversión</p>
            <p className="text-white font-bold">{efficiency} pesos <span className="text-slate-400 font-normal text-sm">ganados por cada $1 en nafta.</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
