import React from "react";
import { updateTask } from '../firebase/firebase';
import { updateFromLocal } from '../redux/slices/taskSlice';
import { useDispatch } from "react-redux";
import { minutesPerToken } from "../helpers/consts";

export default function Task(props) {
    let task = props.data;
    let dispatch = useDispatch();
    let reward = Math.round(task.time / minutesPerToken) || 0;

    const completeTask = function () {
        props.confirm(null);

        props.tokenAnimation(reward);

        setTimeout(() => {
            let count = task.count || 0;
            task.count = count + 1;
            dispatch(updateFromLocal(task));
            updateTask(task);
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

    return (
        <div className="task">
            <div className="flex between align-start">
                <div className="card-text mb-20">
                    <div className="card-name">{task.name || "[name missing]"}</div>
                    <div className="card-description">{task.description || "[description missing]"}</div>
                </div>
                <div className="circle-button">
                    <div onClick={confirm} className="circle-button-surface">✓</div>
                    <div className="circle-button-depth" />
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
                <div className="card-icon"></div>
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