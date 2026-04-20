import { useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCalculations } from './hooks/useCalculations';
import { filterByPeriod } from './utils/dateUtils';
import Header from './components/Header';
import TripCalculator from './components/TripCalculator';
import EarningsCard from './components/EarningsCard';
import FuelCard from './components/FuelCard';
import ExpenseCard from './components/ExpenseCard';
import BarChart from './components/BarChart';
import FinancialSummary from './components/FinancialSummary';

const INITIAL_EARNINGS = [
  { id: '1', date: '2026-03-10', amount: 49000, hours: 8,  trips: 15 },
  { id: '2', date: '2026-03-11', amount: 60000, hours: 9,  trips: 18 },
  { id: '3', date: '2026-03-12', amount: 52000, hours: 7,  trips: 14 },
  { id: '4', date: '2026-03-13', amount: 76000, hours: 10, trips: 22 },
];

export default function App() {
  const [isDarkMode,   setIsDarkMode]   = useLocalStorage('uber_theme',        false);
  const [tankCost,     setTankCost]     = useLocalStorage('uber_tankCost',      55000);
  const [tankAutonomy, setTankAutonomy] = useLocalStorage('uber_tankAutonomy',  400);
  const [tripKm,       setTripKm]       = useLocalStorage('uber_tripKm',        250);
  const [earnings,     setEarnings]     = useLocalStorage('uber_earnings',      INITIAL_EARNINGS);
  const [fuelLogs,     setFuelLogs]     = useLocalStorage('uber_fuelLogs',      [{ id: 'f1', date: '2026-03-10', amount: 55000 }]);
  const [expenses,     setExpenses]     = useLocalStorage('uber_expenses',      []);
  const [filterPeriod, setFilterPeriod] = useLocalStorage('uber_filterPeriod', 'all');
  const [profitMode,   setProfitMode]   = useLocalStorage('uber_profitMode',   'trip');

  const sorted = (arr) => [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));

  const filteredEarnings = useMemo(() => filterByPeriod(earnings,  filterPeriod), [earnings,  filterPeriod]);
  const filteredFuelLogs = useMemo(() => filterByPeriod(fuelLogs,  filterPeriod), [fuelLogs,  filterPeriod]);
  const filteredExpenses = useMemo(() => filterByPeriod(expenses,  filterPeriod), [expenses,  filterPeriod]);

  const calculations = useCalculations({ tankCost, tankAutonomy, tripKm, filteredEarnings, filteredFuelLogs, filteredExpenses, profitMode });

  const chartData = useMemo(() => {
    const days = [];
    let maxAmount = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const amount = earnings.filter(e => e.date === dateStr).reduce((s, e) => s + +e.amount, 0);
      if (amount > maxAmount) maxAmount = amount;
      days.push({ label: d.toLocaleDateString('es-AR', { weekday: 'short' }), amount });
    }
    return { days, maxAmount: maxAmount > 0 ? maxAmount : 1000 };
  }, [earnings]);

  const addSorted    = (setter, arr, entry) => setter(sorted([...arr, entry]));
  const deleteFn     = (setter, arr, id)    => setter(arr.filter(e => e.id !== id));
  const updateFn     = (setter, arr, entry) => setter(sorted(arr.map(e => e.id === entry.id ? entry : e)));

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header isDarkMode={isDarkMode} onToggleDark={() => setIsDarkMode(!isDarkMode)} filterPeriod={filterPeriod} onFilterChange={setFilterPeriod} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <TripCalculator
                tankCost={tankCost} tankAutonomy={tankAutonomy} tripKm={tripKm}
                onTankCost={setTankCost} onTankAutonomy={setTankAutonomy} onTripKm={setTripKm}
                consumedPercentage={calculations.consumedPercentage}
                consumedTripCost={calculations.consumedTripCost}
              />
              <EarningsCard
                earnings={earnings} filteredEarnings={filteredEarnings}
                onAdd={e => addSorted(setEarnings, earnings, e)}
                onDelete={id => deleteFn(setEarnings, earnings, id)}
                onUpdate={e => updateFn(setEarnings, earnings, e)}
              />
              <FuelCard
                fuelLogs={fuelLogs} filteredFuelLogs={filteredFuelLogs}
                onAdd={e => addSorted(setFuelLogs, fuelLogs, e)}
                onDelete={id => deleteFn(setFuelLogs, fuelLogs, id)}
                onUpdate={e => updateFn(setFuelLogs, fuelLogs, e)}
              />
              <ExpenseCard
                expenses={expenses} filteredExpenses={filteredExpenses}
                onAdd={e => addSorted(setExpenses, expenses, e)}
                onDelete={id => deleteFn(setExpenses, expenses, id)}
                onUpdate={e => updateFn(setExpenses, expenses, e)}
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <BarChart chartData={chartData} />
              <FinancialSummary
                calculations={calculations} filterPeriod={filterPeriod}
                profitMode={profitMode} onProfitMode={setProfitMode}
                tripKm={tripKm} filteredFuelLogs={filteredFuelLogs}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
