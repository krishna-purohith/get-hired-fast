"use client";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";

import useBoard from "@/lib/hooks/useBoards";
import { Board, Column, Jobs } from "@/lib/models/models.types";
import { ReactNode } from "react";
import CreateJobDialog from "./CreateJobDialog";
import JobApplicationCard from "./JobApplicationCard";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface KanbanProps {
  board: Board;
}

interface ColumnConfig {
  color: string;
  icon: ReactNode;
}

export const COLUMN_CONFIG: ColumnConfig[] = [
  {
    color: "bg-sky-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-indigo-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-teal-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-orange-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-pink-500",
    icon: <XCircle className="h-4 w-4" />,
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
    <Card className="min-w-60 max-w-75 shrink-0 shadow-md p-0">
      <CardHeader
        className={` text-white rounded-t-lg pb-3 pt-3  ${config.color}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            {config.icon}
            <CardTitle className="text-white text-base font-semibold">
              {column.name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20 cursor-pointer"
              >
                <MoreVertical size="16px" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2" h-4 w-4 /> Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-1 min-h-100">
        {jobsSorted.map((job, key) => (
          <SortableJobCard
            job={{ ...job, columnId: job.columnId || column._id }}
            key={key}
            columns={sortedColumns}
          />
        ))}

        <CreateJobDialog boardId={boardId} columnId={column._id} />
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

export default function Kanbanboard({ board }: KanbanProps) {
  const { columns } = useBoard(board);

  const columnsSorted = columns.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-auto pb-4">
        {columnsSorted.map((column, key) => {
          const config = COLUMN_CONFIG[key] || {
            color: "bg-sky-500",
            icon: <Calendar className="h-4 w-4" />,
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
    </div>
  );
}
