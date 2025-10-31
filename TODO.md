# TODO: Implement Role-Based Access

## 1. Update Types

- [x] Add `role: 'admin' | 'candidate'` to User interface in types/index.d.ts
- [x] Add `assignedTo?: string` to Interview interface in types/index.d.ts

## 2. Update Authentication Actions

- [x] Modify signUp function in lib/actions/auth.action.ts to accept and store role
- [x] Update getCurrentUser function to include role in returned User object

## 3. Update Auth Form

- [x] Add role selection (radio buttons) to sign-up form in components/AuthForm.tsx
- [x] Pass role to signUp action

## 4. Create Dashboard Routes

- [x] Create app/admin/dashboard/page.tsx for admin dashboard
- [x] Create app/candidate/dashboard/page.tsx for candidate dashboard

## 5. Update Home Page Redirection

- [x] Modify app/(root)/page.tsx to redirect based on user role

## 6. Update General Actions for Role-Based Logic

- [x] Update getInterviewsByUserId in lib/actions/general.action.ts to filter by assignedTo for candidates
- [x] Update getFeedbackByInterviewId to allow admins view all, restrict candidates to own
- [x] Add admin functions: getAllInterviews, getAllFeedback

## 7. Testing

- [x] Start the development server successfully with `npx next dev --turbopack`
- [ ] Test sign-up as admin and candidate
- [ ] Verify redirections and access controls
- [ ] Test interview assignments and feedback visibility
