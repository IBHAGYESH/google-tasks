export const ApiRoutes = {
  tasklists: {
    getTasklists: {
      url: `/tasks/v1/users/@me/lists`,
      method: "GET",
    },
    addTasklist: {
      url: `/tasks/v1/users/@me/lists`,
      method: "POST",
    },
    editTasklist: {
      url: `/tasks/v1/users/@me/lists/:tasklist`,
      method: "PATCH",
    },
    removeTasklist: {
      url: `/tasks/v1/users/@me/lists/:tasklist`,
      method: "DELETE",
    },
  },
  tasks: {
    getTasks: {
      url: `/tasks/v1/lists/:tasklist/tasks`,
      method: "GET",
    },
    addTask: {
      url: `/tasks/v1/lists/:tasklist/tasks`,
      method: "POST",
    },
    moveTask: {
      url: `/tasks/v1/lists/:tasklist/tasks/:task/move`,
      method: "POST",
    },
    editTask: {
      url: `/tasks/v1/lists/:tasklist/tasks/:task`,
      method: "PATCH",
    },
    removeTask: {
      url: `/tasks/v1/lists/:tasklist/tasks/:task`,
      method: "DELETE",
    },
  },
};
