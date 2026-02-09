module.exports = {
  ADMIN: [
    "USER_CREATE",
    "USER_UPDATE",
    "USER_DELETE",
    "PROJECT_CREATE",
    "PROJECT_VIEW_ALL"
  ],
  MANAGER: [
    "TASK_CREATE",
    "TASK_ASSIGN",
    "TASK_VIEW_ALL"
  ],
  DEVELOPER: [
    "TASK_VIEW_SELF",
    "TASK_UPDATE_STATUS"
  ]
}