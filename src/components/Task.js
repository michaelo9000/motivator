import React, { useState } from "react";
import { updateObject } from 'firebase-files/firebase';
import { updateFromLocal } from 'redux/slices/taskSlice';
import { useDispatch } from "react-redux";
import { GetReducer } from 'redux/interface';
import { clearForm } from "redux/slices/inputsSlice";
import { minutesPerToken } from "helpers/consts";
import Input from 'components/Input';

const groupName = 'editTask';

export default function Task(props) {
    let task = props.data;
    let dispatch = useDispatch();
    const inputs = GetReducer('inputs')[groupName];
    let reward = Math.round(task.time / minutesPerToken) || 0;
    const [editing, setEditing] = useState();

    const completeTask = function () {
        props.confirm(null);

        props.tokenAnimation(reward);

        setTimeout(() => {
            let count = task.count || 0;
            task.count = count + 1;
            dispatch(updateFromLocal(task));
            updateObject('tasks', task);
        }, 1000);
    }

    const confirm = function () {
        props.confirm({
            title: `Complete ${task.name}`,
            body: `${reward} tokens are coming your way!`,
            buttonText: 'i did it',
            callback: completeTask,
        });
    }

    const removeTask = function () {
        props.confirm(null);
        task.removed = true;
        dispatch(updateFromLocal(task));
        updateObject('tasks', task);
    }

    const confirmRemove = function () {
        props.confirm({
            title: `Remove ${task.name}?`,
            body: `Any unused tokens will remain, but you will no longer be able to complete this task. There is currently no undo for this action.`,
            buttonText: 'Remove',
            callback: removeTask,
        });
    }

    const confirmEdit = function () {
        // Combine the existing task with the values held in inputs. Input values will overwrite task values.
        let updatedTask = { ...task, ...inputs };

        dispatch(updateFromLocal(updatedTask));
        updateObject('tasks', updatedTask);

        dispatch(clearForm(groupName));
        setEditing();
    }

    return (
        <div className="card">
            <div className="close" onClick={confirmRemove}>x</div>
            <div className="edit" onClick={editing ? confirmEdit : setEditing}>
                {editing ?
                    '✓'
                    :
                    <div className="edit-icon">
                        <div className="edit-icon-component rubber-dome" />
                        <div className="edit-icon-component rubber" />
                        <div className="edit-icon-component dome-border" />
                        <div className="edit-icon-component dome" />
                        <div className="edit-icon-component shaft" />
                        <div className="edit-icon-component dome-border" />
                        <div className="edit-icon-component dome" />
                        <div className="edit-icon-component tip" />
                    </div>
                }
            </div>
            <div className="flex between align-start">
                <div className="card-text mb-20">
                    <div className="flex between align-start">
                        <Input name="name" humanName="Task name" value={task.name}
                            disabled={!editing} group={groupName} attributes={{ maxLength: "15" }}
                            className="blend-in bold" />
                        {/* <div className="card-name">{task.name || "[name missing]"}</div> */}
                        -
                        <div className="card-name-companion">{task.time} minutes</div>

                        {/* <Input name="description" humanName="A short description" group={groupName} attributes={{ maxLength: "72" }} />
            <Input name="time" type="number" decimalPlaces={0} humanName="Minutes to complete once" group={groupName} /> */}
                    </div>
                    <div className="card-description">{task.description || "[description missing]"}</div>
                </div>
                {/* <div className="card-icon"></div> */}
            </div>
            <div className="flex between">
                <div className="card-value-circle reward">
                    <div className="card-value">
                        Reward:
                        <span className="card-value-number">{reward}</span>
                        tokens
                    </div>
                </div>
                <div className="circle-button">
                    <div onClick={confirm} className="circle-button-surface">✓</div>
                    <div className="circle-button-depth" />
                </div>
                <div className="card-value-circle count">
                    <div className="card-value">
                        Completed
                        <span className="card-value-number">{task.count || 0}</span>
                        times
                    </div>
                </div>
            </div>
        </div>
    );
}