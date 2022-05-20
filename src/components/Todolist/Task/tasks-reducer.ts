import {Dispatch} from "redux";
import {TasksStateType} from "../../../app/App";
import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../../../api/todolists-api";
import {RootActionsType, AppRootStateType, AppThunk} from "../../../app/store";
import {
    AddTodolistActionType,
    changeTodolistEntityStatusAC,
    RemoveTodolistActionType, ResultCodeStatuses,
    SetTodosActionType
} from "../todolists-reducer";
import {setAppStatusAC} from "../../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case "FETCH_TASKS": {
            return {...state, [action.todoID]: action.tasks}
        }
        case "SET-TODOS": {
            const stateCopy = {...state}
            action.todos.forEach((el) => {
                stateCopy[el.id] = []
            })
            return stateCopy
        }
        case 'REMOVE-TASK': {
            return {...state, [action.todoListID]: state[action.todoListID].filter(el => el.id !== action.taskID)}
        }
        case 'ADD-TASK': {
            return {...state, [action.item.todoListId]: [action.item, ...state[action.item.todoListId]]}
        }
        case '_CHANGE-TASK-STATUS': { // by me
            return {
                ...state, [action.todolistID]: state[action.todolistID]
                    .map(el => el.id === action.taskID ? {...el, status: action.status, title: action.title} : el)
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID]
                    .map(el => el.id === action.taskID ? {...el, status: action.status} : el)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID]
                    .map(el => el.id === action.taskID ? {...el, title: action.title} : el)
            }
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.item.id]: []}
        }
        case 'REMOVE-TODOLIST': {
            // const {[action.id]:[], ...newState} = {...state} // удаление с помощью Destructuring assignment
            const copyState = {...state};
            delete copyState[action.todolistID];
            return copyState;
        }
        default:
            return state;
    }
}

// actions
export const removeTaskAC = (taskID: string, todoListID: string) => {
    return {type: 'REMOVE-TASK', taskID, todoListID,} as const;
}
export const addTaskAC = (item: TaskType) => {
    return {type: 'ADD-TASK', item} as const;
}
export const _changeTaskStatusAC = (todolistID: string, taskID: string, status: TaskStatuses, title: string) => { // by me
    return {type: '_CHANGE-TASK-STATUS', taskID, status, todolistID, title} as const;
}
export const changeTaskStatusAC = (todolistID: string, taskID: string, status: TaskStatuses) => {
    return {type: 'CHANGE-TASK-STATUS', taskID, status, todolistID} as const;
}
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistID, taskID,} as const;
}
export const fetchTasksAC = (todoID: string, tasks: TaskType[]) => {
    return {type: 'FETCH_TASKS', todoID, tasks} as const
}

// Thunk
export const fetchTasksTC = (todoID: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'));
        taskAPI.getTasks(todoID)
            .then(res => {
                dispatch(fetchTasksAC(todoID, res.items))
                dispatch(setAppStatusAC('succeeded'));
            }).catch((rej: AxiosError) => {
            handleServerNetworkError(rej.message, dispatch);
        })
    }
}
export const addTaskTC = (todoID: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'));
        taskAPI.createTask(todoID, title)
            .then(res => {
                if(res.resultCode === ResultCodeStatuses.success) {
                    dispatch(addTaskAC(res.data.item))
                    dispatch(setAppStatusAC('succeeded'));
                } else {
                    handleServerAppError(res, dispatch);
                }
            }).catch((rej: AxiosError) => {
            handleServerNetworkError(rej.message, dispatch);
        })
    }
}
export const removeTaskTC = (taskID: string, todoID: string) => {
    return (dispatch: Dispatch<RootActionsType>) => {
        dispatch(changeTodolistEntityStatusAC('loading', todoID));
        dispatch(setAppStatusAC('loading'));
        taskAPI.deleteTask(todoID, taskID)
            .then(res => {
                dispatch(changeTodolistEntityStatusAC('idle', todoID));
                dispatch(removeTaskAC(taskID, todoID));
                dispatch(setAppStatusAC('succeeded'));
            }).catch((rej: AxiosError) => {
            handleServerNetworkError(rej.message, dispatch);
        })
    }
}
export const updateTaskTitleTC = (taskID: string, title: string, todoID: string) => {
    return (dispatch: Dispatch<RootActionsType>) => {
        dispatch(setAppStatusAC('loading'));
        taskAPI.updateTaskTitle(todoID, taskID, title)
            .then(res => {
                if(res.resultCode === ResultCodeStatuses.success) {
                    dispatch(changeTaskTitleAC(taskID, title, todoID))
                    dispatch(setAppStatusAC('succeeded'));
                } else {
                    handleServerAppError(res, dispatch);
                }
            }).catch((rej: AxiosError) => {
            handleServerNetworkError(rej.message, dispatch);
        })
    }
}
export const changeTaskStatusTC = (todoID: string, taskID: string, status: TaskStatuses) => {
    return (dispatch: Dispatch<RootActionsType>, getState: () => AppRootStateType) => {
        const state = getState();
        const allAppTask = state.tasks;
        const tasksForClickedTodo = allAppTask[todoID]
        const currentTask = tasksForClickedTodo.find(el => {
            return el.id === taskID
        })

        if (currentTask) {
            const model: UpdateTaskModelType = {
                title: currentTask.title,
                status,
                description: currentTask.description,
                priority: currentTask.priority,
                startDate: currentTask.startDate,
                deadline: currentTask.deadline,
            }
            taskAPI.updateTaskStatus(todoID, taskID, model)
                .then(res => {
                    dispatch(changeTaskStatusAC(todoID, taskID, status))
                }).catch((rej: AxiosError) => {
                handleServerNetworkError(rej.message, dispatch)
            })
        }
    }
}
// by me
export const _changeTaskStatusTC = (todoID: string, taskID: string, status: TaskStatuses, title: string) => {
    return (dispatch: Dispatch<RootActionsType>) => {
        taskAPI._updateTaskStatus(todoID, taskID, status, title)
            .then(res => {
                dispatch(_changeTaskStatusAC(todoID, taskID, status, title))
            })
    }
}

// types
export type TaskActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof _changeTaskStatusAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof fetchTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodosActionType
