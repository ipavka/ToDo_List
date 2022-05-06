import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, todoListId1, todoListId2} from './todolists-reducer';
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";


// const initialState: TasksStateType = {}
const initialState: TasksStateType = {
    [todoListId1]: [
        {
            id: v1(),
            title: "HTML&CSS",
            status: TaskStatuses.Completed,
            todoListId: todoListId1,
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low
        },
        {
            id: v1(),
            title: "JS",
            status: TaskStatuses.New,
            todoListId: todoListId1,
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low
        }
    ],
    [todoListId2]: [
        {
            id: v1(), title: "Milk", status: TaskStatuses.Completed,
            todoListId: todoListId2,
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low
        },
        {
            id: v1(), title: "React Book", status: TaskStatuses.New,
            todoListId: todoListId2,
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low
        }
    ]
};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].filter(el => el.id !== action.taskID)
            }
        }
        case 'ADD-TASK': {
            const newTask = {id: v1(), title: action.title, status: TaskStatuses.New,
                todoListId: todoListId2,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low}
            return {
                ...state,
                [action.todolistID]: [newTask, ...state[action.todolistID]]
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
                [action.todolistID]: []
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

type ActionsType = RemoveTaskACType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType

type RemoveTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (taskID: string, todoListID: string) => {
    return {type: 'REMOVE-TASK', taskID, todoListID,} as const;
}
type AddTaskActionType = ReturnType<typeof addTaskAC>
export const addTaskAC = (title: string, todolistID: string) => {
    return {type: 'ADD-TASK', title, todolistID,} as const;
}
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (taskID: string, status: TaskStatuses, todolistID: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskID, status, todolistID} as const;
}
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistID, taskID,} as const;
}

