# Job Post CRUD Implementation Plan

This document outlines the plan for implementing CRUD operations for job applications (job_post) in the dashboard.

## 1. UI Components (shadcn/ui)
We will use the following components from `@repo/ui`:
- `Card`: For individual job application cards in a grid view.
- `Button`: For "Add Application", "Edit", and "Delete" actions.
- `Dialog` (Sheet or Modal): For the Add/Edit form.
- `Input`: For role and post link.
- `Select`: For status, company, and source selection.
- `Badge`: To display the application status.
- `Skeleton`: For loading states.

## 2. Dashboard Layout (`apps/web/src/app/dashboard/page.tsx`)
- **Header**: "My Applications" title and a "New Application" button.
- **Empty State**: Illustration or message when no applications exist.
- **Grid/List**: Display `JobPostCard` components.

## 3. Data Flow & Server Actions
We will create a new file `apps/web/src/app/dashboard/actions.ts` to handle CRUD operations:

### Actions:
- `getJobPostsAction()`: Fetches job posts for the current user, joining with `companies`, `statuses`, and `sources`.
- `createJobPostAction(formData)`: Validates and inserts a new job post.
- `updateJobPostAction(id, formData)`: Updates an existing job post.
- `deleteJobPostAction(id)`: Deletes a job post.
- `getLookupDataAction()`: Fetches available statuses, companies, and sources for form dropdowns.

## 4. Implementation Steps

### Phase 1: Data Access & Actions
1. Create `apps/web/src/app/data/job-posts.ts` for DAL (Data Access Layer) functions.
2. Create `apps/web/src/app/dashboard/actions.ts` for Server Actions.
3. Define Zod schemas for form validation.

### Phase 2: UI Components
1. Create `JobPostCard` component.
2. Create `JobPostForm` component (reusable for Add/Edit).
3. Create `AddJobPostDialog` to wrap the form.

### Phase 3: Dashboard Integration
1. Update `Dashboard` page to fetch and display job posts.
2. Add "Delete" confirmation dialog.
3. Implement loading states and optimistic updates where applicable.

## 5. Schema Considerations
- `profileId` must be retrieved from the session.
- `companyId`, `sourceId`, and `statusId` are foreign keys. We should provide a way to select existing ones or potentially add new ones (especially for companies).

## 6. Verification
- Verify that a user can only see/edit/delete their own job posts.
- Ensure form validation works correctly.
- Check responsive design on mobile.
