import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Poll } from "@/lib/types";

interface PollCardProps {
  poll: Omit<Poll, 'options' | 'allowMultipleVotes' | 'createdBy' | 'hasVoted' | 'userVotes'>;
}

export function PollCard({ poll }: PollCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{poll.title}</CardTitle>
          <Badge variant={poll.isActive ? "default" : "secondary"}>
            {poll.isActive ? "Active" : "Closed"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {poll.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <div>{poll.totalVotes} votes</div>
            <div>Created {formatDate(poll.createdAt)}</div>
          </div>
          <Button asChild size="sm">
            <Link href={`/polls/${poll.id}`}>
              {poll.isActive ? "Vote" : "View Results"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
