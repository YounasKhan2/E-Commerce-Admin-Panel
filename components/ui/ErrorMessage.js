import Button from './Button';

export default function ErrorMessage({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  error = null,
  onRetry = null,
  showDetails = false,
  variant = 'error' // 'error', 'warning', 'info'
}) {
  const variantStyles = {
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: 'error',
      iconColor: 'text-red-500',
      textColor: 'text-red-400'
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      icon: 'warning',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-400'
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: 'info',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-400'
    }
  };

  const styles = variantStyles[variant] || variantStyles.error;

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <span className={`material-symbols-outlined ${styles.iconColor} text-2xl`}>
          {styles.icon}
        </span>
        
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm mb-1">
            {title}
          </h3>
          
          <p className={`${styles.textColor} text-sm mb-3`}>
            {message}
          </p>

          {showDetails && error && (
            <details className="mb-3">
              <summary className={`${styles.textColor} text-xs cursor-pointer hover:underline`}>
                Show error details
              </summary>
              <pre className="mt-2 p-2 bg-background-dark rounded text-xs text-slate-400 overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}

          {onRetry && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              icon="refresh"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline error message for forms
export function InlineError({ message }) {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-1 text-red-400 text-xs mt-1">
      <span className="material-symbols-outlined text-sm">
        error
      </span>
      <span>{message}</span>
    </div>
  );
}

// Empty state with optional action
export function EmptyState({ 
  icon = 'inbox',
  title = 'No data found',
  message = 'There are no items to display.',
  action = null,
  actionLabel = 'Add New',
  onAction = null
}) {
  return (
    <div className="bg-sidebar rounded-lg p-12 text-center">
      <span className="material-symbols-outlined text-slate-600 text-6xl mb-4 block">
        {icon}
      </span>
      
      <h3 className="text-white font-medium text-lg mb-2">
        {title}
      </h3>
      
      <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
        {message}
      </p>

      {(action || onAction) && (
        <Button
          variant="primary"
          onClick={onAction}
          icon="add"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// API Error handler utility
export function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  
  if (error?.message) return error.message;
  
  if (error?.response?.data?.message) return error.response.data.message;
  
  if (error?.code === 'ECONNABORTED') return 'Request timeout. Please try again.';
  
  if (error?.code === 'ERR_NETWORK') return 'Network error. Please check your connection.';
  
  return 'An unexpected error occurred. Please try again.';
}
