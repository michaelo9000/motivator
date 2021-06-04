import React from "react";
import Input from '../components/Input';
const groupName = "createTask";

export default class CreateTaskForm extends React.Component {
    render() {
        return (
            <form>
                <h1>Create a new task</h1>
                <Input name="name" humanName="Task name" group={groupName} />
                <Input name="description" humanName="A short description" group={groupName} />
                <Input name="size" humanName="How many 30 minute blocks will it take to complete?" group={groupName} />
                <button>create</button>
            </form>
        );
    }
}