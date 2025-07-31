import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, PersistConfig } from "redux-persist";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  loggedIn: boolean;
  emailOrPhone: string;
  role: string;
  token: string | null;
  user: any | null;
}

const initialState: UserState = {
  loggedIn: false,
  emailOrPhone: "",
  role: "",
  token: null,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },

    setUserEmailOrPhone: (state, action: PayloadAction<string>) => {
      state.emailOrPhone = action.payload;
    },

    setUserRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },

    setToken: (state, action: PayloadAction<string | null | undefined>) => {
      state.token = action.payload || null;
      state.loggedIn = !!action.payload;
    },

    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      if (action.payload) {
        state.emailOrPhone = action.payload.email || "";
        state.role = action.payload.role || "";
        state.loggedIn = true;
      }
    },

    logout: (state) => {
      state.loggedIn = false;
      state.emailOrPhone = "";
      state.role = "";
      state.token = null;
      state.user = null;
    },
  },
});

export const { setLoggedIn, setUserEmailOrPhone, setUserRole, setToken, setUser, logout } =
  userSlice.actions;

const reducer = userSlice.reducer;

const persistConfig: PersistConfig<UserState> = {
  key: "user",
  storage,
};

export const userReducer = persistReducer(persistConfig, reducer);
