import { ApiRoutes } from "./apiRoutes";
import createApiInstance from "./create-api-instance";

export const extendedApi = createApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: ({ tasklist_id, params }) => {
        return {
          url: ApiRoutes.tasks.getTasks.url.replace(":tasklist", tasklist_id),
          method: ApiRoutes.tasks.getTasks.method,
          params,
        };
      },
      providesTags: ["Tasks"],
      transformResponse: (response) => response,
    }),
    addTask: builder.mutation({
      query({ body, params, tasklist_id }) {
        return {
          url: ApiRoutes.tasks.addTask.url.replace(":tasklist", tasklist_id),
          method: ApiRoutes.tasks.addTask.method,
          body,
          params,
        };
      },
      invalidatesTags: ["Tasks"],
      transformResponse: (response) => response,
    }),
    moveTask: builder.mutation({
      query({ task_id, tasklist_id, body }) {
        return {
          url: ApiRoutes.tasks.moveTask.url
            .replace(":tasklist", tasklist_id)
            .replace(":task", task_id),
          method: ApiRoutes.tasks.moveTask.method,
          body: body,
        };
      },
      invalidatesTags: ["Tasks"],
      transformResponse: (response) => response,
    }),
    editTask: builder.mutation({
      query({ task_id, tasklist_id, body }) {
        return {
          url: ApiRoutes.tasks.editTask.url
            .replace(":tasklist", tasklist_id)
            .replace(":task", task_id),
          method: ApiRoutes.tasks.editTask.method,
          body: body,
        };
      },
      invalidatesTags: ["Tasks"],
      transformResponse: (response) => response,
    }),
    removeTask: builder.mutation({
      query({ task_id, tasklist_id }) {
        return {
          url: ApiRoutes.tasks.removeTask.url
            .replace(":tasklist", tasklist_id)
            .replace(":task", task_id),
          method: ApiRoutes.tasks.removeTask.method,
        };
      },
      invalidatesTags: ["Tasks"],
      transformResponse: (response) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useLazyGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useMoveTaskMutation,
  useRemoveTaskMutation,
} = extendedApi;
