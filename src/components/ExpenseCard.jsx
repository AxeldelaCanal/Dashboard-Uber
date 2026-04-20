import { useState } from 'react';
import { Wrench, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { formatCurrency, inputCls, inlineCls } from '../utils/formatters';

export default function ExpenseCard({ expenses, filteredExpenses, onAdd, onDelete, onUpdate }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [editing, setEditing] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !desc || !amount) return;
    onAdd({ id: crypto.randomUUID(), date, description: desc, amount: +amount });
    setDesc(''); setAmount('');
  };

  const handleSave = () => {
    if (!editing.date || !editing.description || isNaN(editing.amount)) return;
    onUpdate({ ...editing, amount: +editing.amount });
    setEditing(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <Wrench className="text-amber-500 dark:text-amber-400" />
        <h2 className="text-xl font-bold dark:text-white">Gastos Varios</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-6">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={`w-full md:w-1/4 ${inputCls}`} required />
        <input type="text" placeholder="Detalle..." value={desc} onChange={e => setDesc(e.target.value)} className={`w-full md:w-2/4 ${inputCls}`} required />
        <input type="number" placeholder="$ Monto" value={amount} onChange={e => setAmount(e.target.value)} className={`w-full md:w-1/4 ${inputCls}`} required />
        <button type="submit" className="bg-black dark:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-800 dark:hover:bg-indigo-500">
          <Plus size={18} />
        </button>
      </form>
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredExpenses.length === 0
          ? <p className="text-center text-slate-500 dark:text-slate-400 py-4">Sin gastos registrados.</p>
          : filteredExpenses.map(entry => editing?.id === entry.id ? (
            <div key={entry.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-600 rounded-lg shadow-sm">
              <div className="flex gap-2">
                <input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} className={`w-1/2 ${inlineCls}`} />
                <input type="number" value={editing.amount} onChange={e => setEditing({ ...editing, amount: e.target.value })} className={`w-1/2 ${inlineCls}`} />
              </div>
              <div className="flex gap-2">
                <input type="text" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className={`flex-1 ${inlineCls}`} />
                <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={18} /></button>
                <button onClick={() => setEditing(null)} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><X size={18} /></button>
              </div>
            </div>
          ) : (
            <div key={entry.id} className="flex justify-between p-3 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-lg transition-colors">
              <div className="flex flex-col">
                <span className="font-medium text-slate-700 dark:text-slate-300">{entry.description}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(entry.date + 'T12:00:00').toLocaleDateString('es-AR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 mr-2">-{formatCurrency(entry.amount)}</span>
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
