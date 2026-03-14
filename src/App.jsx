import React, { useState, useMemo, useEffect } from 'react';
import { 
  Car, 
  Fuel, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Calendar,
  Wallet,
  Calculator,
  Gauge,
  Wrench,
  Tag,
  Map,
  Droplet,
  Edit2,
  Check,
  X,
  Clock,
  Route,
  BarChart3,
  Moon,
  Sun
} from 'lucide-react';

// Custom Hook para el Guardado Automático (Local Storage)
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error guardando en localStorage", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default function App() {
  // --- ESTADO: TEMA OSCURO ---
  const [isDarkMode, setIsDarkMode] = useLocalStorage('uber_theme', false);

  // --- ESTADOS: VIAJE EN CURSO (TRIP) ---
  const [tankCost, setTankCost] = useLocalStorage('uber_tankCost', 55000);
  const [tankAutonomy, setTankAutonomy] = useLocalStorage('uber_tankAutonomy', 400);
  const [tripKm, setTripKm] = useLocalStorage('uber_tripKm', 250);

  // --- ESTADOS: REGISTROS HISTÓRICOS ---
  const [earnings, setEarnings] = useLocalStorage('uber_earnings', [
    { id: '1', date: '2026-03-10', amount: 49000, hours: 8, trips: 15 },
    { id: '2', date: '2026-03-11', amount: 60000, hours: 9, trips: 18 },
    { id: '3', date: '2026-03-12', amount: 52000, hours: 7, trips: 14 },
    { id: '4', date: '2026-03-13', amount: 76000, hours: 10, trips: 22 },
  ]);

  const [fuelLogs, setFuelLogs] = useLocalStorage('uber_fuelLogs', [
    { id: 'f1', date: '2026-03-10', amount: 55000 }
  ]);

  const [expenses, setExpenses] = useLocalStorage('uber_expenses', []);

  // --- ESTADOS: FORMULARIOS ---
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAmount, setNewAmount] = useState('');
  const [newHours, setNewHours] = useState('');
  const [newTrips, setNewTrips] = useState('');

  const [newFuelDate, setNewFuelDate] = useState(new Date().toISOString().split('T')[0]);
  const [newFuelAmount, setNewFuelAmount] = useState('');

  const [newExpenseDate, setNewExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // --- ESTADOS: EDICIÓN INLINE ---
  const [editingEarning, setEditingEarning] = useState(null);
  const [editingFuel, setEditingFuel] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const [filterPeriod, setFilterPeriod] = useLocalStorage('uber_filterPeriod', 'all'); 
  const [profitMode, setProfitMode] = useLocalStorage('uber_profitMode', 'trip');

  // Formateador de moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Lógica de filtrado por fechas
  const filterByPeriod = (dataArray) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const getStartOfWeek = (date) => {
      const curr = new Date(date);
      const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
      return new Date(curr.setDate(first)).setHours(0, 0, 0, 0);
    };
    const weekStart = getStartOfWeek(today);

    return dataArray.filter((entry) => {
      const entryDate = new Date(entry.date + 'T12:00:00');
      if (filterPeriod === 'month') {
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      }
      if (filterPeriod === 'week') {
        return entryDate.getTime() >= weekStart;
      }
      return true;
    });
  };

  const filteredEarnings = useMemo(() => filterByPeriod(earnings), [earnings, filterPeriod]);
  const filteredFuelLogs = useMemo(() => filterByPeriod(fuelLogs), [fuelLogs, filterPeriod]);
  const filteredExpenses = useMemo(() => filterByPeriod(expenses), [expenses, filterPeriod]);

  // --- CÁLCULOS PRINCIPALES ---
  const calculations = useMemo(() => {
    const totalGross = filteredEarnings.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
    const totalHours = filteredEarnings.reduce((sum, entry) => sum + (parseFloat(entry.hours) || 0), 0);
    const totalTrips = filteredEarnings.reduce((sum, entry) => sum + (parseFloat(entry.trips) || 0), 0);
    
    const totalFuelLogsAmount = filteredFuelLogs.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
    const totalExpensesAmount = filteredExpenses.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);

    const safeAutonomy = tankAutonomy > 0 ? tankAutonomy : 1;
    const consumedPercentage = Math.min(1, tripKm / safeAutonomy);
    const consumedTripCost = tankCost * consumedPercentage;

    const appliedFuelCost = profitMode === 'trip' ? consumedTripCost : totalFuelLogsAmount;
    const netProfit = totalGross - appliedFuelCost - totalExpensesAmount;
    const efficiency = appliedFuelCost > 0 ? (totalGross / appliedFuelCost).toFixed(2) : 0;
    
    const netPerHour = totalHours > 0 ? (netProfit / totalHours).toFixed(0) : 0;
    const grossPerTrip = totalTrips > 0 ? (totalGross / totalTrips).toFixed(0) : 0;

    return {
      totalGross,
      totalFuelLogsAmount,
      totalExpensesAmount,
      consumedPercentage,
      consumedTripCost,
      appliedFuelCost,
      netProfit,
      efficiency,
      totalHours,
      totalTrips,
      netPerHour,
      grossPerTrip
    };
  }, [tankCost, tankAutonomy, tripKm, filteredEarnings, filteredFuelLogs, filteredExpenses, profitMode]);

  // --- DATOS PARA EL GRÁFICO ---
  const chartData = useMemo(() => {
    const days = [];
    let maxAmount = 0;
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayEarnings = earnings
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
        
      if (dayEarnings > maxAmount) maxAmount = dayEarnings;

      days.push({
        label: d.toLocaleDateString('es-AR', { weekday: 'short' }),
        amount: dayEarnings
      });
    }
    
    return { days, maxAmount: maxAmount > 0 ? maxAmount : 1000 };
  }, [earnings]);

  // --- MANEJADORES DE EVENTOS ---
  const handleAddEarning = (e) => {
    e.preventDefault();
    if (!newDate || !newAmount) return;
    setEarnings([...earnings, { 
      id: crypto.randomUUID(), date: newDate, amount: parseFloat(newAmount), hours: parseFloat(newHours) || 0, trips: parseInt(newTrips) || 0
    }].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewAmount(''); setNewHours(''); setNewTrips('');
  };

  const handleAddFuelLog = (e) => {
    e.preventDefault();
    if (!newFuelDate || !newFuelAmount) return;
    setFuelLogs([...fuelLogs, { id: crypto.randomUUID(), date: newFuelDate, amount: parseFloat(newFuelAmount) }].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewFuelAmount('');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseDate || !newExpenseDesc || !newExpenseAmount) return;
    setExpenses([...expenses, { id: crypto.randomUUID(), date: newExpenseDate, description: newExpenseDesc, amount: parseFloat(newExpenseAmount) }].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewExpenseDesc(''); setNewExpenseAmount('');
  };

  const handleSaveEarning = () => {
    if (!editingEarning.date || isNaN(editingEarning.amount)) return;
    setEarnings(earnings.map(e => e.id === editingEarning.id ? { 
      ...editingEarning, amount: parseFloat(editingEarning.amount), hours: parseFloat(editingEarning.hours) || 0, trips: parseInt(editingEarning.trips) || 0
    } : e).sort((a, b) => new Date(a.date) - new Date(b.date)));
    setEditingEarning(null);
  };

  const handleSaveFuel = () => {
    if (!editingFuel.date || isNaN(editingFuel.amount)) return;
    setFuelLogs(fuelLogs.map(e => e.id === editingFuel.id ? { ...editingFuel, amount: parseFloat(editingFuel.amount) } : e).sort((a, b) => new Date(a.date) - new Date(b.date)));
    setEditingFuel(null);
  };

  const handleSaveExpense = () => {
    if (!editingExpense.date || !editingExpense.description || isNaN(editingExpense.amount)) return;
    setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...editingExpense, amount: parseFloat(editingExpense.amount) } : e).sort((a, b) => new Date(a.date) - new Date(b.date)));
    setEditingExpense(null);
  };

  // Input Class Reusable
  const inputClassName = "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 outline-none dark:text-white transition-colors";
  const inlineInputClass = "px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded focus:ring-1 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 dark:text-white transition-colors";

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-black dark:bg-indigo-600 text-white p-3 rounded-xl shadow-md transition-colors">
                <Car size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">Dashboard Uber</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Gestión Avanzada de Flota</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Botón Theme Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Filtros */}
              <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg transition-colors">
                <button onClick={() => setFilterPeriod('all')} className={`px-4 py-2 text-sm rounded-md transition-colors ${filterPeriod === 'all' ? 'bg-white dark:bg-slate-600 shadow-sm font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Todos</button>
                <button onClick={() => setFilterPeriod('week')} className={`px-4 py-2 text-sm rounded-md transition-colors ${filterPeriod === 'week' ? 'bg-white dark:bg-slate-600 shadow-sm font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Semana</button>
                <button onClick={() => setFilterPeriod('month')} className={`px-4 py-2 text-sm rounded-md transition-colors ${filterPeriod === 'month' ? 'bg-white dark:bg-slate-600 shadow-sm font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Mes</button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Columna Izquierda: Entradas de datos */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tarjeta 1: VIAJE EN CURSO */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none">
                  <Map size={100} />
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <Map className="text-blue-500 dark:text-blue-400" />
                  <h2 className="text-xl font-bold dark:text-white">Viaje en Curso (Trip Actual)</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Costo Tanque ($)</label>
                    <input type="number" value={tankCost} onChange={(e) => setTankCost(Number(e.target.value))} className={inputClassName} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Autonomía (Km)</label>
                    <input type="number" value={tankAutonomy} onChange={(e) => setTankAutonomy(Number(e.target.value))} className={inputClassName} placeholder="Ej: 400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-blue-400 mb-1 text-blue-600">Trip Velocímetro</label>
                    <input type="number" value={tripKm} onChange={(e) => setTripKm(Number(e.target.value))} className="w-full px-3 py-2 border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-700 dark:text-blue-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Gauge size={16} /> Nivel de Nafta Estimado
                    </label>
                    <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
                      {((1 - calculations.consumedPercentage) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex justify-end shadow-inner transition-colors">
                    <div 
                      className={`h-full ${calculations.consumedPercentage > 0.85 ? 'bg-red-500' : calculations.consumedPercentage > 0.6 ? 'bg-amber-400' : 'bg-emerald-500'} transition-all duration-500`}
                      style={{ width: `${Math.max(0, (1 - calculations.consumedPercentage) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    <span>Vacío ({tankAutonomy} km)</span>
                    <span className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">Consumo: {formatCurrency(calculations.consumedTripCost)}</span>
                    <span>Lleno (0 km)</span>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: INGRESOS POR DÍA */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <Wallet className="text-emerald-500 dark:text-emerald-400" />
                  <h2 className="text-xl font-bold dark:text-white">Ingresos por Día</h2>
                </div>

                <form onSubmit={handleAddEarning} className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className={`col-span-2 md:col-span-1 ${inputClassName}`} required />
                    
                    <div className="col-span-2 md:col-span-2 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={16} className="text-slate-400" /></div>
                      <input type="number" placeholder="Ganancia ($)" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className={`${inputClassName} pl-9`} required />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Clock size={16} className="text-slate-400" /></div>
                      <input type="number" step="0.5" placeholder="Horas" value={newHours} onChange={(e) => setNewHours(e.target.value)} className={`${inputClassName} pl-9`} />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Route size={16} className="text-slate-400" /></div>
                      <input type="number" placeholder="Viajes" value={newTrips} onChange={(e) => setNewTrips(e.target.value)} className={`${inputClassName} pl-9`} />
                    </div>
                  </div>
                  <button type="submit" className="mt-3 w-full bg-black dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Plus size={18} /> Agregar Ingreso
                  </button>
                </form>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredEarnings.length === 0 ? <p className="text-center text-slate-500 dark:text-slate-400 py-4">Sin ingresos en este período.</p> : 
                    filteredEarnings.map(entry => (
                      editingEarning?.id === entry.id ? (
                        <div key={entry.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-600 rounded-lg shadow-sm transition-colors">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="date" value={editingEarning.date} onChange={(e) => setEditingEarning({...editingEarning, date: e.target.value})} className={inlineInputClass} />
                            <input type="number" value={editingEarning.amount} onChange={(e) => setEditingEarning({...editingEarning, amount: e.target.value})} className={inlineInputClass} placeholder="Monto $" />
                          </div>
                          <div className="flex gap-2">
                            <input type="number" step="0.5" value={editingEarning.hours} onChange={(e) => setEditingEarning({...editingEarning, hours: e.target.value})} className={`w-1/3 ${inlineInputClass}`} placeholder="Horas" />
                            <input type="number" value={editingEarning.trips} onChange={(e) => setEditingEarning({...editingEarning, trips: e.target.value})} className={`w-1/3 ${inlineInputClass}`} placeholder="Viajes" />
                            <div className="w-1/3 flex justify-end gap-1">
                              <button onClick={handleSaveEarning} className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded" title="Guardar"><Check size={18} /></button>
                              <button onClick={() => setEditingEarning(null)} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Cancelar"><X size={18} /></button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-lg gap-2 transition-colors">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-emerald-600 dark:text-emerald-500 hidden sm:block" />
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(entry.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
                              <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {entry.hours > 0 && <span className="flex items-center gap-1"><Clock size={12}/> {entry.hours}h</span>}
                                {entry.trips > 0 && <span className="flex items-center gap-1"><Route size={12}/> {entry.trips} vjs</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-lg mr-2">{formatCurrency(entry.amount)}</span>
                            <div>
                              <button onClick={() => setEditingEarning(entry)} className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"><Edit2 size={16} /></button>
                              <button onClick={() => setEarnings(earnings.filter(e => e.id !== entry.id))} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"><Trash2 size={18} /></button>
                            </div>
                          </div>
                        </div>
                      )
                    ))
                  }
                </div>
              </div>

              {/* Tarjeta 3: REGISTRO DE CARGAS DE NAFTA */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <Fuel className="text-rose-500 dark:text-rose-400" />
                  <h2 className="text-xl font-bold dark:text-white">Registro de Cargas</h2>
                </div>
                <form onSubmit={handleAddFuelLog} className="flex flex-col md:flex-row gap-3 mb-6">
                  <input type="date" value={newFuelDate} onChange={(e) => setNewFuelDate(e.target.value)} className={`w-full md:w-1/3 ${inputClassName}`} required />
                  <div className="w-full md:w-2/3 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={16} className="text-slate-400" /></div>
                    <input type="number" placeholder="Plata cargada..." value={newFuelAmount} onChange={(e) => setNewFuelAmount(e.target.value)} className={`w-full pl-9 ${inputClassName}`} required />
                  </div>
                  <button type="submit" className="bg-black dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"><Plus size={18} /> <span className="md:hidden">Agregar</span></button>
                </form>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredFuelLogs.length === 0 ? <p className="text-center text-slate-500 dark:text-slate-400 py-4">Sin cargas registradas.</p> : 
                    filteredFuelLogs.map(entry => (
                      editingFuel?.id === entry.id ? (
                        <div key={entry.id} className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-600 rounded-lg shadow-sm">
                          <input type="date" value={editingFuel.date} onChange={(e) => setEditingFuel({...editingFuel, date: e.target.value})} className={`w-full sm:w-auto ${inlineInputClass}`} />
                          <input type="number" value={editingFuel.amount} onChange={(e) => setEditingFuel({...editingFuel, amount: e.target.value})} className={`w-full sm:w-auto flex-1 ${inlineInputClass}`} />
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button onClick={handleSaveFuel} className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded" title="Guardar"><Check size={18} /></button>
                            <button onClick={() => setEditingFuel(null)} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Cancelar"><X size={18} /></button>
                          </div>
                        </div>
                      ) : (
                        <div key={entry.id} className="flex justify-between p-3 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <Droplet size={16} className="text-rose-500 dark:text-rose-400" />
                            <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(entry.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-rose-600 dark:text-rose-400 mr-2">-{formatCurrency(entry.amount)}</span>
                            <button onClick={() => setEditingFuel(entry)} className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"><Edit2 size={16} /></button>
                            <button onClick={() => setFuelLogs(fuelLogs.filter(e => e.id !== entry.id))} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      )
                    ))
                  }
                </div>
              </div>

              {/* Tarjeta 4: GASTOS VARIOS */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <Wrench className="text-amber-500 dark:text-amber-400" />
                  <h2 className="text-xl font-bold dark:text-white">Gastos Varios</h2>
                </div>
                <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row gap-3 mb-6">
                  <input type="date" value={newExpenseDate} onChange={(e) => setNewExpenseDate(e.target.value)} className={`w-full md:w-1/4 ${inputClassName}`} required />
                  <input type="text" placeholder="Detalle..." value={newExpenseDesc} onChange={(e) => setNewExpenseDesc(e.target.value)} className={`w-full md:w-2/4 ${inputClassName}`} required />
                  <input type="number" placeholder="$ Monto" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className={`w-full md:w-1/4 ${inputClassName}`} required />
                  <button type="submit" className="bg-black dark:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"><Plus size={18} /></button>
                </form>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredExpenses.map(entry => (
                    editingExpense?.id === entry.id ? (
                      <div key={entry.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-600 rounded-lg shadow-sm">
                        <div className="flex gap-2">
                          <input type="date" value={editingExpense.date} onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})} className={`w-1/2 ${inlineInputClass}`} />
                          <input type="number" value={editingExpense.amount} onChange={(e) => setEditingExpense({...editingExpense, amount: e.target.value})} className={`w-1/2 ${inlineInputClass}`} />
                        </div>
                        <div className="flex gap-2">
                          <input type="text" value={editingExpense.description} onChange={(e) => setEditingExpense({...editingExpense, description: e.target.value})} className={`flex-1 ${inlineInputClass}`} />
                          <button onClick={handleSaveExpense} className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded" title="Guardar"><Check size={18} /></button>
                          <button onClick={() => setEditingExpense(null)} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Cancelar"><X size={18} /></button>
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
                          <button onClick={() => setEditingExpense(entry)} className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"><Edit2 size={16} /></button>
                          <button onClick={() => setExpenses(expenses.filter(e => e.id !== entry.id))} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

            </div>

            {/* Columna Derecha: Resultados y Gráficos (Sticky) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* GRÁFICO VISUAL: Últimos 7 Días */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:sticky lg:top-6 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="text-indigo-500 dark:text-indigo-400" />
                  <h2 className="text-lg font-bold dark:text-white">Rendimiento (Últimos 7 días)</h2>
                </div>
                
                <div className="h-48 flex items-end justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  {chartData.days.map((day, idx) => {
                    const heightPercent = chartData.maxAmount > 0 ? (day.amount / chartData.maxAmount) * 100 : 0;
                    return (
                      <div key={idx} className="flex flex-col items-center justify-end w-full h-full group">
                        <div className="w-full flex-1 flex flex-col justify-end items-center">
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-500 relative flex justify-center ${day.amount > 0 ? 'bg-indigo-500 dark:bg-indigo-600 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`}
                            style={{ height: `${Math.max(heightPercent, 1)}%`, minHeight: '4px' }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-indigo-600 dark:text-indigo-300 font-bold absolute bottom-full mb-1 bg-white dark:bg-slate-800 shadow-sm px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800 z-10 whitespace-nowrap pointer-events-none">
                              ${(day.amount / 1000).toFixed(1)}k
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">{day.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TARJETA NEGRA DE RENTABILIDAD */}
              <div className="bg-black dark:bg-slate-900 text-white rounded-3xl shadow-lg p-6 lg:sticky lg:top-[300px] border border-transparent dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-2 mb-8 opacity-90">
                  <Calculator />
                  <h2 className="text-xl font-bold">Resumen Financiero</h2>
                </div>

                <div className="space-y-6">
                  {/* Ingresos Totales */}
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Ingresos ({filterPeriod === 'all' ? 'Histórico' : filterPeriod === 'month' ? 'Mes' : 'Semana'})</p>
                    <p className="text-3xl font-bold">{formatCurrency(calculations.totalGross)}</p>
                  </div>

                  {/* Combustible */}
                  <div className="bg-white/10 dark:bg-black/20 rounded-2xl p-4 border border-white/5 dark:border-white/10">
                    <p className="text-slate-300 text-sm mb-3">Nafta a descontar de la ganancia:</p>
                    <div className="flex bg-black/50 dark:bg-slate-950 p-1 rounded-lg w-full mb-4">
                      <button onClick={() => setProfitMode('trip')} className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-all ${profitMode === 'trip' ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                        Consumo Trip
                      </button>
                      <button onClick={() => setProfitMode('logs')} className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-all ${profitMode === 'logs' ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                        Registro Cargas
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1.5 rounded-full font-medium">
                        {profitMode === 'trip' ? `${tripKm} km de viaje` : `${filteredFuelLogs.length} cargas reg.`}
                      </span>
                      <p className="text-xl font-semibold text-rose-400">
                        - {formatCurrency(calculations.appliedFuelCost)}
                      </p>
                    </div>
                  </div>

                  {/* Gastos */}
                  {calculations.totalExpensesAmount > 0 && (
                    <div className="flex justify-between items-center bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
                      <span className="text-amber-200 text-sm">Gastos varios</span>
                      <span className="font-semibold text-amber-400">- {formatCurrency(calculations.totalExpensesAmount)}</span>
                    </div>
                  )}

                  <div className="border-t border-white/20 my-4"></div>

                  {/* Ganancia de Bolsillo */}
                  <div>
                    <p className="text-emerald-400 text-sm font-medium mb-1 uppercase tracking-wider">Bolsillo Neto</p>
                    <p className="text-4xl md:text-5xl font-extrabold text-emerald-400 drop-shadow-sm">
                      {formatCurrency(calculations.netProfit)}
                    </p>
                  </div>

                  {/* Métricas Avanzadas (Horas, Viajes y Eficiencia) */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {calculations.totalHours > 0 && (
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1"><Clock size={14}/> <span className="text-xs">Ganancia / Hora</span></div>
                        <p className="text-white font-bold">{formatCurrency(calculations.netPerHour)}</p>
                      </div>
                    )}
                    {calculations.totalTrips > 0 && (
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1"><Route size={14}/> <span className="text-xs">Ticket Promedio</span></div>
                        <p className="text-white font-bold">{formatCurrency(calculations.grossPerTrip)}</p>
                      </div>
                    )}
                  </div>

                  {/* Rendimiento Inversión */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 mt-3">
                    <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 mt-1">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-emerald-300 text-sm font-medium">Rendimiento de Inversión</p>
                      <p className="text-white font-bold">
                        {calculations.efficiency} pesos <span className="text-slate-400 font-normal text-sm">ganados por cada $1 descontado en nafta.</span>
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}