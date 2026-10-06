import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = "Loading information...", size = "md" }) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-brand-500 animate-spin mb-3`} />
      <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>
    </div>
  );
}
