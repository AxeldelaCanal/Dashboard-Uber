import { useState } from 'react';
import { Wallet, Plus, Calendar, Clock, Route, Edit2, Trash2, Check, X, DollarSign } from 'lucide-react';
import { formatCurrency, inputCls, inlineCls } from '../utils/formatters';
import { fmtDate } from '../utils/dateUtils';

export default function EarningsCard({ earnings, filteredEarnings, onAdd, onDelete, onUpdate }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState('');
  const [hours, setHours] = useState('');
  const [trips, setTrips] = useState('');
  const [editing, setEditing] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !amount) return;
    onAdd({ id: crypto.randomUUID(), date, amount: +amount, hours: +hours || 0, trips: +trips || 0 });
    setAmount(''); setHours(''); setTrips('');
  };

  const handleSave = () => {
    if (!editing.date || isNaN(editing.amount)) return;
    onUpdate({ ...editing, amount: +editing.amount, hours: +editing.hours || 0, trips: +editing.trips || 0 });
    setEditing(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="text-emerald-500 dark:text-emerald-400" />
        <h2 className="text-xl font-bold dark:text-white">Ingresos por Día</h2>
      </div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={`col-span-2 md:col-span-1 ${inputCls}`} required />
          <div className="col-span-2 md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={16} className="text-slate-400" /></div>
            <input type="number" placeholder="Ganancia ($)" value={amount} onChange={e => setAmount(e.target.value)} className={`${inputCls} pl-9`} required />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Clock size={16} className="text-slate-400" /></div>
            <input type="number" step="0.5" placeholder="Horas" value={hours} onChange={e => setHours(e.target.value)} className={`${inputCls} pl-9`} />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Route size={16} className="text-slate-400" /></div>
            <input type="number" placeholder="Viajes" value={trips} onChange={e => setTrips(e.target.value)} className={`${inputCls} pl-9`} />
          </div>
        </div>
        <button type="submit" className="mt-3 w-full bg-black dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Plus size={18} /> Agregar Ingreso
        </button>
      </form>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredEarnings.length === 0
          ? <p className="text-center text-slate-500 dark:text-slate-400 py-4">Sin ingresos en este período.</p>
          : filteredEarnings.map(entry => editing?.id === entry.id ? (
            <div key={entry.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-600 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} className={inlineCls} />
                <input type="number" value={editing.amount} onChange={e => setEditing({ ...editing, amount: e.target.value })} className={inlineCls} placeholder="Monto $" />
              </div>
              <div className="flex gap-2">
                <input type="number" step="0.5" value={editing.hours} onChange={e => setEditing({ ...editing, hours: e.target.value })} className={`w-1/3 ${inlineCls}`} placeholder="Horas" />
                <input type="number" value={editing.trips} onChange={e => setEditing({ ...editing, trips: e.target.value })} className={`w-1/3 ${inlineCls}`} placeholder="Viajes" />
                <div className="w-1/3 flex justify-end gap-1">
                  <button onClick={handleSave} className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded"><Check size={18} /></button>
                  <button onClick={() => setEditing(null)} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><X size={18} /></button>
                </div>
              </div>
            </div>
          ) : (
            <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-lg gap-2 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-emerald-600 dark:text-emerald-500 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{fmtDate(entry.date)}</span>
                  <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {entry.hours > 0 && <span className="flex items-center gap-1"><Clock size={12} /> {entry.hours}h</span>}
                    {entry.trips > 0 && <span className="flex items-center gap-1"><Route size={12} /> {entry.trips} vjs</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-lg mr-2">{formatCurrency(entry.amount)}</span>
                <button onClick={() => setEditing(entry)} className="text-slate-400 hover:text-blue-500 p-1"><Edit2 size={16} /></button>
                <button onClick={() => onDelete(entry.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
