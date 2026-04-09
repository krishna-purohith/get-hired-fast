import connectDB from "@/lib/db";
import { Board, Column, Jobs } from "@/lib/models";

const USER_ID = "69d72c9e5ae38c2d6f394764";

const SAMPLE_JOBS = [
  // Wish List
  {
    company: "Google",
    position: "Frontend Engineer",
    location: "Mountain View, CA",
    tags: ["React", "TypeScript", "Performance"],
    description: "Build scalable frontend systems used by billions of users",
    jobUrl: "https://example.com/jobs/1",
    salary: "$150k - $190k",
  },
  {
    company: "Airbnb",
    position: "Software Engineer (Frontend)",
    location: "Remote",
    tags: ["React", "GraphQL", "Design Systems"],
    description: "Develop high-quality user interfaces for global users",
    jobUrl: "https://example.com/jobs/2",
    salary: "$140k - $180k",
  },
  {
    company: "Spotify",
    position: "QA Automation Engineer",
    location: "Stockholm, Sweden",
    tags: ["Selenium", "Cypress", "CI/CD"],
    description: "Automate testing pipelines for music streaming platform",
    jobUrl: "https://example.com/jobs/3",
    salary: "$100k - $130k",
  },

  // Applied
  {
    company: "Amazon",
    position: "DevOps Engineer",
    location: "Austin, TX",
    tags: ["AWS", "Docker", "Kubernetes"],
    description: "Manage cloud infrastructure and deployment systems",
    jobUrl: "https://example.com/jobs/4",
    salary: "$120k - $150k",
  },
  {
    company: "PayPal",
    position: "Mobile Developer",
    location: "San Jose, CA",
    tags: ["React Native", "iOS", "Android"],
    description: "Build secure and scalable mobile payment applications",
    jobUrl: "https://example.com/jobs/5",
    salary: "$110k - $140k",
  },
  {
    company: "Adobe",
    position: "UI/UX Designer",
    location: "London, UK",
    tags: ["Figma", "UX Research", "Design Systems"],
    description: "Design intuitive digital experiences for creative tools",
    jobUrl: "https://example.com/jobs/6",
    salary: "$90k - $120k",
  },
  {
    company: "Netflix",
    position: "Platform Engineer",
    location: "Los Angeles, CA",
    tags: ["Distributed Systems", "Java", "AWS"],
    description: "Build resilient backend systems for streaming platform",
    jobUrl: "https://example.com/jobs/7",
    salary: "$140k - $180k",
  },

  // Interviewing
  {
    company: "Shopify",
    position: "Web Designer",
    location: "Toronto, Canada",
    tags: ["Figma", "React", "CSS"],
    description: "Create responsive and accessible e-commerce interfaces",
    jobUrl: "https://example.com/jobs/8",
    salary: "$95k - $120k",
  },
  {
    company: "Microsoft",
    position: "Product Manager",
    location: "Seattle, WA",
    tags: ["Product Strategy", "Agile", "Analytics"],
    description: "Drive product vision and roadmap for enterprise solutions",
    jobUrl: "https://example.com/jobs/9",
    salary: "$150k - $185k",
  },
  {
    company: "Zomato",
    position: "Mobile Developer",
    location: "Remote",
    tags: ["Flutter", "Dart", "Firebase"],
    description: "Develop scalable food delivery mobile applications",
    jobUrl: "https://example.com/jobs/10",
    salary: "$90k - $120k",
  },

  // Offer
  {
    company: "Atlassian",
    position: "Backend Engineer",
    location: "Sydney, Australia",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    description: "Develop APIs and backend systems for collaboration tools",
    jobUrl: "https://example.com/jobs/11",
    salary: "$110k - $140k",
  },
  {
    company: "Canva",
    position: "UI Designer",
    location: "Melbourne, Australia",
    tags: ["Figma", "Illustrator"],
    description: "Design user-friendly creative tools for millions of users",
    jobUrl: "https://example.com/jobs/12",
    salary: "$100k - $130k",
  },

  // Rejected
  {
    company: "Infosys",
    position: "Associate Engineer",
    location: "Bangalore, India",
    tags: ["Java", "Agile"],
    description: "Work on enterprise software development projects",
    jobUrl: "https://example.com/jobs/13",
    salary: "$6k - $10k",
  },
  {
    company: "TCS",
    position: "QA Tester",
    location: "Hyderabad, India",
    tags: ["Testing", "Automation"],
    description: "Perform manual and automated testing for enterprise apps",
    jobUrl: "https://example.com/jobs/14",
    salary: "$5k - $9k",
  },
  {
    company: "Wipro",
    position: "Data Analyst",
    location: "Pune, India",
    tags: ["Python", "SQL", "Data Analysis"],
    description: "Analyze business data and generate insights",
    jobUrl: "https://example.com/jobs/15",
    salary: "$7k - $11k",
  },
];

async function seed() {
  try {
    await connectDB();

    let board = await Board.findOne({ userId: USER_ID, name: "Job Hunt" });

    if (!board) {
      const { initializeUserBoard } = await import("../lib/init-user-board");
      board = await initializeUserBoard(USER_ID);
    }

    const columns = await Column.find({ boardId: board._id }).sort({
      order: 1,
    });

    if (columns.length === 0) {
      process.exit(1);
    }

    const columnMap: Record<string, string> = {};

    columns.forEach((c) => {
      columnMap[c.name] = c._id.toString();
    });

    for (const column of columns) {
      column.jobs = [];
      await column.save();
    }

    const jobsByColumn: Record<string, typeof SAMPLE_JOBS> = {
      "Wish List": SAMPLE_JOBS.slice(0, 3),
      Applied: SAMPLE_JOBS.slice(3, 7),
      Interviewing: SAMPLE_JOBS.slice(7, 10),
      Offer: SAMPLE_JOBS.slice(10, 12),
      Rejected: SAMPLE_JOBS.slice(12, 15),
    };

    let totalCreated = 0;

    for (const [columnName, jobs] of Object.entries(jobsByColumn)) {
      const columnId = columnMap[columnName];
      if (!columnId) {
        continue;
      }

      const column = columns.find((c) => c.name === columnName);
      if (!column) continue;

      for (const [key, j] of jobs.entries()) {
        const jobApplication = await Jobs.create({
          company: j.company,
          position: j.position,
          location: j.location,
          tags: j.tags,
          description: j.description,
          jobUrl: j.jobUrl,
          salary: j.salary,
          columnId: columnId,
          boardId: board._id,
          userId: USER_ID,
          status: columnName.toLowerCase().replace(" ", "-"),
          order: key * 100,
        });

        column.jobs.push(jobApplication._id);
        totalCreated++;
      }

      await column.save();
    }
    console.log(`\n🎉 Seed completed successfully!`);
    console.log(`📊 Created ${totalCreated} job applications`);
    console.log(`📋 Board: ${board.name}`);
    console.log(`👤 User ID: ${USER_ID}`);

    process.exit(0);
  } catch (err) {
    console.log("Error while seeding: ", err);
    process.exit(1);
  }
}

seed();
