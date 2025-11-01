/**
 * MetricCard Component
 * Displays a key metric with value, label, percentage change, and trend indicator
 */

export default function MetricCard({ 
  label, 
  value, 
  icon, 
  change, 
  trend = 'neutral',
  loading = false 
}) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-slate-400';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'trending_up';
    if (trend === 'down') return 'trending_down';
    return 'trending_flat';
  };

  if (loading) {
    return (
      <div className="bg-sidebar border border-slate-700 rounded-xl p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-slate-700 rounded"></div>
        </div>
        <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
        <div className="h-8 bg-slate-700 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="bg-sidebar border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="material-symbols-outlined text-primary text-3xl">
          {icon}
        </span>
        {change !== undefined && change !== null && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            <span className="material-symbols-outlined text-base">
              {getTrendIcon()}
            </span>
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
