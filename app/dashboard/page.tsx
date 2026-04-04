import Kanbanboard from "@/components/Kanbanboard";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/signin");
  }

  await connectDB();
  const boardDoc = await Board.findOne({
    userId: session.user.id,
    name: "Job Hunt",
  })
    .populate("columns")
    .select("name order jobs");

  const board = JSON.parse(JSON.stringify(boardDoc));

  console.log("board: ", board);

  interface Columns {
    name: string;
    order: number;
    jobs: string[];
  }
  [] = board.columns;

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
