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
import { Board, Column } from "@/lib/models/models.types";
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import JobDetailDialog from "./JobDetailDialog";

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
}: {
  config: ColumnConfig;
  column: Column;
  boardId: string;
}) {
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
      <CardContent className="text-gray-500 ml-8 mt-10">
        <JobDetailDialog boardId={boardId} columnId={column._id} />
      </CardContent>
    </Card>
  );
}

export default function Kanbanboard({ board, userId }: KanbanProps) {
  const columns = board.columns;

  return (
    <div className="mt-8 flex">
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
          />
        );
      })}
    </div>
  );
}
