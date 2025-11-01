export default function Badge({ children, variant = 'neutral', size = 'md' }) {
  const variants = {
    success: 'bg-positive/10 text-positive border-positive/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    danger: 'bg-negative/10 text-negative border-negative/20',
    info: 'bg-primary/10 text-primary border-primary/20',
    neutral: 'bg-slate-700/50 text-slate-300 border-slate-600',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
