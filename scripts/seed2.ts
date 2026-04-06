import connectDB from "@/lib/db";
import { Board, Column, Jobs } from "@/lib/models";

const BOARD_ID = "69d22035c153bc7a8275589a";

async function seedUpdate() {
  try {
    await connectDB();

    const columns = await Column.find({ boardId: BOARD_ID })
      .select("jobs")
      .lean();

    for (const column of columns) {
      const jobsInColumn = await Jobs.find({
        _id: { $in: column.jobs },
      })
        .sort({ order: 1 })
        .lean();

      for (const job of jobsInColumn) {
        await Jobs.findByIdAndUpdate(job._id, {
          $set: { order: job.order * 100 },
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
}

seedUpdate();
