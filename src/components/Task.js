import React from "react";
import { updateTask } from '../firebase/firebase';
import { updateFromLocal } from '../redux/slices/taskSlice';
import { useDispatch } from "react-redux";

export default function Task(props) {
    let task = props.data;
    let dispatch = useDispatch();

    const completeTask = function () {
        let count = task.count || 0;
        task.count = count + 1;
        dispatch(updateFromLocal(task));
        updateTask(task);
    }

    return (
        <div onClick={completeTask} className="task">
            <div className="flex-row between">
                <div className="task-check">
                    <div className="task-check-value">{task.value || 0}</div>
                    <div className="task-check-checkmark">✓</div>
                </div>
                <div className="task-count">{task.count || 0}</div>
                <div className="task-icon"></div>
            </div>
            <div className="flex-row between">
                <div className="task-name">{task.name || "[name missing]"}</div>
                <div className="task-description">{task.description || "[description missing]"}</div>
            </div>
        </div>
    );
}