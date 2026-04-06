function rough(updates: {
  company?: string;
  position?: string;
  location?: string;
  status?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  order?: number;
  columnId?: string;
  tags?: string[];
  description?: string;
}) {
  const { columnId, order, ...otherUpdates } = updates;
  console.log(columnId);
  console.log(order);
  console.log("otherUpdates: ");
  console.log(otherUpdates);
}

rough({
  order: 5,
  columnId: "24098243ur0293sidjf",

  company: "Google",
  position: "Frontend Engineer",
  location: "Mountain View, CA",
  tags: ["React", "TypeScript", "Performance"],
  description: "Build scalable frontend systems used by billions of users",
  jobUrl: "https://example.com/jobs/1",
  salary: "$150k - $190k",
});
