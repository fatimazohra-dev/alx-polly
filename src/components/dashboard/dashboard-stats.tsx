import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace with actual data fetching
const mockStats = {
  totalPolls: 12,
  activePolls: 8,
  totalVotes: 1247,
  totalViews: 3892,
};

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
          <span className="text-2xl">📊</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockStats.totalPolls}</div>
          <CardDescription>All-time created polls</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
          <span className="text-2xl">✅</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockStats.activePolls}</div>
          <CardDescription>Currently accepting votes</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          <span className="text-2xl">🗳️</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockStats.totalVotes}</div>
          <CardDescription>Across all your polls</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <span className="text-2xl">👁️</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockStats.totalViews}</div>
          <CardDescription>Poll page visits</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
