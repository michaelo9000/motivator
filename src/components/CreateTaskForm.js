import React from "react";
import { useDispatch } from 'react-redux';
import { createObject } from 'firebase-files/firebase';
import { create } from 'redux/slices/taskSlice';
import { clearForm } from 'redux/slices/inputsSlice';
import { error } from 'redux/slices/userSlice';
import { GetReducer } from 'redux/interface';
import Input from 'components/Input';

const groupName = "createTask";

export default function CreateTaskForm() {
    const dispatch = useDispatch();
    const user = GetReducer('user');
    const inputs = GetReducer('inputs')[groupName];

    const submit = function (e) {
        e.preventDefault();

        if (inputs.goalCompletions < 1) {
            dispatch(error("Aim to do the task at least once!"));
            return;
        }
        if (inputs.challenge < 1 || inputs.challenge > 10) {
            dispatch(error("Challenge rating must be a number from 1 to 10."));
            return;
        }

        let taskDetails = { ...inputs, count: 0 };
        dispatch(clearForm(groupName));
        dispatch(create(taskDetails));
        createObject('tasks', taskDetails, user.id);
    }

    return (
        <form onSubmit={submit}>
            <h1>Create a new task</h1>
            <Input name="name" humanName="Task name" group={groupName} attributes={{ maxLength: "18" }} />
            <Input name="description" humanName="A short description" group={groupName} attributes={{ maxLength: "72" }} />
            <p className="mb-20">How many minutes would you spend to complete this task once?</p>
            <Input name="time" type="number" decimalPlaces={0} humanName="Time spent" group={groupName} />
            <p className="mb-20">How many times per week do you aim to complete this task?</p>
            <Input name="goalCompletions" type="number" decimalPlaces={0} humanName="Goal completions per week" group={groupName} />
            <p className="mb-20">How challenging is this task for you, regardless of time spent?</p>
            <Input name="challenge" type="number" decimalPlaces={0} humanName="Challenge rating (out of 10)" group={groupName} />
            <button className="button">creat</button>
        </form>
    );
}