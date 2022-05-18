import {v1} from 'uuid';
import {todoListAPI, TodoListType} from "../../api/todolists-api";
import {AppThunk} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export const todoListId1 = v1();
export const todoListId2 = v1();
export enum ResultCodeStatuses {
    success = 0,
    error = 1,
    captcha = 10,
}
const initialState: TodoListDomainType[] = []

export const todoListsReducer = (
    state: TodoListDomainType[] = initialState, action: TodoListActionsType): TodoListDomainType[] => {
    switch (action.type) {
        case "SET-TODOS": {
            return action.todos.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.todolistID)
        }
        case 'ADD-TODOLIST': {
            return [{...action.item, filter: "all", entityStatus: 'idle'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        }
        case "CHANGE-TODOLIST-ENTITY-STATUS": {
            // return [...state, {...action.status}]
            return state.map(el => el.id === action.todoListID ? {...el, entityStatus: action.status} : el)
        }
        default:
            return state;
    }
}

// actions
export const removeTodoListAC = (todolistID: string) => {
    return {type: 'REMOVE-TODOLIST', todolistID,} as const;
}
export const addTodolistAC = (item: TodoListType) => {
    return {type: 'ADD-TODOLIST', item} as const;
}
export const changeTodoListTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title,} as const;
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter,} as const;
}
export const setTodosAC = (todos: TodoListType[]) => {
    return {type: 'SET-TODOS', todos} as const
}
export const changeTodolistEntityStatusAC = (status: RequestStatusType, todoListID: string) => {
    return {type: 'CHANGE-TODOLIST-ENTITY-STATUS', status, todoListID} as const
}

// Thunk
export const fetchTodosTC = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatusAC('loading'));
        const response = await todoListAPI.getTodoLists();
        dispatch(setTodosAC(response));
        dispatch(setAppStatusAC('idle'));
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
}
// export const fetchTodosTC = () => (dispatch: Dispatch<RootActionsType>) => {
//     dispatch(setAppStatusAC('loading'));
//     todoListAPI.getTodoLists()
//         .then(res => {
//             dispatch(setAppStatusAC('idle'));
//             dispatch(setTodosAC(res))
//         })
// }
export const addTodoListTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    todoListAPI.createTodoList(title)
        .then(res => {
            if (res.resultCode === ResultCodeStatuses.success) {
                dispatch(addTodolistAC(res.data.item));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res, dispatch);
            }
        }).catch((rej: AxiosError) => {
        handleServerNetworkError(rej.message, dispatch);
    })
}
export const removeTodoListTC = (todoListID: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'));
        dispatch(changeTodolistEntityStatusAC('loading', todoListID));
        todoListAPI.deleteTodoList(todoListID)
            .then(res => {
                dispatch(setAppStatusAC('succeeded'));
                dispatch(removeTodoListAC(todoListID));
            }).catch((rej: AxiosError) => {
            handleServerNetworkError(rej.message, dispatch);
        })
    }
}
export const updateTodoListTitleTC = (todoListID: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'));
        todoListAPI.updateTodoListTitle(todoListID, title)
            .then(res => {
                if (res.resultCode === ResultCodeStatuses.success) {
                    dispatch(changeTodoListTitleAC(todoListID, title));
                    dispatch(setAppStatusAC('succeeded'));
                } else {
                    handleServerAppError(res, dispatch);
                }
            }).catch((rej: AxiosError) => {
            handleServerNetworkError(rej.message, dispatch);
        })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodoListAC>
export type SetTodosActionType = ReturnType<typeof setTodosAC>
export type ChangeTodolistEntityType = ReturnType<typeof changeTodolistEntityStatusAC>
export type TodoListActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodosActionType
    | ChangeTodolistEntityType
export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
