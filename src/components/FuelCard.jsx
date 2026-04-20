import { useState } from 'react';
import { Fuel, Plus, Droplet, Edit2, Trash2, Check, X, DollarSign } from 'lucide-react';
import { formatCurrency, inputCls, inlineCls } from '../utils/formatters';
import { fmtDate } from '../utils/dateUtils';

export default function FuelCard({ fuelLogs, filteredFuelLogs, onAdd, onDelete, onUpdate }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState('');
  const [editing, setEditing] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !amount) return;
    onAdd({ id: crypto.randomUUID(), date, amount: +amount });
    setAmount('');
  };

  const handleSave = () => {
    if (!editing.date || isNaN(editing.amount)) return;
    onUpdate({ ...editing, amount: +editing.amount });
    setEditing(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <Fuel className="text-rose-500 dark:text-rose-400" />
        <h2 className="text-xl font-bold dark:text-white">Registro de Cargas</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-6">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={`w-full md:w-1/3 ${inputCls}`} required />
        <div className="w-full md:w-2/3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={16} className="text-slate-400" /></div>
          <input type="number" placeholder="Plata cargada..." value={amount} onChange={e => setAmount(e.target.value)} className={`w-full pl-9 ${inputCls}`} required />
        </div>
        <button type="submit" className="bg-black dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Plus size={18} />
        </button>
      </form>
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredFuelLogs.length === 0
          ? <p className="text-center text-slate-500 dark:text-slate-400 py-4">Sin cargas registradas.</p>
          : filteredFuelLogs.map(entry => editing?.id === entry.id ? (
            <div key={entry.id} className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-600 rounded-lg shadow-sm">
              <input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} className={`w-full sm:w-auto ${inlineCls}`} />
              <input type="number" value={editing.amount} onChange={e => setEditing({ ...editing, amount: e.target.value })} className={`w-full sm:w-auto flex-1 ${inlineCls}`} />
              <div className="flex items-center gap-2">
                <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded"><Check size={18} /></button>
                <button onClick={() => setEditing(null)} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><X size={18} /></button>
              </div>
            </div>
          ) : (
            <div key={entry.id} className="flex justify-between p-3 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Droplet size={16} className="text-rose-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{fmtDate(entry.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-600 dark:text-rose-400 mr-2">-{formatCurrency(entry.amount)}</span>
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
