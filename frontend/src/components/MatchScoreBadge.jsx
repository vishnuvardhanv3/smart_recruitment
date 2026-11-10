import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function MatchScoreBadge({ score = 0, onClick, showIcon = true }) {
  let colorStyles = {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    bar: 'bg-emerald-500',
  };

  if (score < 60) {
    colorStyles = {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
      bar: 'bg-rose-500',
    };
  } else if (score < 75) {
    colorStyles = {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      bar: 'bg-amber-500',
    };
  } else if (score < 88) {
    colorStyles = {
      bg: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      bar: 'bg-blue-500',
    };
  }

  const isClickable = !!onClick;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
        colorStyles.bg
      } ${isClickable ? 'cursor-pointer shadow-xs hover:scale-102' : 'cursor-default'}`}
      title={isClickable ? 'Click to inspect ATS scoring breakdown' : 'ATS Resume Match Score'}
    >
      {showIcon && <Sparkles className="w-3.5 h-3.5 text-current shrink-0" />}
      <span>{score}% Match</span>
      {isClickable && <HelpCircle className="w-3 h-3 text-current opacity-70 shrink-0" />}
    </button>
  );
}

