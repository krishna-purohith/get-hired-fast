"use server";

import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, Jobs } from "../models";

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;

  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
  notes?: string;

  boardId: string;
  columnId: string;
}
export async function addJob(data: JobApplicationData) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const {
    company,
    position,
    location,
    salary,
    jobUrl,
    tags,
    description,
    notes,
    boardId,
    columnId,
  } = data;

  if (!boardId || !columnId || !company || !position) {
    return { error: "Missing required fields" };
  }

  await connectDB();
  const boardDoc = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });
  if (!boardDoc) {
    return { error: "user doesn't own the board" };
  }

  const columnDoc = await Column.findOne({ _id: columnId, boardId: boardId });
  if (!columnDoc) {
    return { error: "column doesn't belong to the board" };
  }

  const currentOrder =
    ((await Jobs.findOne({ columnId })
      .sort({ order: -1 })
      .select("order")
      .lean()) as { order: number }) || null;

  const jobApplication = await Jobs.create({
    company,
    position,
    location,
    salary,
    jobUrl,
    tags: tags || [],
    description,
    notes,
    boardId,
    columnId,
    userId: session.user.id,
    order: currentOrder ? currentOrder.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { Jobs: jobApplication._id },
  });

  return { data: JSON.parse(JSON.stringify(jobApplication)) };
}
