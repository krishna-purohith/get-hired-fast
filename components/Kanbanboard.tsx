"use client";
import {
  Award,
  Calendar,
  CheckCircle2,
  EllipsisVertical,
  Mic,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Board, Column, Jobs } from "@/lib/models/models.types";
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import JobDetailDialog from "./JobDetailDialog";
import JobApplicationCard from "./JobApplicationCard";

interface KanbanProps {
  board: Board;
  userId: string;
}

interface ColumnConfig {
  color: string;
  icon: ReactNode;
}

export const COLUMN_CONFIG: ColumnConfig[] = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-3 w-3" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-3 w-3" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-3 w-3" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-3 w-3" />,
  },
];

function DroppableColumn({
  config,
  column,
  boardId,
  sortedColumns,
}: {
  config: ColumnConfig;
  column: Column;
  boardId: string;
  sortedColumns: Column[];
}) {
  const jobsSorted = column.jobs.sort((a, b) => a.order - b.order);

  return (
    <Card className="w-75 min-h-120 border rounded-2xl shadow-md">
      <CardHeader
        className={`w-full h-15  text-white flex items-center justify-between px-4 ${config.color}`}
      >
        <div className="flex gap-3 items-center">
          {config.icon}
          <p className="text-lg font-medium">{column.name}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical size="16px" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button variant="ghost" size="xs">
                {<Trash2 />} Delete Column
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="text-gray-500 mt-10 space-y-4">
        {jobsSorted.map((job, key) => (
          <SortableJobCard
            job={{ ...job, columnId: job.columnId || column._id }}
            key={key}
            columns={sortedColumns}
          />
        ))}
        <JobDetailDialog boardId={boardId} columnId={column._id} />
      </CardContent>
    </Card>
  );
}

function SortableJobCard({ job, columns }: { job: Jobs; columns: Column[] }) {
  return (
    <div>
      <JobApplicationCard job={job} columns={columns} />
    </div>
  );
}

export default function Kanbanboard({ board, userId }: KanbanProps) {
  const columns = board.columns;

  const columnsSorted = columns.sort((a, b) => a.order - b.order);

  return (
    <div className="mt-8">
      {columns.map((column, key) => {
        const config = COLUMN_CONFIG[key] || {
          color: "bg-cyan-500",
          icon: <Calendar className="h-3 w-3" />,
        };
        return (
          <DroppableColumn
            key={key}
            config={config}
            column={column}
            boardId={board._id}
            sortedColumns={columnsSorted}
          />
        );
      })}
    </div>
  );
}
