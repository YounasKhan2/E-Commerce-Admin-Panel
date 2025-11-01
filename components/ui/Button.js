export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white',
    secondary: 'bg-sidebar hover:bg-slate-700 text-white border border-slate-600',
    danger: 'bg-negative hover:bg-negative/90 text-white',
    ghost: 'hover:bg-white/10 text-white',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-base">
            progress_activity
          </span>
          Loading...
        </>
      ) : (
        <>
          {icon && (
            <span className="material-symbols-outlined text-base">
              {icon}
            </span>
          )}
          {children}
        </>
      )}
    </button>
  );
}
