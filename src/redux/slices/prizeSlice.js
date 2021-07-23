import { createSlice } from '@reduxjs/toolkit'

const initialState = {};

export const taskSlice = createSlice({
    name: 'prize',
    initialState: initialState,
    reducers: {
        signIn: (state, action) => action.payload || initialState,
        logOut: () => initialState,
        create: (state, action) => {
            state['pending'] = action.payload;
        },
        updateFromSnapshot: (state, action) => {
            state[action.payload.key] = action.payload.val;
            delete state.pending;
        },
        updateFromLocal: (state, action) => {
            let { id, ...details } = action.payload;
            state[id] = details;
        }
    },
})

// Action creators are generated for each case reducer function but you still have to fuckin list them all
export const { signIn, logOut, create, updateFromSnapshot, updateFromLocal } = taskSlice.actions

export default taskSlice.reducer