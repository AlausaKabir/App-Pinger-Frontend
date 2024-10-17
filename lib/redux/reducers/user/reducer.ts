import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, PersistConfig } from "redux-persist";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Role {
  id: number;
  roleType: string;
}

interface UserState {
  loggedIn: boolean;
  emailOrPhone: string;
  role: Role;
}

const initialState: UserState = {
  loggedIn: false,
  emailOrPhone: "",
  role: {
    id: 0,
    roleType: "",
  },
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

    setUserRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
  },
});

export const { setLoggedIn, setUserEmailOrPhone, setUserRole } = userSlice.actions;

const reducer = userSlice.reducer;

const persistConfig: PersistConfig<UserState> = {
  key: "user",
  storage,
};

export const userReducer = persistReducer(persistConfig, reducer);
