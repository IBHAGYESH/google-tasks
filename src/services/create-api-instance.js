// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed

const BASE_URL = "https://tasks.googleapis.com";
// const BASE_URL = "http://localhost:8000";
// const BASE_URL =
//   "https://95a6-2405-201-2009-d891-443b-7b33-95e7-69d8.ngrok-free.app";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // const token = getState().auth.token;
    const token = localStorage.getItem("x-app-token"); // token in localstorage will already have Bearer prefix

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    if (BASE_URL.includes("free.app")) {
      headers.set("ngrok-skip-browser-warning", "69420");
    }

    return headers;
  },
});
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // const invalid = [400, 401];
  if (result.error && result.error.status === 400) {
    // localStorage.removeItem("x-app-token");
    // window.location.reload();
    // // try to get a new token
    // const refreshResult = await baseQuery('/refreshToken', api, extraOptions)
    // if (refreshResult.data) {
    //   // store the new token
    //   api.dispatch(tokenReceived(refreshResult.data))
    //   // retry the initial query
    //   result = await baseQuery(args, api, extraOptions)
    // } else {
    //   api.dispatch(loggedOut())
    // }
  }
  if (result.error && result.error.status === 401) {
    localStorage.removeItem("x-app-token");
    window.location.reload();
    // // try to get a new token
    // const refreshResult = await baseQuery('/refreshToken', api, extraOptions)
    // if (refreshResult.data) {
    //   // store the new token
    //   api.dispatch(tokenReceived(refreshResult.data))
    //   // retry the initial query
    //   result = await baseQuery(args, api, extraOptions)
    // } else {
    //   api.dispatch(loggedOut())
    // }
  }
  return result;
};
const createApiInstance = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Task", "Tasks", "Tasklist", "Tasklists"],
  endpoints: () => ({}),
});

export default createApiInstance;
