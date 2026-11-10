import React from 'react';

export default function LoadingSpinner({ text = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
      <p className="text-xs font-medium text-slate-500">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
}

