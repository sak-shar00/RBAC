# TODO - Developer Dashboard Fix

## Backend Changes
- [x] 1. Update developerController.js - populate task fields and add stats endpoint
- [x] 2. Update developerRoutes.js - add stats route
- [x] 3. Add getAllProjects endpoint to adminController.js
- [x] 4. Add GET /projects route to adminRoutes.js
- [x] 5. Fix managerController.js - show all developers (remove isActive filter)

## Frontend Changes
- [x] 6. Update developer.ts API - add getDeveloperStats function
- [x] 7. Update tasksSlice.ts - add fetchDeveloperStats thunk
- [x] 8. Update DeveloperHome.tsx - fetch and display real stats
- [x] 9. Add logout button to all dashboards (Header component in Layout)
- [x] 10. Fix ManagerTasks.tsx - use fetchManagerTasks instead of fetchTasks
- [x] 11. Update ThemeContext - set green primary color (#22c55e)
- [x] 12. Update Header - replace toggle button with Moon/Sun icons

## Testing
- [ ] 13. Test all features work correctly

