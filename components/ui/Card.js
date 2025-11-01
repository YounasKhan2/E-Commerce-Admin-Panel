export default function Card({ children, title, action, className = '' }) {
  return (
    <div className={`bg-sidebar border border-slate-700 rounded-xl ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {title && (
            <h3 className="text-white text-lg font-semibold">{title}</h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
