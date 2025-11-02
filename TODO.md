# TODO: Enforce Authentication and Role-Based Redirects

## Tasks

- [x] Modify `app/(root)/page.tsx` to always redirect to "/sign-in"
- [x] Update `app/(auth)/layout.tsx` to redirect authenticated users to "/"
- [x] Update middleware.ts to protect routes and handle role-based access
- [x] Ensure AuthForm.tsx correctly fetches user role after sign-in and redirects accordingly
- [ ] Test the flow: visiting "/" goes to sign-in, after sign-in redirects to correct dashboard, direct access to dashboards is blocked without authentication

## Notes

- Root page ("/") must always redirect to "/sign-in", clearing any persistent sessions
- Authenticated users visiting sign-in pages should be redirected to their dashboard
- Middleware should protect "/admin/_" and "/candidate/_" routes
- Sign-in should fetch role from Firestore and redirect based on role
