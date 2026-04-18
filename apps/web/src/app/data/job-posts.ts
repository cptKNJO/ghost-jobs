import "server-only";

import { db, eq } from "@repo/db";
import { jobPost, companies, statuses, sources } from "@repo/db/schema";
import { getProfile } from "./profile";

export async function getJobPosts() {
  const profile = await getProfile();
  if (!profile) return [];

  try {
    const posts = await db.query.jobPost.findMany({
      where: eq(jobPost.profileId, profile.id),
      with: {
        company: true,
        status: true,
        source: true,
      },
      orderBy: (jobPost, { desc }) => [desc(jobPost.appliedOn)],
    });

    return posts;
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return [];
  }
}

export async function getJobPostById(id: number) {
  const profile = await getProfile();
  if (!profile) return null;

  try {
    const post = await db.query.jobPost.findFirst({
      where: (jobPost, { and, eq }) =>
        and(eq(jobPost.id, id), eq(jobPost.profileId, profile.id)),
      with: {
        company: true,
        status: true,
        source: true,
      },
    });

    return post ?? null;
  } catch (error) {
    console.error("Error fetching job post by id:", error);
    return null;
  }
}

export async function getLookupData() {
  try {
    const [allStatuses, allCompanies, allSources] = await Promise.all([
      db.query.statuses.findMany(),
      db.query.companies.findMany(),
      db.query.sources.findMany(),
    ]);

    return {
      statuses: allStatuses,
      companies: allCompanies,
      sources: allSources,
    };
  } catch (error) {
    console.error("Error fetching lookup data:", error);
    return {
      statuses: [],
      companies: [],
      sources: [],
    };
  }
}
