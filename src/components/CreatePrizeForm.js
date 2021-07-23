import React from "react";
import { useDispatch } from 'react-redux';
import { createPrize } from '../firebase/firebase';
import { create } from '../redux/slices/prizeSlice';
import { GetReducer } from '../redux/interface';
import Input from './Input';

const groupName = "createPrize";

export default function CreatePrizeForm() {
    const dispatch = useDispatch();
    const user = GetReducer('user');
    const inputs = GetReducer('inputs')[groupName];

    const submit = function (e) {
        e.preventDefault();
        let prizeDetails = { ...inputs, claimed: 0, redeemed: 0 };
        dispatch(create(prizeDetails));
        createPrize(prizeDetails, user.id);
    }

    return (
        <form onSubmit={submit}>
            <h1>Create a new prize</h1>
            <Input name="name" humanName="Prize name" group={groupName} />
            <Input name="description" humanName="A short description" group={groupName} attributes={{ maxLength: "72" }} />
            <Input name="costDollars" humanName="Cost ($)" group={groupName} />
            <button>creat</button>
        </form>
    );
}