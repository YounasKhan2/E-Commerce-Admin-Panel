export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="bg-sidebar rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="border-b border-slate-700 p-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1">
              <div className="h-4 bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-slate-700/50 p-3">
          <div className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 1 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-sidebar rounded-lg p-4">
          <div className="h-4 bg-slate-700 rounded w-1/2 mb-3 animate-pulse" />
          <div className="h-8 bg-slate-700 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-3 bg-slate-700/50 rounded w-1/3 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 5 }) {
  return (
    <div className="bg-sidebar rounded-lg p-6 space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <div className="h-3 bg-slate-700 rounded w-24 mb-2 animate-pulse" />
          <div className="h-10 bg-slate-700/50 rounded animate-pulse" />
        </div>
      ))}
      
      <div className="flex gap-3 pt-4">
        <div className="h-10 bg-slate-700 rounded w-24 animate-pulse" />
        <div className="h-10 bg-slate-700/50 rounded w-24 animate-pulse" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-sidebar rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-slate-700/50 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-sidebar rounded-lg p-6">
      <div className="h-4 bg-slate-700 rounded w-1/3 mb-6 animate-pulse" />
      <div className="h-64 bg-slate-700/30 rounded animate-pulse" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-sidebar rounded-lg p-6">
        <div className="h-8 bg-slate-700 rounded w-1/3 mb-4 animate-pulse" />
        <div className="flex gap-4">
          <div className="h-6 bg-slate-700/50 rounded w-24 animate-pulse" />
          <div className="h-6 bg-slate-700/50 rounded w-24 animate-pulse" />
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-sidebar rounded-lg p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-slate-700 rounded w-1/4 mb-2 animate-pulse" />
              <div className="h-4 bg-slate-700/50 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
        
        <div className="bg-sidebar rounded-lg p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-slate-700 rounded w-1/4 mb-2 animate-pulse" />
              <div className="h-4 bg-slate-700/50 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
