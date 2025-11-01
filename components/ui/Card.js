export default function Card({ children, title, action, className = '' }) {
  return (
    <div className={`bg-sidebar border border-slate-700 rounded-xl overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 border-b border-slate-700">
          {title && (
            <h3 className="text-white text-base md:text-lg font-semibold">{title}</h3>
          )}
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-3 md:p-4">{children}</div>
    </div>
  );
}
