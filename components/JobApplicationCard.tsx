"use client";

import { Column, Jobs } from "@/lib/models/models.types";
import { deleteJob, updateJob } from "@/lib/serverActions/jobApplications";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface JobApplicationCardProps {
  job: Jobs;
  columns: Column[];
}

const JobApplicationCard = ({ job, columns }: JobApplicationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
    notes: job.notes || "",
  });

  async function handleDelete() {
    try {
      const result = await deleteJob(job._id);
      if (result.error) {
        console.log("Failed to delte job: ", result.error);
      }
    } catch (err) {
      console.log("Failed to delete job: ", err);
    }
  }

  async function handleUpdate(e: React.SubmitEvent) {
    e.preventDefault();
    try {
      const result = await updateJob(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
      });

      if (!result.error) {
        setIsEditing(false);
      }
    } catch (error) {
      console.log("Failed to update job: ", error);
    }
  }
  async function handleMove(columnId: string, columnName: string) {
    try {
      const result = updateJob(job._id, {
        columnId: columnId,
        status: columnName,
      });
    } catch (error) {
      console.log("Failed to move job: ", error);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {job.company}
              </p>
              {job.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {job.description}
                </p>
              )}
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {job.tags.map((tag, key) => (
                    <span
                      className="text-pink-700 text-xs bg-pink-100 px-2 py-0.5 rounded-lg"
                      key={key}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {job.jobUrl && (
                <a
                  className="inline-flex items-center gap-1 text-xs text-primary cursor-pointer"
                  target="_blank"
                  href={job.jobUrl}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
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
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {columns.length > 1 && (
                    <>
                      {columns
                        .filter((c) => c._id !== job.columnId)
                        .map((col, key) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => handleMove(col._id, col.name)}
                          >
                            Move to {col.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-3" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Job Application</DialogTitle>
            <DialogDescription>Track a new job application</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div>
              <div className="space-y-5">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      required
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      placeholder="e.g., $100k - $150k"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joburl">Job URL</Label>
                  <Input
                    id="joburl"
                    placeholder="http://..."
                    type="url"
                    value={formData.jobUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, jobUrl: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-seperated)</Label>
                  <Input
                    id="tags"
                    placeholder="React, Tailwind, High Pay"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the role..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default JobApplicationCard;
