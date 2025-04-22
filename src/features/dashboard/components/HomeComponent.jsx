/* eslint-disable react/prop-types */
import { Card, Metric, Text, Grid, Title, BarChart, DonutChart, Legend, Divider, ScatterChart, FunnelChart } from "@tremor/react";
import { Suspense } from 'react';
import DashboardSkeleton from './DashboardSkeleton';

const KpiCard = ({ title, value, percentageChange, unit = "" }) => {
  const isPositive = percentageChange >= 0;
  const color = isPositive ? "emerald" : "red";
  
  return (
    <Card>
      <div className="flex justify-between items-start">
        <Text>{title}</Text>
        <div className={`px-2 py-1 rounded-md bg-${color}-100 text-${color}-600 text-sm font-medium`}>
          {isPositive ? "+" : ""}{percentageChange.toFixed(1)}%
        </div>
      </div>
      <Metric>{value}{unit}</Metric>
      <div className="text-sm text-gray-500 mt-1">
        vs last period
      </div>
    </Card>
  );
};

function DashboardContent({ data }) {
  // Format data for charts
  const userEngagementData = data.userBehavior.userEngagement.map(item => ({
    name: item.engagementLevel,
    value: parseInt(item.count)
  }));

  const sessionDurationData = data.userBehavior.sessionDuration.map(item => ({
    name: item.durationRange,
    'Number of Users': parseInt(item.count)
  }));

  const deviceDistributionData = data.userBehavior.deviceDistribution.map(item => ({
    name: item.deviceType,
    value: parseInt(item.count)
  }));

  const browserDistributionData = data.userBehavior.browserDistribution.map(item => ({
    name: item.browser,
    value: parseInt(item.count)
  }));

  const interactionFrequencyData = data.userBehavior.interactionFrequency.map(item => ({
    name: item.frequency,
    'Count': parseInt(item.count)
  }));

  // Prepare data for Session Quality Matrix
  const sessionQualityData = data.userBehavior.sessionDuration.map(duration => {
    const interactionCount = data.userBehavior.interactionFrequency.find(
      freq => freq.frequency === duration.durationRange
    );
    return {
      duration: duration.durationRange,
      interactions: interactionCount ? parseInt(interactionCount.count) : 0,
      sessions: parseInt(duration.count)
    };
  });

  // Calculate average interactions
  const totalInteractions = interactionFrequencyData.reduce((sum, item) => sum + item.Count, 0);
  const totalSessions = sessionDurationData.reduce((sum, item) => sum + item['Number of Users'], 0);
  const averageInteractions = totalInteractions / totalSessions;

  // Prepare page flow data
  const pageFlowData = data.userBehavior.entryPageAnalysis.map(entry => {
    const exit = data.userBehavior.exitPageAnalysis.find(exit => exit.page === entry.page);
    const duration = exit ? parseFloat(exit.avgDuration) : 0;
    const bounceRate = parseFloat(entry.bounceRate);
    
    // Calculate value score based on duration and bounce rate
    const valueScore = duration * (1 - bounceRate / 100);
    
    return {
      page: entry.page || 'Unknown',
      entryCount: parseInt(entry.count),
      exitCount: exit ? parseInt(exit.count) : 0,
      avgDuration: duration,
      bounceRate: bounceRate,
      valueScore: valueScore
    };
  }).sort((a, b) => b.valueScore - a.valueScore);
  
  return (
    <div className="space-y-8 mt-8">
      {/* Overview Section */}
      <section className="space-y-4">
        <Title>Overview</Title>
        <Text>Key performance indicators for your website</Text>
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
          <KpiCard
            title="Total Users"
            value={data.overview.current.totalUsers}
            percentageChange={data.overview.comparison.totalUsers}
          />
          <KpiCard
            title="Active Sessions"
            value={data.overview.current.activeSessions}
            percentageChange={data.overview.comparison.activeSessions}
          />
          <KpiCard
            title="Page Views"
            value={data.overview.current.pageViews}
            percentageChange={data.overview.comparison.pageViews}
          />
          <KpiCard
            title="Avg Session Duration"
            value={Math.round(data.overview.current.avgSessionDuration / 60)}
            percentageChange={data.overview.comparison.avgSessionDuration}
            unit=" min"
          />
        </Grid>
      </section>

      <Divider />

      {/* User Behavior Section */}
      <section className="space-y-4">
        <Title>User Behavior</Title>
        <Text>How users interact with your website</Text>
        <Grid numItems={1} numItemsLg={2} className="gap-6">
          <Card>
            <Title>User Engagement Distribution</Title>
            <Legend
              className="mt-2"
              categories={["High", "Medium", "Low"]}
              colors={["emerald", "yellow", "red"]}
            />
            <DonutChart
              className="mt-6"
              data={userEngagementData}
              category="value"
              index="name"
              colors={["emerald", "yellow", "red"]}
            />
          </Card>
          <Card>
            <Title>Session Duration Distribution</Title>
            <BarChart
              className="mt-6"
              data={sessionDurationData}
              index="name"
              categories={['Number of Users']}
              colors={["blue"]}
            />
          </Card>
        </Grid>
      </section>

      <Divider />

      {/* Device & Browser Section */}
      <section className="space-y-4">
        <Title>Device & Browser Analytics</Title>
        <Text>Distribution of devices and browsers used by your visitors</Text>
        <Grid numItems={1} numItemsLg={2} className="gap-6">
          <Card>
            <Title>Device Distribution</Title>
            <DonutChart
              className="mt-6"
              data={deviceDistributionData}
              category="value"
              index="name"
              colors={["blue", "violet", "indigo"]}
            />
          </Card>
          <Card>
            <Title>Browser Distribution</Title>
            <DonutChart
              className="mt-6"
              data={browserDistributionData}
              category="value"
              index="name"
              colors={["blue", "violet", "indigo", "cyan"]}
            />
          </Card>
        </Grid>
      </section>

      <Divider />

      {/* User Interaction Section */}
      <section className="space-y-4">
        <Title>User Interaction Patterns</Title>
        <Text>How frequently users interact with your website</Text>
        <Card>
          <BarChart
            className="mt-6"
            data={interactionFrequencyData}
            index="name"
            categories={['Count']}
            colors={["blue"]}
            showLegend={false}
          />
        </Card>
      </section>

      <Divider />

      {/* Engagement Funnel Section */}
      <section className="space-y-4">
        <Title>Engagement Funnel</Title>
        <Text>User progression through engagement levels</Text>
        <Card>
          <FunnelChart
            className="h-80"
            data={userEngagementData
              .sort((a, b) => {
                const order = { 'Low': 0, 'Medium': 1, 'High': 2 };
                return order[a.name] - order[b.name];
              })}
            index="name"
            category="value"
            colors={["blue", "violet", "indigo"]}
            valueFormatter={(value) => `${value} users`}
          />
        </Card>
      </section>

      <Divider />

      {/* Session Quality Matrix Section */}
      <section className="space-y-4">
        <Title>Session Quality Matrix</Title>
        <Text>Relationship between session duration and interactions</Text>
        <Card>
          <ScatterChart
            className="h-80"
            data={sessionQualityData}
            category="duration"
            x="interactions"
            y="sessions"
            size="sessions"
            colors={["blue"]}
            showLegend={false}
            valueFormatter={(value) => `${value} sessions`}
          />
        </Card>
      </section>

      <Divider />

      {/* Interaction Patterns Section */}
      <section className="space-y-4">
        <Title>Interaction Patterns</Title>
        <Text>Distribution of user interactions with average overlay</Text>
        <Card>
          <BarChart
            className="h-80"
            data={interactionFrequencyData}
            index="name"
            categories={['Count']}
            colors={["blue"]}
            showLegend={false}
            valueFormatter={(value) => `${value} users`}
          />
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-gray-400" />
              <Text className="text-gray-500">Average: {averageInteractions.toFixed(1)} interactions per session</Text>
            </div>
          </div>
        </Card>
      </section>

      <Divider />

      {/* Geographic Analysis Section */}
      <section className="space-y-4">
        <Title>Geographic Analysis</Title>
        <Text>User distribution across different locations</Text>
        <Grid numItems={1} numItemsLg={2} className="gap-6">
          <Card>
            <Title>Top Locations</Title>
            <div className="mt-4 space-y-4">
              {data.userBehavior.geoAnalysis
                .filter(item => item.city && item.country)
                .sort((a, b) => parseInt(b.count) - parseInt(a.count))
                .map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <Text className="font-medium">{item.city}, {item.country}</Text>
                      <Text className="text-gray-500">
                        Coordinates: {parseFloat(item.avgLatitude).toFixed(3)}, {parseFloat(item.avgLongitude).toFixed(3)}
                      </Text>
                    </div>
                    <Text className="font-medium">{item.count} visits</Text>
                  </div>
                ))}
            </div>
          </Card>
          <Card>
            <Title>Location Statistics</Title>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <Text>Total Locations</Text>
                <Text className="font-medium">{data.userBehavior.geoAnalysis.length}</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Most Active City</Text>
                <Text className="font-medium">
                  {data.userBehavior.geoAnalysis
                    .sort((a, b) => parseInt(b.count) - parseInt(a.count))[0]?.city || 'N/A'}
                </Text>
              </div>
            </div>
          </Card>
        </Grid>
      </section>

      <Divider />

      {/* Connection Analysis Section */}
      <section className="space-y-4">
        <Title>Connection Analysis</Title>
        <Text>Network performance and connection types</Text>
        <Grid numItems={1} numItemsLg={2} className="gap-6">
      <Card>
            <Title>Connection Types</Title>
            <DonutChart
              className="mt-6"
              data={data.userBehavior.connectionAnalysis
                .filter(item => item.effectiveType)
                .map(item => ({
                  name: item.effectiveType.toUpperCase(),
                  value: parseInt(item.count)
                }))}
              category="value"
              index="name"
              colors={["blue", "violet", "indigo"]}
            />
      </Card>
      <Card>
            <Title>Network Performance</Title>
            <div className="mt-4 space-y-4">
              {data.userBehavior.connectionAnalysis
                .filter(item => item.effectiveType)
                .map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <Text className="font-medium">{item.effectiveType.toUpperCase()}</Text>
                    <div className="text-right">
                      <Text>Avg RTT: {Math.round(item.avgRtt)}ms</Text>
                      <Text>Avg Downlink: {parseFloat(item.avgDownlink).toFixed(2)} Mbps</Text>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </Grid>
      </section>

      <Divider />

      {/* Retention Section */}
      <section className="space-y-4">
        <Title>User Retention</Title>
        <Text>Comparison of returning and new users</Text>
        <Grid numItems={1} numItemsSm={2} className="gap-6">
          <Card>
            <Text>Returning Users</Text>
            <Metric>{data.retention.returnRate.returning}</Metric>
      </Card>
      <Card>
            <Text>New Users</Text>
            <Metric>{data.retention.returnRate.new}</Metric>
          </Card>
        </Grid>
      </section>

      <Divider />

      {/* Page Flow Analysis Section */}
      <section className="space-y-4">
        <Title>Page Flow Analysis</Title>
        <Text>User journey patterns and high-value paths</Text>
        <Grid numItems={1} numItemsLg={2} className="gap-6">
          <Card>
            <Title>Entry & Exit Points</Title>
            <div className="mt-4 space-y-4">
              {pageFlowData.map((page, index) => (
                <div key={index} className="relative">
                  <div className={`p-4 rounded-lg ${
                    page.valueScore > 1000 ? 'bg-blue-50' : 
                    page.valueScore > 500 ? 'bg-violet-50' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <Text className="font-medium">{page.page}</Text>
                        <Text className="text-sm text-gray-500">
                          {page.entryCount} entries • {page.exitCount} exits
                        </Text>
                      </div>
                      <div className="text-right">
                        <Text className="font-medium">
                          {page.avgDuration.toFixed(0)}s avg
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {page.bounceRate.toFixed(1)}% bounce
                        </Text>
                      </div>
                    </div>
                  </div>
                  {index < pageFlowData.length - 1 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
      </Card>
      <Card>
            <Title>Path Value Analysis</Title>
            <div className="mt-4">
              <BarChart
                className="h-80"
                data={pageFlowData}
                index="page"
                categories={['valueScore']}
                colors={['blue']}
                valueFormatter={(value) => `${value.toFixed(0)} pts`}
                showLegend={false}
              />
              <div className="mt-4 text-sm text-gray-500">
                <p>Value score = Duration × (1 - Bounce Rate)</p>
                <p>Higher scores indicate more valuable user paths</p>
              </div>
            </div>
      </Card>
    </Grid>
      </section>
    </div>
  );
}

export default function HomeComponent({ data, loading, error }) {
  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Title>Error</Title>
        <Text className="text-red-500">{error}</Text>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent data={data} />
    </Suspense>
  );
}
