import { createSlice } from '@reduxjs/toolkit'

const initialState = {};

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        signIn: (state, action) => action.payload,
        error: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        logOut: () => initialState,
    },
})

// Action creators are generated for each case reducer function but you still have to fuckin list them all
export const { signIn, logOut, error, clearError } = userSlice.actions

export default userSlice.reducer