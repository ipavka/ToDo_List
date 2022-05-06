import React, {ChangeEvent, useCallback, useState} from 'react';
import {EditableSpan} from "./EditableSpan";
import {SuperButton} from "./common/SuperButton/SuperButton";
import SuperCheckbox from "./common/SuperCheckbox/SuperCheckbox";
import {TaskStatuses, TaskType} from "../api/todolists-api";

export type TaskPropsType = {
    task: TaskType
    removeTask: (taskID: string) => void
    changeTaskStatus: (taskID: string, status: TaskStatuses, title: string) => void
    changeTaskTitle: (taskID: string, newValue: string) => void
}

export const Task: React.FC<TaskPropsType> = React.memo((
    {
        task,
        removeTask,
        changeTaskStatus,
        changeTaskTitle,
    }
) => {
    // console.log('Task')

    const [hidden, setHidden] = useState(true);

// ToDo: настроить стили при изменении названия таски,
//  если можно убрать чек-бокс когда ввожу новое значение,
//  всплывающие подсказки на кнопке удаления и названии таски и туду листа.

    const onClickHandler = useCallback(() => removeTask(task.id), [removeTask, task.id])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked;
        changeTaskStatus(task.id, status ? TaskStatuses.Completed : TaskStatuses.New, task.title);
    }, [changeTaskStatus, task.id])
    const onTitleChangeHandler = useCallback((newValue: string) => {
        changeTaskTitle(task.id, newValue);
    }, [changeTaskTitle, task.id])

    return (
        <div key={task.id} className={"taskItem"}>
            <div className={task.status === 2 ? "checkBoxItem is-done" : "checkBoxItem"}>
                {hidden && <SuperCheckbox onChange={onChangeHandler} checked={task.status === 2}/>}
                <EditableSpan value={task.title}
                              onChange={onTitleChangeHandler}
                              hidden={setHidden}
                />
            </div>
            {hidden && <SuperButton onClick={onClickHandler} red>del</SuperButton>}
        </div>
    );
});

