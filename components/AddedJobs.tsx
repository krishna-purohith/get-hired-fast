import { Column } from "@/lib/models/models.types";

interface AddedJobsProps {
  column: Column;
}
const AddedJobs = async ({ column }: AddedJobsProps) => {
  return (
    <div>
      <div>
        {column.jobs.map((job) => (
          <>
            <div>{job.company}</div>
            <div>{job.description}</div>
            <div>{job.jobUrl}</div>
            <div>{job.location}</div>
            <div>{job.position}</div>
            <div>{job.salary}</div>
            <div>{job.status}</div>
            <div>{job.tags}</div>
          </>
        ))}
      </div>
    </div>
  );
};
export default AddedJobs;
