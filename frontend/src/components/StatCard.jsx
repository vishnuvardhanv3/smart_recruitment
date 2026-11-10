import React from 'react';

export default function StatCard({ title, value, icon: Icon, change, trend = 'neutral', subtitle, color = 'indigo' }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        {(subtitle || change) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {change && (
              <span
                className={`font-semibold ${
                  trend === 'up'
                    ? 'text-emerald-600'
                    : trend === 'down'
                    ? 'text-rose-600'
                    : 'text-slate-500'
                }`}
              >
                {change}
              </span>
            )}
            {subtitle && <span className="text-slate-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

