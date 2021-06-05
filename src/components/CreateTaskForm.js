import React from "react";
import { createTask } from '../firebase/firebase';
import { GetReducer } from '../redux/interface';
import Input from '../components/Input';

const groupName = "createTask";

export default function CreateTaskForm() {
    let inputs = GetReducer('inputs')[groupName];

    const submit = function (e) {
        e.preventDefault();
        let { name, ...details } = inputs;
        createTask(name, details);
    }

    return (
        <form onSubmit={submit}>
            <h1>Create a new task</h1>
            <Input name="name" humanName="Task name" group={groupName} />
            <Input name="description" humanName="A short description" group={groupName} />
            <Input name="size" humanName="# of 30 minute sessions to complete" group={groupName} />
            <button>creat</button>
        </form>
    );
}