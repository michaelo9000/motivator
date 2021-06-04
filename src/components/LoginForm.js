import React, { useState } from "react";
import { createUser, loginUser } from '../firebase/firebase';
import { useDispatch } from 'react-redux';
import { logIn, error, clearError } from '../redux/slices/userSlice';

export default function LoginForm() {
    const dispatch = useDispatch();
    const [inputs, setInputs] = useState();
    const [userFormIsLogin, setUserFormIsLogin] = useState();

    const handleCreateUser = async function () {
        let result = await createUser(inputs.email, inputs.password);
        handleUserResult(result);
    }

    const handleLoginUser = async function () {
        let result = await loginUser(inputs.email, inputs.password);
        handleUserResult(result);
    }

    const handleUserResult = function (result) {
        if (result.isSuccess)
            dispatch(logIn(result.email));
        else
            dispatch(error(result.error.message));
    }

    const submit = function (e) {
        e.preventDefault();
        dispatch(clearError());
        userFormIsLogin ? handleLoginUser() : handleCreateUser();
    }

    const updateInput = function (e) {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    return (
        <form onSubmit={submit}>
            <h1>Log in</h1>
            <input name="email" type="email" placeholder="email" onChange={updateInput} />
            <input name="password" type="password" placeholder="password" onChange={updateInput} />
            <div className={`switch-button ${userFormIsLogin ? 'right' : 'left'}`}
                onClick={() => setUserFormIsLogin(!userFormIsLogin)}>
                <div className={`switch-button-label left`}>creat</div>
                <div className="switch-button-handle" />
                <div className={`switch-button-label right`}>log in</div>
            </div>
            <button>do</button>
        </form>
    );
}