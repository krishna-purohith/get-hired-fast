import mongoose, { Document, model, models, Schema, Types } from "mongoose";

interface IColumn extends Document {
  name: string;
  boardId: Types.ObjectId;
  order: number;
  jobs: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
  {
    name: {
      type: String,
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      index: true,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    jobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Jobs",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Column ||
  mongoose.model<IColumn>("Column", ColumnSchema);
