export interface Jobs {
  _id: string;
  company: string;
  position: string;
  location?: string;
  status: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  order: number;
  columnId: string;
  tags?: string[];
  description?: string;
}

export interface Board {
  _id: string;
  name: string;
  columns: Column[];
}

export interface Column {
  _id: string;
  name: string;
  order: number;
  jobs: Jobs[];
}
