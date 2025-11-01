export default function Input({
  label,
  error,
  helperText,
  icon,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-slate-300 text-sm font-medium mb-2">
          {label}
          {props.required && <span className="text-negative ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
            {icon}
          </span>
        )}
        
        <input
          className={`
            w-full px-3 py-2 bg-background-dark border rounded-lg text-white text-sm placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-negative' : 'border-slate-600'}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-negative text-xs">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-slate-400 text-xs">{helperText}</p>
      )}
    </div>
  );
}
