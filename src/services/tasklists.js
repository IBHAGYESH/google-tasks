import { ApiRoutes } from "./apiRoutes";
import createApiInstance from "./create-api-instance";

export const extendedApi = createApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getTasklists: builder.query({
      query: () => {
        return {
          url: ApiRoutes.tasklists.getTasklists.url,
          method: ApiRoutes.tasklists.getTasklists.method,
        };
      },
      providesTags: ["Tasklists"],
      transformResponse: (response) => response,
    }),
    addTasklist: builder.mutation({
      query(body) {
        return {
          url: ApiRoutes.tasklists.addTasklist.url,
          method: ApiRoutes.tasklists.addTasklist.method,
          body,
        };
      },
      invalidatesTags: ["Tasklists"],
      transformResponse: (response) => response,
    }),
    editTasklist: builder.mutation({
      query({ tasklist_id, body }) {
        return {
          url: ApiRoutes.tasklists.editTasklist.url.replace(
            ":tasklist",
            tasklist_id
          ),
          method: ApiRoutes.tasklists.editTasklist.method,
          body,
        };
      },
      invalidatesTags: ["Tasklists"],
      transformResponse: (response) => response,
    }),
    removeTasklist: builder.mutation({
      query(tasklist_id) {
        return {
          url: ApiRoutes.tasklists.removeTasklist.url.replace(
            ":tasklist",
            tasklist_id
          ),
          method: ApiRoutes.tasklists.removeTasklist.method,
        };
      },
      invalidatesTags: ["Tasklists"],
      transformResponse: (response) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTasklistsQuery,
  useLazyGetTasklistsQuery,
  useAddTasklistMutation,
  useEditTasklistMutation,
  useRemoveTasklistMutation,
} = extendedApi;
