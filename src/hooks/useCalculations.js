import { useMemo } from 'react';

export function useCalculations({ tankCost, tankAutonomy, tripKm, filteredEarnings, filteredFuelLogs, filteredExpenses, profitMode }) {
  return useMemo(() => {
    const totalGross = filteredEarnings.reduce((s, e) => s + (+e.amount || 0), 0);
    const totalHours  = filteredEarnings.reduce((s, e) => s + (+e.hours  || 0), 0);
    const totalTrips  = filteredEarnings.reduce((s, e) => s + (+e.trips  || 0), 0);
    const totalFuelLogsAmount   = filteredFuelLogs.reduce((s, e) => s + (+e.amount || 0), 0);
    const totalExpensesAmount   = filteredExpenses.reduce((s, e) => s + (+e.amount || 0), 0);
    const safeAutonomy          = tankAutonomy > 0 ? tankAutonomy : 1;
    const consumedPercentage    = Math.min(1, tripKm / safeAutonomy);
    const consumedTripCost      = tankCost * consumedPercentage;
    const appliedFuelCost       = profitMode === 'trip' ? consumedTripCost : totalFuelLogsAmount;
    const netProfit             = totalGross - appliedFuelCost - totalExpensesAmount;
    const efficiency            = appliedFuelCost > 0 ? (totalGross / appliedFuelCost).toFixed(2) : 0;
    const netPerHour            = totalHours > 0 ? (netProfit / totalHours).toFixed(0) : 0;
    const grossPerTrip          = totalTrips > 0 ? (totalGross / totalTrips).toFixed(0) : 0;
    return { totalGross, totalFuelLogsAmount, totalExpensesAmount, consumedPercentage, consumedTripCost, appliedFuelCost, netProfit, efficiency, totalHours, totalTrips, netPerHour, grossPerTrip };
  }, [tankCost, tankAutonomy, tripKm, filteredEarnings, filteredFuelLogs, filteredExpenses, profitMode]);
}
