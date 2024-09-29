import { configureStore } from "@reduxjs/toolkit";
import socketSlice from "./socketSlice";
import messageSlice from "./messageSlice.js";

export const store = configureStore({
  reducer: {
    websocket: socketSlice,
    message : messageSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['websocket/connect/fulfilled'],
        ignoredPaths: ['websocket.socket'],
      },
    }),
});
