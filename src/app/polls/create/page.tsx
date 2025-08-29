import { CreatePollForm } from "@/components/polls/create-poll-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function CreatePollPage() {
  const user = await getUser();

  // Handle case when Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Alert>
          <AlertDescription>
            Authentication is not configured. You can still create polls, but they won&apos;t be saved to a database.
            <br />
            Please set up your Supabase environment variables for full functionality.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Poll (Demo Mode)</CardTitle>
              <CardDescription>
                Create a poll to gather opinions from your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreatePollForm />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (when Supabase is configured)
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Alert>
          <AlertDescription>
            Please <Link href="/login" className="underline">sign in</Link> to create a poll.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
          <CardDescription>
            Create a poll to gather opinions from your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePollForm />
        </CardContent>
      </Card>
    </div>
  );
}
