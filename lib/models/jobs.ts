import mongoose, { Document, Schema, Types } from "mongoose";

interface IJobs extends Document {
  company: string;
  position: string;
  location?: string;
  status: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
  notes?: string;
  columnId: Types.ObjectId;
  boardId: Types.ObjectId;
  userId: string;
  order: number;
  appliedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobsSchema = new Schema<IJobs>(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
    },
    jobUrl: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    notes: {
      type: String,
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "Column",
      required: true,
      index: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      requried: true,
      index: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    appliedDate: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.models.Jobs ||
  mongoose.model<IJobs>("Jobs", JobsSchema);
