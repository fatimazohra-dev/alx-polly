import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Alx Polly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, share, and vote on polls. Gather opinions from your community 
            and make data-driven decisions together.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button asChild size="lg">
              <Link href="/polls">Browse Polls</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/polls/create">Create Poll</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🗳️</span>
                Easy Voting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simple and intuitive voting interface. Cast your vote with just one click 
                and see real-time results.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Real-time Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Watch results update in real-time as votes come in. Beautiful charts 
                and analytics to visualize the data.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Quick Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create polls in seconds with our streamlined form. Add multiple options, 
                set deadlines, and share instantly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
