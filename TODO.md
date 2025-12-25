# Authentication Flow and Profile Picture Fixes

## Completed Tasks
- [x] Implement authentication redirect logic
  - [x] Login page redirects to /profile after successful login
  - [x] Profile page redirects to /login if user is not authenticated
- [x] Fix profile picture loading issues
  - [x] Changed profile query from `select('*')` to specific fields to avoid 406 errors
  - [x] Verified AuthContext already uses specific select query

## Summary
- Authentication flow now properly redirects users based on login status
- Profile picture loading should work without 406 errors due to specific field selection
- All changes maintain existing functionality while fixing the identified issues
