import { PollCard } from "@/components/polls/poll-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data - replace with actual data fetching
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Choose your preferred programming language for web development",
    totalVotes: 142,
    createdAt: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "2", 
    title: "Best frontend framework for 2024?",
    description: "Which frontend framework do you think will dominate in 2024?",
    totalVotes: 186,
    createdAt: new Date("2024-01-10"),
    isActive: true,
  },
  {
    id: "3", 
    title: "Remote work preferences",
    description: "How do you prefer to work?",
    totalVotes: 147,
    createdAt: new Date("2023-12-20"),
    isActive: false,
  },
];

export default function PollsPage() {
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
        {mockPolls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>

      {mockPolls.length === 0 && (
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
