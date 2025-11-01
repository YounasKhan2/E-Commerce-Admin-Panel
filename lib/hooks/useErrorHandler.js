import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/components/ui/ErrorMessage';

export default function useErrorHandler() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((err) => {
    console.error('Error:', err);
    setError(getErrorMessage(err));
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeAsync = useCallback(async (asyncFn, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      loadingMessage,
      successMessage 
    } = options;

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await asyncFn();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    error,
    isLoading,
    setError,
    setIsLoading,
    handleError,
    clearError,
    executeAsync
  };
}
