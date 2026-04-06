import { Column, Jobs } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { updateJob } from "@/lib/serverActions/jobApplications";

interface JobApplicationCardProps {
  job: Jobs;
  columns: Column[];
}

const JobApplicationCard = ({ job, columns }: JobApplicationCardProps) => {
  async function handleMove(columnId: string) {
    try {
      const result = updateJob(job._id, { columnId });
    } catch (error) {
      console.log("Failed to move job: ", error);
    }
  }

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{job.position}</h3>
              <p>{job.company}</p>
              {job.description && <p>{job.description}</p>}
              {job.tags && job.tags.length > 0 && (
                <div>
                  {job.tags.map((tag, key) => (
                    <span key={key}>{tag}</span>
                  ))}
                </div>
              )}
              {job.jobUrl && (
                <a
                  target="_blank"
                  href={job.jobUrl}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink />
                </a>
              )}
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit2 /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {columns.length > 1 && (
                    <>
                      {columns
                        .filter((c) => c._id !== job.columnId)
                        .map((col, key) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => handleMove(col._id)}
                          >
                            Move to {col.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 /> <span className="text-destructive">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
export default JobApplicationCard;
