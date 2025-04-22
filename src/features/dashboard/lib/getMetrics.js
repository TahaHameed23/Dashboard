import { get } from "../../../lib/fetch";

// Base function for fetching metrics with error handling
async function fetchMetricsData(endpoint, params) {
  try {
    const response = await get(`/analytics${endpoint}`, params);
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
export async function getRetentionMetrics(params) {
  return fetchMetricsData('/retention', params);
}

// Top pages metrics
export async function getTopPagesMetrics(params) {
  return fetchMetricsData('/top-pages', params);
}

// User behavior metrics
export async function getUserBehaviorMetrics(params) {
  return fetchMetricsData('/user-behavior', params);
}

// Overview metrics with comparison
export async function getOverviewMetrics(params) {
  const dateRanges = getDateRanges();
  
  const [currentData, previousData] = await Promise.all([
    fetchMetricsData('/overview', { ...params, ...dateRanges.current }),
    fetchMetricsData('/overview', { ...params, ...dateRanges.previous })
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
export async function getAllMetrics(params) {
  try {
    const [retention, topPages, userBehavior, overview] = await Promise.all([
      getRetentionMetrics(params),
      getTopPagesMetrics(params),
      getUserBehaviorMetrics(params),
      getOverviewMetrics(params)
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