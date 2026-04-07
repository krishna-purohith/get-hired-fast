import Kanbanboard from "@/components/Kanbanboard";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getBoard(userId: string) {
  "use cache";

  await connectDB();

  const boardDoc = await Board.findOne({
    userId,
    name: "Job Search",
  }).populate({ path: "columns", populate: { path: "jobs" } });

  if (!boardDoc) return null;

  const board = JSON.parse(JSON.stringify(boardDoc));
  return board;
}

async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/signin");
  }
  const board = await getBoard(session.user.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-0.5 py-5">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">{board.name}</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>
        <Kanbanboard board={board} userId={session.user.id} />
      </div>
    </div>
  );
}

export default async function Dashboard() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DashboardPage />
    </Suspense>
  );
}
