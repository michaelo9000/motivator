import React from "react";
import { useDispatch } from 'react-redux';
import { createObject } from 'firebase-files/firebase';
import { create } from 'redux/slices/taskSlice';
import { clearForm } from 'redux/slices/inputsSlice';
import { GetReducer } from 'redux/interface';
import Input from 'components/Input';

const groupName = "createTask";

export default function CreateTaskForm() {
    const dispatch = useDispatch();
    const user = GetReducer('user');
    const inputs = GetReducer('inputs')[groupName];

    const submit = function (e) {
        e.preventDefault();
        let taskDetails = { ...inputs, count: 0 };
        dispatch(clearForm(groupName));
        dispatch(create(taskDetails));
        createObject('tasks', taskDetails, user.id);
    }

    return (
        <form onSubmit={submit}>
            <h1>Create a new task</h1>
            <Input name="name" humanName="Task name" group={groupName} />
            <Input name="description" humanName="A short description" group={groupName} attributes={{ maxLength: "72" }} />
            <Input name="time" type="number" decimalPlaces={0} humanName="Minutes to complete once" group={groupName} />
            <button>creat</button>
        </form>
    );
}