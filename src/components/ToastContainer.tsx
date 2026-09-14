import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md transition-all duration-300 ${
            t.type === 'success'
              ? 'bg-stone-900/95 text-white border-stone-800'
              : t.type === 'error'
              ? 'bg-rose-900/95 text-white border-rose-800'
              : 'bg-stone-800/95 text-white border-stone-700'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />}
          <p className="text-xs font-medium leading-snug flex-1">{t.message}</p>
        </div>
      ))}
    </div>
  );
};
