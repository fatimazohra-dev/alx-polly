import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data - replace with actual data fetching
const mockRecentPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    totalVotes: 142,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Best time for team meetings?",
    totalVotes: 23,
    isActive: true,
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "Which project should we prioritize?",
    totalVotes: 67,
    isActive: false,
    createdAt: new Date("2024-01-10"),
  },
];

export function RecentPolls() {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Polls</CardTitle>
        <CardDescription>Your latest poll activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecentPolls.map((poll) => (
            <div key={poll.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium line-clamp-1">{poll.title}</h4>
                  <Badge variant={poll.isActive ? "default" : "secondary"}>
                    {poll.isActive ? "Active" : "Closed"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {poll.totalVotes} votes • Created {formatDate(poll.createdAt)}
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/polls/${poll.id}`}>View</Link>
              </Button>
            </div>
          ))}
          
          {mockRecentPolls.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No polls yet.</p>
              <Button asChild className="mt-4">
                <Link href="/polls/create">Create your first poll</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
