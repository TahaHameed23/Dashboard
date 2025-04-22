import { Card, Grid } from "@tremor/react";

const SkeletonCard = () => (
  <Card className="animate-ping">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-300 rounded"></div>
      </div>
      <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
    </div>
    <div className="mt-4">
      <div className="h-3 w-full bg-gray-100 rounded"></div>
      <div className="h-3 w-3/4 bg-gray-100 rounded mt-2"></div>
    </div>
  </Card>
);

const SkeletonChart = () => (
  <Card className="animate-ping">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="h-48 bg-gray-100 rounded"></div>
    <div className="mt-4 flex justify-between">
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
    </div>
  </Card>
);

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top KPIs Skeleton */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Grid>

      {/* Charts Skeleton */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </Grid>

      {/* Distribution Charts Skeleton */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </Grid>

      {/* Interaction Frequency Skeleton */}
      <SkeletonChart />

      {/* Retention Rate Skeleton */}
      <Card className="animate-ping">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <Grid numItems={1} numItemsSm={2} className="gap-6 mt-6">
          <SkeletonCard />
          <SkeletonCard />
        </Grid>
      </Card>
    </div>
  );
} 