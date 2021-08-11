import { useSelector } from 'react-redux';

export function GetStore() {
    return useSelector(state => state);
}

export function GetReducer(reducerName) {
    const state = useSelector(state => state);
    return state[reducerName];
}

export function GetInput(group, name) {
    const state = useSelector(state => state);
    let groupInputs = state.inputs[group];
    return groupInputs ? groupInputs[name] : null;
}