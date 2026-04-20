import { useState, useEffect } from 'react';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const v = window.localStorage.getItem(key); return v ? JSON.parse(v) : initial; }
    catch { return initial; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.error(e); }
  }, [key, value]);
  return [value, setValue];
}
