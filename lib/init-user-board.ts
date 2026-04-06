import connectDB from "./db";
import { Board, Column } from "./models";

export async function initializeUserBoard(userId: string) {
  try {
    await connectDB();

    const existingBoard = await Board.findOne({ userId });
    if (existingBoard) {
      return existingBoard;
    }
    const board = await Board.create({
      name: "Job Hunt",
      userId: userId,
      columns: [],
    });

    const jobStatus = [
      "Wish List",
      "Applied",
      "Interviewing",
      "Offer",
      "Rejected",
    ];

    const columnArray = jobStatus.map((name, index) => ({
      name: name,
      boardId: board._id,
      order: index,
      jobs: [],
    }));

    const columnDocs = await Column.create(columnArray);

    board.columns = columnDocs.map((c) => c._id);

    await board.save();

    return board;
  } catch (error) {
    console.log(error);
  }
}
