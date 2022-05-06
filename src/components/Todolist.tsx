import React, {useCallback} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../state/tasks-reducer";
import {
    changeTodolistFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    TodoListDomainType
} from "../state/todolists-reducer";
import {Task} from "./Task";
import {SuperButton} from "./common/SuperButton/SuperButton";
import {TaskStatuses, TaskType} from "../api/todolists-api";


type PropsType = {
    todoList: TodoListDomainType
}

export const Todolist: React.FC<PropsType> = React.memo(({todoList}) => {

    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[todoList.id])
    const dispatch = useDispatch();

    const removeTodolist = useCallback(() => {
        dispatch(removeTodoListAC(todoList.id));
    }, [dispatch])
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodoListTitleAC(todoList.id, title));
    }, [dispatch])

    const onAllClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todoList.id, "all")), [dispatch, todoList.id]);
    const onActiveClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todoList.id, "active")), [dispatch, todoList.id]);
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(todoList.id, "completed")), [dispatch, todoList.id]);

    let tasksForTodoList = tasks;
    if (todoList.filter === "active") {
        tasksForTodoList = tasksForTodoList.filter(el => el.status === TaskStatuses.New);
    }
    if (todoList.filter === "completed") {
        tasksForTodoList = tasksForTodoList.filter(el => el.status === TaskStatuses.Completed);
    }

    const removeTaskHandler = useCallback((taskID: string) => {
        dispatch(removeTaskAC(taskID, todoList.id))
    }, [dispatch])
    const changeTaskStatusHandler = useCallback((taskID: string, newIsDoneValue: TaskStatuses) => {
        dispatch(changeTaskStatusAC(taskID, newIsDoneValue, todoList.id));
    }, [dispatch])
    const changeTaskTitleHandler = useCallback((taskID: string, newValue: string) => {
        dispatch(changeTaskTitleAC(taskID, newValue, todoList.id));
    }, [dispatch])
    const addTaskHandler = useCallback((title: string) => {
        dispatch(addTaskAC(title, todoList.id))
    }, [dispatch])

    return <div className={"toDoListMainBlock"}>
        <div className={"addItemFormToDoList"}>
            <EditableSpan value={todoList.title} onChange={changeTodolistTitle}/>
            <SuperButton onClick={removeTodolist} red>x</SuperButton>
        </div>
        <AddItemForm addItem={addTaskHandler}/>
        <div className={'taskBlock'}>
            {
                tasksForTodoList.map(el => {
                    return <Task
                        key={el.id}
                        task={el}
                        removeTask={removeTaskHandler}
                        changeTaskStatus={changeTaskStatusHandler}
                        changeTaskTitle={changeTaskTitleHandler}/>
                })
            }
        </div>
        <div>
            <SuperButton selected={todoList.filter === 'all'}
                         onClick={onAllClickHandler}>All
            </SuperButton>
            <SuperButton selected={todoList.filter === 'active'}
                         onClick={onActiveClickHandler}>Active
            </SuperButton>
            <SuperButton selected={todoList.filter === 'completed'}
                         onClick={onCompletedClickHandler}>Completed
            </SuperButton>
        </div>
    </div>
})


