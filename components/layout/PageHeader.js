export default function PageHeader({ title, description, action }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-slate-400 text-sm md:text-base leading-normal">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 flex-wrap">
          {action}
        </div>
      )}
    </header>
  );
}
