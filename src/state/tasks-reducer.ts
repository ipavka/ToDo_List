import {TasksStateType} from '../App';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodosActionType} from './todolists-reducer';
import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppActionsType, AppRootStateType} from "./store";

const initialState: TasksStateType = {
    // [todoListId1]: [
    //     {
    //         id: v1(),
    //         title: "HTML&CSS",
    //         status: TaskStatuses.Completed,
    //         todoListId: todoListId1,
    //         description: '',
    //         startDate: '',
    //         deadline: '',
    //         addedDate: '',
    //         order: 0,
    //         priority: TaskPriorities.Low
    //     },
    //     {
    //         id: v1(),
    //         title: "JS",
    //         status: TaskStatuses.New,
    //         todoListId: todoListId1,
    //         description: '',
    //         startDate: '',
    //         deadline: '',
    //         addedDate: '',
    //         order: 0,
    //         priority: TaskPriorities.Low
    //     }
    // ],
    // [todoListId2]: [
    //     {
    //         id: v1(), title: "Milk", status: TaskStatuses.Completed,
    //         todoListId: todoListId2,
    //         description: '',
    //         startDate: '',
    //         deadline: '',
    //         addedDate: '',
    //         order: 0,
    //         priority: TaskPriorities.Low
    //     },
    //     {
    //         id: v1(), title: "React Book", status: TaskStatuses.New,
    //         todoListId: todoListId2,
    //         description: '',
    //         startDate: '',
    //         deadline: '',
    //         addedDate: '',
    //         order: 0,
    //         priority: TaskPriorities.Low
    //     }
    // ]
};

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
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].filter(el => el.id !== action.taskID)
            }
        }
        case 'ADD-TASK': {
            return {
                ...state,
                [action.item.todoListId]: [action.item, ...state[action.item.todoListId]]
            }
            // const stateCopy = {...state}
            // const tasks = stateCopy[action.item.todoListId];
            // stateCopy[action.item.todoListId] = [action.item, ...tasks];
            // return stateCopy;
        }
        case '_CHANGE-TASK-STATUS': { // by me
            return {
                ...state,
                [action.todolistID]: state[action.todolistID]
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
            return {
                ...state,
                [action.item.id]: []
            }
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

export type TaskActionsType = RemoveTaskACType | AddTaskActionType
    | _ChangeTaskStatusActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodosActionType
    | FetchTasksACType

type RemoveTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (taskID: string, todoListID: string) => {
    return {type: 'REMOVE-TASK', taskID, todoListID,} as const;
}
type AddTaskActionType = ReturnType<typeof addTaskAC>
export const addTaskAC = (item: TaskType) => {
    return {type: 'ADD-TASK', item} as const;
}
type _ChangeTaskStatusActionType = ReturnType<typeof _changeTaskStatusAC> // by me
export const _changeTaskStatusAC = (todolistID: string, taskID: string, status: TaskStatuses, title: string) => {
    return {type: '_CHANGE-TASK-STATUS', taskID, status, todolistID, title} as const;
}
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (todolistID: string, taskID: string, status: TaskStatuses) => {
    return {type: 'CHANGE-TASK-STATUS', taskID, status, todolistID} as const;
}
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistID, taskID,} as const;
}
export type FetchTasksACType = ReturnType<typeof fetchTasksAC>
export const fetchTasksAC = (todoID: string, tasks: TaskType[]) => {
    return {type: 'FETCH_TASKS', todoID, tasks} as const
}

// Thunk
export const fetchTasksTC = (todoID: string) => {
    return (dispatch: Dispatch<AppActionsType>) => {
        taskAPI.getTasks(todoID)
            .then(res => {
                dispatch(fetchTasksAC(todoID, res.items))
            })
    }
}
export const addTaskTC = (todoID: string, title: string) => {
    return (dispatch: Dispatch<AppActionsType>) => {
        taskAPI.createTask(todoID, title)
            .then(res => {
                dispatch(addTaskAC(res.data.item))
            })
    }
}
export const removeTaskTC = (taskID: string, todoID: string) => {
    return (dispatch: Dispatch<AppActionsType>) => {
        taskAPI.deleteTask(todoID, taskID)
            .then(res => {
                dispatch(removeTaskAC(taskID, todoID))
            })
    }
}
export const updateTaskTitleTC = (taskID: string, title: string, todoID: string) => {
    return (dispatch: Dispatch<AppActionsType>) => {
        taskAPI.updateTaskTitle(todoID, taskID, title)
            .then(res => {
                dispatch(changeTaskTitleAC(taskID, title, todoID))
            })
    }
}
export const changeTaskStatusTC = (todoID: string, taskID: string, status: TaskStatuses) => {
    return (dispatch: Dispatch<AppActionsType>, getState: () => AppRootStateType) => {
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
                })
        }
    }
}
// by me
export const _changeTaskStatusTC = (todoID: string, taskID: string, status: TaskStatuses, title: string) => {
    return (dispatch: Dispatch<AppActionsType>) => {
        taskAPI._updateTaskStatus(todoID, taskID, status, title)
            .then(res => {
                dispatch(_changeTaskStatusAC(todoID, taskID, status, title))
            })
    }
}