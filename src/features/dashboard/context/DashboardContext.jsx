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
      // Try to get API keys from localStorage first
      const storedKeys = localStorage.getItem('apiKeys');
      if (storedKeys) {
        try {
          const parsedKeys = JSON.parse(storedKeys);
          setApiKeys(parsedKeys);
          return;
        } catch (e) {
          // If parsing fails, continue to fetch from API
        }
      }
      // Fetch API keys from API if not in localStorage
      const response = await get("/auth/key/get", { client_id: user.$id });
      const apiKeysArray = Array.isArray(response.data) ? response.data : [response.data];
      setApiKeys(apiKeysArray);
      localStorage.setItem('apiKeys', JSON.stringify(apiKeysArray));
    }
    fetchApiKeys();
  }, []);

  // Fetch data when apiKeys changes and is a non-empty array
  useEffect(() => {
    if (Array.isArray(apiKeys) && apiKeys.length > 0) {
      fetchData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeys]);

  const fetchData = async (force = false) => {
    // Check if we should use cached data
    const now = Date.now();
    if (!force && data && lastFetchTime && (now - lastFetchTime) < CACHE_TTL) {
      return;
    }

    setLoading(true);
    try {
      // Ensure apiKeys is an array and has at least one element
      const key = Array.isArray(apiKeys) && apiKeys.length > 0 ? apiKeys[0].key : null;
      if (!key) {
        throw new Error('No API key available');
      }
      const metrics = await getAllMetrics(null, key); // Pass API key to getAllMetrics
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