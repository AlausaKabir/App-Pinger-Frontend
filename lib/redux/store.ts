import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers";
import persistStore from "redux-persist/es/persistStore";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // Performance optimizations
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Optimize serialization checks
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["items.dates"],
      },
      // Enable immutability checks in development only
      immutableCheck: {
        warnAfter: 128, // Warn only after 128ms
      },
    }),
  // Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
