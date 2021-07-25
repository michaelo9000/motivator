import React from "react";
import { createUser, signInUser } from 'firebase-files/firebase';
import { useDispatch } from 'react-redux';
import { signIn, error, clearError } from 'redux/slices/userSlice';
import { signIn as tasksSignIn } from 'redux/slices/taskSlice';
import { signIn as prizesSignIn } from 'redux/slices/prizeSlice';
import { clearForm } from 'redux/slices/inputsSlice';
import { GetReducer } from 'redux/interface';
import Input from 'components/Input';

const groupName = "signIn";

export default function SignInForm(props) {
    const dispatch = useDispatch();
    let inputs = GetReducer('inputs')[groupName];

    const submit = async function (e) {
        e.preventDefault();
        dispatch(clearError());

        let userFunction = props.isSignIn ? handleSignInUser : handleCreateUser;
        let result = await userFunction();

        if (result.isSuccess) {
            dispatch(signIn(result));
            dispatch(clearForm(groupName));
            dispatch(tasksSignIn(result.data.tasks));
            dispatch(prizesSignIn(result.data.prizes));
        }
        else {
            dispatch(error(result.error.message));
        }
    }

    const handleCreateUser = async function () {
        let details = { ...inputs, goalMinutesWeekly: inputs["goalMinutesDaily"] * inputs["goalDays"] };
        return await createUser(details, props.userDataCallback);
    }

    const handleSignInUser = async function () {
        return await signInUser(inputs, props.userDataCallback);
    }

    return (
        <form onSubmit={submit}>
            <h1>{props.isSignIn ? 'Log in' : 'Create account'}</h1>
            <Input name="email" humanName="Email" group={groupName} />
            <Input name="password" humanName="Password" group={groupName} />
            {!props.isSignIn &&
                <Input name="budget" type="number" decimalPlaces={2} humanName="Weekly budget" group={groupName} />
            }
            {!props.isSignIn &&
                <Input name="goalMinutesDaily" type="number" decimalPlaces={0} humanName="Goal minutes per day" group={groupName} />
            }
            {!props.isSignIn &&
                <Input name="goalDays" type="number" decimalPlaces={0} humanName="Goal days per week" group={groupName} />
            }
            <button>do</button>
        </form>
    );
}