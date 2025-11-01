'use client';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <span className="material-symbols-outlined animate-spin text-primary">
        progress_activity
      </span>
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-sidebar border border-slate-700 rounded-xl p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        <p className="text-white text-sm">{message}</p>
      </div>
    </div>
  );
}

export function LoadingBar({ progress = 0 }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-slate-700 z-50">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function InlineLoader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <LoadingSpinner size="md" />
      <span className="text-slate-400 text-sm">{text}</span>
    </div>
  );
}

export function ButtonLoader() {
  return (
    <span className="material-symbols-outlined animate-spin text-base">
      progress_activity
    </span>
  );
}

export default LoadingSpinner;
