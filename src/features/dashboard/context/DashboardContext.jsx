import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllMetrics } from '../lib/getMetrics';
import { useAuth } from '../../../context/AuthContext';
import { get } from '../../../lib/fetch';

const DashboardContext = createContext();

// Custom hook to use DashboardContext
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// Custom hook for API keys (for compatibility with previous usage)
export function useApiKeys() {
  const { apiKeys, setApiKeys } = useDashboard();
  return { apiKeys, setApiKeys };
}

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [apiKeys, setApiKeys] = useState({}); // State for API keys
  const { user } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    async function fetchApiKeys() {
    // Fetch API keys from local storage or set default values
     const response = await get("/auth/key/get", { client_id: user.$id });
     const apiKeysArray = Array.isArray(response.data) ? response.data : [response.data];
      setApiKeys(apiKeysArray);

    }
    fetchApiKeys();    
  }, []);


  const fetchData = async (force = false) => {
    // Check if we should use cached data
    const now = Date.now();
    if (!force && data && lastFetchTime && (now - lastFetchTime) < CACHE_TTL) {
      return;
    }

    setLoading(true);
    try {
      const metrics = await getAllMetrics(null, apiKeys[0].key); // Pass API keys to getAllMetrics
      setData(metrics);
      setLastFetchTime(now);
      setError(null);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  const value = useMemo(() => ({
    data,
    loading,
    error,
    refreshData: () => fetchData(true),
    lastFetchTime,
    timeUntilRefresh: lastFetchTime ? Math.max(0, CACHE_TTL - (Date.now() - lastFetchTime)) : 0,
    apiKeys,
    setApiKeys
  }), [data, loading, error, lastFetchTime, apiKeys, setApiKeys]);

return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}