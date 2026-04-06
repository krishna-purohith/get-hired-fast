"use client";
import { useState } from "react";
import { Board, Column } from "../models/models.types";

export default function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
  const [error, setError] = useState<string | null>(null);

  async function moveJob(
    jobId: string,
    newColumnId: string,
    newOrder: number
  ) {}

  return { board, columns, error, moveJob };
}
