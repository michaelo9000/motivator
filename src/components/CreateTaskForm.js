import React from "react";
import { useDispatch } from 'react-redux';
import { createTask } from '../firebase/firebase';
import { create } from '../redux/slices/taskSlice';
import { GetReducer } from '../redux/interface';
import Input from '../components/Input';

const groupName = "createTask";

export default function CreateTaskForm() {
    const dispatch = useDispatch();
    const user = GetReducer('user');
    const inputs = GetReducer('inputs')[groupName];

    const submit = function (e) {
        e.preventDefault();
        let taskDetails = { ...inputs, count: 0 };
        dispatch(create(taskDetails));
        createTask(taskDetails, user.id);
    }

    return (
        <form onSubmit={submit}>
            <h1>Create a new task</h1>
            <Input name="name" humanName="Task name" group={groupName} />
            <Input name="description" humanName="A short description" group={groupName} attributes={{ maxLength: "72" }} />
            <Input name="time" humanName="Minutes to complete once" group={groupName} />
            <button>creat</button>
        </form>
    );
}