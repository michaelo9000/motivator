import { createSlice } from '@reduxjs/toolkit'

const initialState = {};

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        logIn: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            state.email = action.payload;
        },
        error: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        logOut: (state) => {
            state = initialState;
        },
    },
})

// Action creators are generated for each case reducer function but you still have to fuckin list them all
export const { logIn, logOut, error, clearError } = userSlice.actions

export default userSlice.reducer