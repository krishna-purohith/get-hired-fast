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
    <div className=" mx-auto overflow-auto ">
      <div className="w-full p-5">
        <div className="text-black text-3xl font-semibold">{board.name}</div>
        <p className="text-gray-700">Track your job applications</p>
        <div>
          <Kanbanboard board={board} userId={session.user.id} />
        </div>
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
