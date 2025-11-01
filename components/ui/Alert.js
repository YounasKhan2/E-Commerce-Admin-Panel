export default function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  icon,
}) {
  const variants = {
    success: {
      bg: 'bg-positive/10',
      border: 'border-positive/20',
      text: 'text-positive',
      icon: 'check_circle',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-500',
      icon: 'warning',
    },
    danger: {
      bg: 'bg-negative/10',
      border: 'border-negative/20',
      text: 'text-negative',
      icon: 'error',
    },
    info: {
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      text: 'text-primary',
      icon: 'info',
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`rounded-lg border p-4 ${style.bg} ${style.border}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className={`material-symbols-outlined ${style.text}`}>
          {icon || style.icon}
        </span>
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold text-sm mb-1 ${style.text}`}>
              {title}
            </h4>
          )}
          <div className="text-slate-300 text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
