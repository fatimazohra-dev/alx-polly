import { PollCard } from "@/components/polls/poll-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Poll } from "@/lib/types";

async function getPolls(): Promise<Poll[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/polls`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch polls');
  }
  return res.json();
}

export default async function PollsPage() {
  const polls = await getPolls();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Polls</h1>
          <p className="text-muted-foreground mt-2">
            Browse and vote on community polls
          </p>
        </div>
        <Button asChild>
          <Link href="/polls/create">Create New Poll</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No polls found.</p>
          <Button asChild className="mt-4">
            <Link href="/polls/create">Create the first poll</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
