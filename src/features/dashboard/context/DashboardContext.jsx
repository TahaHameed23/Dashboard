import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllMetrics } from '../lib/getMetrics';

const DashboardContext = createContext();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const fetchData = async (force = false) => {
    // Check if we should use cached data
    const now = Date.now();
    if (!force && data && lastFetchTime && (now - lastFetchTime) < CACHE_TTL) {
      return;
    }

    setLoading(true);
    try {
      const metrics = await getAllMetrics({});
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
    timeUntilRefresh: lastFetchTime ? Math.max(0, CACHE_TTL - (Date.now() - lastFetchTime)) : 0
  }), [data, loading, error, lastFetchTime]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
} 