import React from "react";
import { createUser, signInUser } from '../firebase/firebase';
import { useDispatch } from 'react-redux';
import { signIn, error, clearError } from '../redux/slices/userSlice';
import { signIn as tasksSignIn } from '../redux/slices/taskSlice';
import { GetReducer } from '../redux/interface';
import Input from './Input';

const groupName = "signIn";

export default function SignInForm(props) {
    const dispatch = useDispatch();
    let inputs = GetReducer('inputs')[groupName];

    const submit = async function (e) {
        e.preventDefault();
        dispatch(clearError());

        let userFunction = props.isSignIn ? signInUser : createUser;
        let result = await userFunction(inputs, props.userDataCallback);

        if (result.isSuccess) {
            dispatch(signIn(result));
            dispatch(tasksSignIn(result.data.tasks));
        }
        else {
            dispatch(error(result.error.message));
        }
    }

    return (
        <form onSubmit={submit}>
            <h1>{props.isSignIn ? 'Log in' : 'Create account'}</h1>
            <Input name="email" humanName="Email" group={groupName} />
            <Input name="password" humanName="Password" group={groupName} />
            {!props.isSignIn &&
                <Input name="budget" humanName="Weekly budget" group={groupName} />
            }
            <button>do</button>
        </form>
    );
}