import { PollDetails } from "@/components/polls/poll-details";
import { notFound } from "next/navigation";
import { Poll } from "@/lib/types";

async function getPoll(id: string): Promise<Poll | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/polls/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) {
        return null; // Poll not found
      }
      // Log other server-side errors
      console.error(`API error: ${res.status} ${res.statusText}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch poll:", error);
    return null; // Handle network errors
  }
}

export default async function PollPage({ params }: { params: { id: string } }) {
  const poll = await getPoll(params.id);

  if (!poll) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <PollDetails poll={poll} />
    </div>
  );
}
