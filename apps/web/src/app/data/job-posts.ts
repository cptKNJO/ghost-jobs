import "server-only";

import { db, eq } from "@repo/db";
import { jobPost } from "@repo/db/schema";
import { getProfile } from "./profile";
import { jobPostSchema, type JobPost } from "../dashboard/utils/schema";
export { type Status, type Company, type Source } from "@repo/db/schema";

function formatDateStringForDB(text: string) {
  const date = new Date(text);

  return date;
}

export async function createJobPost(post: JobPost) {
  const profile = await getProfile();
  if (!profile) return [];

  // We need to parse again to actually get the (cleaned) output since Tanstack Form doesn't let you get it for server function above
  const cleaned = jobPostSchema.parse(post);

  const formattedPost = {
    ...cleaned,
    appliedOn: post.appliedOn ? formatDateStringForDB(post.appliedOn) : null,
    repliedOn: post.repliedOn ? formatDateStringForDB(post.repliedOn) : null,
    profileId: profile.id,
  };

  try {
    const insertedJobPost = await db.insert(jobPost).values([formattedPost]);

    return insertedJobPost;
  } catch (error) {
    console.error("Error creating job post:", error);
    return [];
  }
}

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
      db.query.statuses.findMany({ columns: { id: true, name: true } }),
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
