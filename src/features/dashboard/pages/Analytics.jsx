import { Card, Text, Title, Metric, Badge } from "@tremor/react";
import { useDashboard } from '../context/DashboardContext';
import TopBar from '../components/TopBar';

const generateInsights = (data) => {
  // Safe data extraction with defaults
  const userBehavior = data?.userBehavior || {};
  
  // Engagement Analysis
  const userEngagement = Array.isArray(userBehavior.userEngagement) ? userBehavior.userEngagement : [];
  const highEngagement = userEngagement.find(e => e?.engagementLevel?.toLowerCase() === 'high')?.count || 0;
  const lowEngagement = userEngagement.find(e => e?.engagementLevel?.toLowerCase() === 'low')?.count || 0;
  const totalEngagement = highEngagement + lowEngagement;
  const engagementRatio = totalEngagement > 0 ? highEngagement / totalEngagement : 0;

  // Session Duration Analysis
  const sessionDuration = Array.isArray(userBehavior.sessionDuration) ? userBehavior.sessionDuration : [];
  const shortSessions = sessionDuration.find(d => d?.durationRange?.includes('0-1'))?.count || 0;
  const totalSessions = sessionDuration.reduce((sum, d) => sum + (parseInt(d?.count) || 0), 0);
  const shortSessionRatio = totalSessions > 0 ? shortSessions / totalSessions : 0;

  // Device & Browser Analysis
  const deviceDistribution = Array.isArray(userBehavior.deviceDistribution) ? userBehavior.deviceDistribution : [];
  const desktopUsers = deviceDistribution.find(d => d?.deviceType?.toLowerCase() === 'desktop')?.count || 0;
  const mobileUsers = deviceDistribution.find(d => d?.deviceType?.toLowerCase() === 'mobile')?.count || 0;
  const totalDeviceUsers = desktopUsers + mobileUsers;
  const mobileRatio = totalDeviceUsers > 0 ? mobileUsers / totalDeviceUsers : 0;

  // Connection Analysis
  const connectionAnalysis = Array.isArray(userBehavior.connectionAnalysis) ? userBehavior.connectionAnalysis : [];
  const slowConnections = connectionAnalysis.filter(c => {
    const effectiveType = c?.effectiveType?.toLowerCase();
    const downlink = parseFloat(c?.avgDownlink) || 0;
    return effectiveType === '3g' || downlink < 2;
  }).reduce((sum, c) => sum + (parseInt(c?.count) || 0), 0);

  const insights = [];
  const actions = [];

  // Engagement Insights
  if (totalEngagement > 0 && engagementRatio < 0.5) {
    insights.push({
      title: "Low User Engagement",
      description: "Only a small portion of users are highly engaged with your content",
      severity: "high",
      metric: `${(engagementRatio * 100).toFixed(1)}% high engagement ratio`
    });
    actions.push({
      title: "Improve Content Engagement",
      steps: [
        "Add interactive elements to key pages",
        "Implement gamification features",
        "Create more engaging call-to-actions"
      ]
    });
  }

  // Session Duration Insights
  if (totalSessions > 0 && shortSessionRatio > 0.6) {
    insights.push({
      title: "High Bounce Rate",
      description: "Most users are leaving within the first minute",
      severity: "high",
      metric: `${(shortSessionRatio * 100).toFixed(1)}% of sessions are under 1 minute`
    });
    actions.push({
      title: "Reduce Bounce Rate",
      steps: [
        "Optimize page load times",
        "Improve above-the-fold content",
        "Add clear value propositions"
      ]
    });
  }

  // Device Insights
  if (totalDeviceUsers > 0 && mobileRatio > 0.6) {
    insights.push({
      title: "Mobile-First Audience",
      description: "Your audience primarily uses mobile devices",
      severity: "medium",
      metric: `${(mobileRatio * 100).toFixed(1)}% mobile traffic`
    });
    actions.push({
      title: "Mobile Optimization",
      steps: [
        "Ensure responsive design on all pages",
        "Optimize images for mobile",
        "Implement mobile-friendly navigation"
      ]
    });
  }

  // Connection Insights
  if (slowConnections > 0) {
    insights.push({
      title: "Slow Connection Impact",
      description: "Some users experience slow connection speeds",
      severity: "medium",
      metric: `${slowConnections} users on slow connections`
    });
    actions.push({
      title: "Performance Optimization",
      steps: [
        "Implement lazy loading for images",
        "Minimize JavaScript bundle size",
        "Enable browser caching"
      ]
    });
  }

  return { insights, actions };
};

const Analytics = () => {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="p-6">
        <Title>Loading Analytics...</Title>
        <Text>Please wait while we fetch your data</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Title>Error</Title>
        <Text className="text-red-500">{error}</Text>
      </div>
    );
  }

  if (!data || !data.userBehavior) {
    return (
      <div className="p-6">
        <Title>No Data Available</Title>
        <Text>There is no analytics data to display at this time</Text>
      </div>
    );
  }

  const { insights, actions } = generateInsights(data);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1 bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <Title className="text-2xl font-bold">Analytics Insights</Title>
            <Text className="text-gray-600 mt-2">Actionable insights based on your metrics</Text>
          </div>

          {insights.length === 0 ? (
            <Card className="p-6 bg-gray-50">
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Title className="text-xl text-gray-700">No Significant Issues Detected</Title>
                  <Text className="text-gray-500 mt-2">Your current metrics are within expected ranges. Continue monitoring for any changes.</Text>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Insights Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <Title className="text-xl font-semibold">Key Insights</Title>
                  <Badge color="blue" size="sm">
                    {insights.length} Issues Found
                  </Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {insights.map((insight, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-start gap-4">
                        <div className={`w-2 h-20 rounded-full ${
                          insight.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Title className="text-lg font-semibold">{insight.title}</Title>
                            <Badge 
                              color={insight.severity === 'high' ? 'red' : 'yellow'}
                              size="sm"
                            >
                              {insight.severity}
                            </Badge>
                          </div>
                          <Text className="mt-2 text-gray-600">{insight.description}</Text>
                          <Metric className="mt-4 text-xl">{insight.metric}</Metric>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Actions Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <Title className="text-xl font-semibold">Recommended Actions</Title>
                  <Badge color="green" size="sm">
                    {actions.length} Actions
                  </Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {actions.map((action, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <Title className="p-2 text-lg font-semibold">{action.title}</Title>
                        </div>
                        <ul className="space-y-3 pl-4">
                          {action.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-3">
                              <div className="mt-1.5 flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-blue-200" />
                              </div>
                              <Text className="text-gray-700 leading-relaxed">{step}</Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;