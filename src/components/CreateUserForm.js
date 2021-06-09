import React from "react";
import { createUser } from '../firebase/firebase';
import { useDispatch } from 'react-redux';
import { logIn, error, clearError } from '../redux/slices/userSlice';
import { GetReducer } from '../redux/interface';
import Input from './Input';

const groupName = "createUser";

export default function LoginForm() {
    const dispatch = useDispatch();
    let inputs = GetReducer('inputs')[groupName];

    const submit = async function (e) {
        e.preventDefault();

        dispatch(clearError());
        let result = await createUser(inputs.email, inputs.password);

        if (result.isSuccess)
            dispatch(logIn(result.email));
        else
            dispatch(error(result.error.message));
    }

    return (
        <form onSubmit={submit}>
            <h1>Create account</h1>
            <Input name="email" humanName="Email" group={groupName} />
            <Input name="password" humanName="Password" group={groupName} />
            <button>do</button>
        </form>
    );
}