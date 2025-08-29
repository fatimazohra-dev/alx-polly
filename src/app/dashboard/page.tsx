import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentPolls } from "@/components/dashboard/recent-polls";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getUser();

  // Handle case when Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertDescription>
            Authentication is not configured. Please set up your Supabase environment variables to access the dashboard.
            <br />
            <Link href="/" className="underline">Return to homepage</Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Redirect to login if not authenticated (when Supabase is configured)
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertDescription>
            Please <Link href="/login" className="underline">sign in</Link> to access your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.user_metadata?.name || user.email}
          </p>
        </div>
        <Button asChild>
          <Link href="/polls/create">Create New Poll</Link>
        </Button>
      </div>

      <div className="space-y-8">
        <DashboardStats />
        <RecentPolls />
      </div>
    </div>
  );
}
