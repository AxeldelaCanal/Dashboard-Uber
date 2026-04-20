export const formatCurrency = (v) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

export const inputCls = "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 outline-none dark:text-white transition-colors";
export const inlineCls = "px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded focus:ring-1 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 dark:text-white transition-colors";
