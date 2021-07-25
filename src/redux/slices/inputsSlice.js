import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const inputsSlice = createSlice({
    name: 'inputs',
    initialState: {},
    reducers: {
        updateInput: (state, action) => {
            let pl = action.payload;
            if (!state[pl.group])
                state[pl.group] = {};
            state[pl.group][pl.name] = pl.value;
        },
        clearForm: (state, action) => {
            let group = action.payload;
            if (state[group])
                state[group] = {};
        },
        clearAll: () => initialState
    }
})

// Action creators are generated for each case reducer function but you still have to fuckin list them all
export const { updateInput, clearAll, clearForm } = inputsSlice.actions

export default inputsSlice.reducer