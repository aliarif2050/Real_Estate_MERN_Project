import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  loading: false,
  error: null,
};
const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        signInStart : (state) => {
            state.loading = true;
        },
        signInSuccess : (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
        },
        signInFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        update: (state, action) => {
            state.user = action.payload.user;
        },
    },
})

export const { signInStart, signInSuccess, signInFailure, update } = userSlice.actions;
export default userSlice.reducer;