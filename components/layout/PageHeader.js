export default function PageHeader({ title, description, action }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-3xl font-bold leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-slate-400 text-base leading-normal">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </header>
  );
}
