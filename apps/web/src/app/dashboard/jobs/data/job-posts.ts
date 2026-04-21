import "server-only";

import { db, eq, and } from "@repo/db";
import { companies, jobPost, sources } from "@repo/db/schema";
export { type Status, type Company, type Source } from "@repo/db/schema";
import { getProfile } from "../../profile/data/profile";
import {
  companySchema,
  jobPostSchema,
  sourceSchema,
  type CompanySchema,
  type JobPost,
  type SourceSchema,
} from "../utils/schema";

function formatDateStringForDB(text: string) {
  const date = new Date(text);

  return date;
}

function cleanPost(post: JobPost, profileId: number) {
  // We need to parse again to actually get the (cleaned) output since Tanstack Form doesn't let you get it for server function above
  const cleaned = jobPostSchema.parse(post);

  const formattedPost = {
    ...cleaned,
    appliedOn: post.appliedOn ? formatDateStringForDB(post.appliedOn) : null,
    repliedOn: post.repliedOn ? formatDateStringForDB(post.repliedOn) : null,
    profileId: profileId,
  };

  return formattedPost;
}

export async function createCompany(data: CompanySchema) {
  const profile = await getProfile();
  if (!profile) return null;

  const cleaned = companySchema.parse(data);

  try {
    const [inserted] = await db.insert(companies).values(cleaned).returning();

    return inserted;
  } catch (error) {
    // Throw the supabase error - not the drizzle error
    throw Error("Failed to save the company", { cause: error.cause });
  }
}

export async function createSource(data: SourceSchema) {
  const profile = await getProfile();
  if (!profile) return null;

  const cleaned = sourceSchema.parse(data);

  try {
    const [inserted] = await db.insert(sources).values(cleaned).returning();

    return inserted;
  } catch (error) {
    throw Error("Failed to save the source", { cause: error.cause });
  }
}

export async function createJobPost(post: JobPost) {
  const profile = await getProfile();
  if (!profile) return [];

  const formattedPost = cleanPost(post, profile.id);

  try {
    const insertedJobPost = await db.insert(jobPost).values(formattedPost);

    return insertedJobPost;
  } catch (error) {
    throw Error("Failed to save the data", { cause: error });
  }
}

export async function editJobPost(id: number, post: JobPost) {
  const profile = await getProfile();
  if (!profile) return [];

  const formattedPost = cleanPost(post, profile.id);

  try {
    const [updatedRow] = await db
      .update(jobPost)
      .set(formattedPost)
      .where(
        and(
          eq(jobPost.id, id),
          eq(jobPost.profileId, profile.id), // Authorization gate
        ),
      )
      .returning({ id: jobPost.id });

    // If updatedRow is undefined, the ID/Profile didn't match
    if (!updatedRow) {
      return {
        success: false,
        message: "Update failed: job not found or unauthorized.",
      };
    }
  } catch (error) {
    throw Error("Failed to save the data", { cause: error });
  }
}

export async function deleteJobPost(id: number) {
  const profile = await getProfile();
  if (!profile) return null;

  try {
    await db
      .delete(jobPost)
      .where(and(eq(jobPost.id, id), eq(jobPost.profileId, profile.id)));
  } catch (error) {
    throw Error("Failed to delete the job post", { cause: error });
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
      columns: {
        profileId: false,
      },
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
      db.query.statuses.findMany({
        columns: { id: true, name: true },
        orderBy: (statuses, { asc }) => [asc(statuses.name)],
      }),
      db.query.companies.findMany({
        orderBy: (companies, { asc }) => [asc(companies.name)],
      }),
      db.query.sources.findMany({
        orderBy: (sources, { asc }) => [asc(sources.name)],
      }),
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
