import { get } from "../../../lib/fetch";

async function fetchMetricsData(endpoint, params, apiKey) {
  try {
    const response = await get(`/analytics${endpoint}`, params, apiKey);
    return response;
  } catch (error) {
    console.error(`Error fetching metrics from ${endpoint}:`, error);
    throw error;
  }
}

// Function to get date range for comparison
function getDateRanges() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30); // Last 30 days

  const previousEnd = new Date(start);
  const previousStart = new Date(start);
  previousStart.setDate(previousStart.getDate() - 30); // Previous 30 days

  return {
    current: {
      start: start.toISOString(),
      end: end.toISOString()
    },
    previous: {
      start: previousStart.toISOString(),
      end: previousEnd.toISOString()
    }
  };
}

// Retention metrics
export async function getRetentionMetrics(params, apiKey) {
  return fetchMetricsData('/retention', params, apiKey);
}

// Top pages metrics
export async function getTopPagesMetrics(params, apiKey) {
  return fetchMetricsData('/top-pages', params, apiKey);
}

// User behavior metrics
export async function getUserBehaviorMetrics(params, apiKey) {
  return fetchMetricsData('/user-behavior', params, apiKey);
}

// Overview metrics with comparison
export async function getOverviewMetrics(params, apiKey) {
  const dateRanges = getDateRanges();

  const [currentData, previousData] = await Promise.all([
    fetchMetricsData('/overview', { ...params, ...dateRanges.current }, apiKey),
    fetchMetricsData('/overview', { ...params, ...dateRanges.previous }, apiKey)
  ]);

  return {
    current: currentData,
    previous: previousData,
    comparison: {
      totalUsers: calculatePercentageChange(
        parseInt(previousData.totalUsers),
        parseInt(currentData.totalUsers)
      ),
      activeSessions: calculatePercentageChange(
        parseInt(previousData.activeSessions),
        parseInt(currentData.activeSessions)
      ),
      pageViews: calculatePercentageChange(
        parseInt(previousData.pageViews),
        parseInt(currentData.pageViews)
      ),
      avgSessionDuration: calculatePercentageChange(
        parseInt(previousData.avgSessionDuration),
        parseInt(currentData.avgSessionDuration)
      )
    }
  };
}

// Helper function to calculate percentage change
function calculatePercentageChange(previous, current) {
  if (previous === 0) return 100; // Handle division by zero
  return ((current - previous) / previous) * 100;
}

// Function to fetch all metrics at once
export async function getAllMetrics(params, apiKey) {
  try {
    const [retention, topPages, userBehavior, overview] = await Promise.all([
      getRetentionMetrics(params, apiKey),
      getTopPagesMetrics(params, apiKey),
      getUserBehaviorMetrics(params, apiKey),
      getOverviewMetrics(params, apiKey)
    ]);
    
    return {
      retention,
      topPages,
      userBehavior,
      overview
    };
  } catch (error) {
    console.error('Error fetching all metrics:', error);
    throw error;
  }
}