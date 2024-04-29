import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import createApiInstance from "../services/create-api-instance";

const store = configureStore({
  reducer: combineReducers({
    [createApiInstance.reducerPath]: createApiInstance.reducer,
  }),
  //   devTools: process.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      createApiInstance.middleware,
    ]),
});

export default store;
