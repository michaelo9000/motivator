import React, { useState } from "react";
import { updateObject } from 'firebase-files/firebase';
import { updateFromLocal } from 'redux/slices/taskSlice';
import { useDispatch } from "react-redux";
import { GetReducer } from 'redux/interface';
import { clearForm } from "redux/slices/inputsSlice";
import { minutesPerToken } from "helpers/consts";
import Input from 'components/Input';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Task(props) {
    let task = props.data;
    const groupName = `editTask-${task.id}`;
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

            let completions = task.completions ? Object.assign([], task.completions) : [];
            let date = new Date();
            completions.push(date.toLocaleDateString('en-NZ'));
            task.completions = completions;

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

    const showCalendar = function () {
        props.confirm({
            title: `Progress for ${task.name}`,
            body: <EventCalendar eventDates={task.completions} />
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
            <div className="calendar" onClick={showCalendar}>
                <div className="calendar-icon">
                    <div className="calendar-icon-hook left" />
                    <div className="calendar-icon-hook right" />
                    <div className="calendar-icon-inner"></div>
                </div>
            </div>
            <div className="flex between align-start">
                <div className="card-text mb-20">
                    <div className="flex between align-start mb-20">
                        <Input name="name" humanName="Task name" group={groupName}
                            value={task.name} editing={editing} disabled={!editing}
                            attributes={{ maxLength: "18" }} className="blend-in bold" />
                        -
                        <Input name="time" group={groupName}
                            value={task.time} editing={editing} disabled={!editing}
                            decimalPlaces={0} type="text" className="blend-in" />
                    </div>
                    <Input name="description" humanName="A short description" group={groupName}
                        value={task.description} editing={editing} disabled={!editing}
                        attributes={{ maxLength: "72" }} className="blend-in" useTextarea />
                </div>
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

function EventCalendar(props) {
    const [selectedDate, selectDate] = useState();
    // let eventDates = props.events.map(event => event.dates)

    const tileClassName = function ({ date, view }) {
        if (view === 'month' && props.eventDates) {
            if (props.eventDates.find(dDate => dDate === date.toLocaleDateString('en-NZ'))) {
                return 'has-event';
            }
        }
    }

    return <div>
        <Calendar
            onChange={selectDate}
            value={selectedDate}
            tileClassName={tileClassName}
        />
        {/* <h3>Tasks completed on {selectedDate}:</h3> */}
    </div>
}