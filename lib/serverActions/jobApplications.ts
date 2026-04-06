"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, Jobs } from "../models";
import jobs from "../models/jobs";

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
export async function createJob(data: JobApplicationData) {
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

  const currentOrder = (await Jobs.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;

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
    $push: { jobs: jobApplication._id },
  });

  revalidatePath("/dashboard");

  return {
    data: JSON.parse(JSON.stringify(jobApplication)),
  };
}

export async function updateJob(
  id: string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    status?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    order?: number;
    columnId?: string;
    tags?: string[];
    description?: string;
  }
) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const jobDoc = await jobs.findById(id);

  if (!jobDoc) {
    return { error: "Job not found" };
  }

  if (jobDoc.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const { columnId, order, ...otherUpdates } = updates;

  const updatesToApply: Partial<{
    order: number;
    columnId: string;
    company: string;
    position: string;
    location: string;
    status: string;
    notes: string;
    salary: string;
    jobUrl: string;
    tags: string[];
    description: string;
  }> = otherUpdates;

  const currentColumnId = jobDoc.columnId.toString();
  const newColumnId = columnId?.toString();

  const isJobMovingToDiffColumn =
    newColumnId && newColumnId !== currentColumnId;

  if (isJobMovingToDiffColumn) {
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { jobs: id },
    });

    const jobsInTargetColumn = await Jobs.find({
      columnId: newColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    let newOrder: number = 0;

    if (order !== undefined && order !== null) {
      newOrder = order * 100;

      const jobsToMoveToMakeSpace = jobsInTargetColumn.filter(
        (j) => j.order >= newOrder
      );

      for (const j of jobsToMoveToMakeSpace) {
        await Jobs.findByIdAndUpdate(j._id, {
          $set: { order: j.order + 100 },
        });
      }
    } else {
      if (jobsInTargetColumn.length > 0) {
        const lastJobOrder =
          jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
        newOrder = lastJobOrder + 100;
      } else {
        newOrder = 0;
      }
    }

    updatesToApply.order = newOrder;
    updatesToApply.columnId = newColumnId;

    await Column.findByIdAndUpdate(newColumnId, {
      $push: { jobs: id },
    });
  } else if (order !== undefined && order !== null) {
    const otherJobsInSameColumn = await Jobs.find({
      columnId: currentColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    const currentJobOrder = jobDoc.order || 0;
    const currentJobPositionIndex = otherJobsInSameColumn.findIndex(
      (j) => j.order > currentJobOrder
    );

    const oldPositionIndex =
      currentJobPositionIndex === -1
        ? otherJobsInSameColumn.length
        : currentJobPositionIndex;

    const newOrder = order * 100;

    if (order < oldPositionIndex) {
      const jobsToShiftDown = otherJobsInSameColumn.slice(
        order,
        oldPositionIndex
      );

      for (const j of jobsToShiftDown) {
        await Jobs.findByIdAndUpdate(j._id, {
          $set: { order: j.order + 100 },
        });
      }
    } else if (order > oldPositionIndex) {
      const jobsToShiftUp = otherJobsInSameColumn.slice(
        oldPositionIndex,
        order
      );

      for (const j of jobsToShiftUp) {
        const decreasedOrder = Math.max(0, j.order - 100);
        await Jobs.findByIdAndUpdate(j._id, {
          $set: { order: decreasedOrder },
        });
      }
    }

    updatesToApply.order = newOrder;
  }

  const updatedJobs = await Jobs.findByIdAndUpdate(
    id,
    { $set: updatesToApply },
    {
      returnDocument: "after",
    }
  );

  revalidatePath("/dashboard");
  return { data: JSON.parse(JSON.stringify(updatedJobs)) };
}
