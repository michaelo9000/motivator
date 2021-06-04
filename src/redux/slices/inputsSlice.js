import { createSlice } from '@reduxjs/toolkit';
import actionNames from '../actionNames';

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
        }
    },
    extraReducers: {
        [actionNames.logOut]: (state) => {
            state = initialState;
        }
    }
})

// Action creators are generated for each case reducer function but you still have to fuckin list them all
export const { updateInput } = inputsSlice.actions

export default inputsSlice.reducer