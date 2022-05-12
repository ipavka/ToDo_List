import {v1} from 'uuid';
import {todoListAPI, TodoListType} from "../api/todolists-api";
import {AppThunk} from "./store";

export const todoListId1 = v1();
export const todoListId2 = v1();

const initialState: TodoListDomainType[] = []

export const todoListsReducer = (
    state: TodoListDomainType[] = initialState, action: TodoListActionsType): TodoListDomainType[] => {
    switch (action.type) {
        case "SET-TODOS": {
            return action.todos.map(el => ({...el, filter: 'all'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.todolistID)
        }
        case 'ADD-TODOLIST': {
            return [{...action.item, filter: "all"}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
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

// Thunk
export const fetchTodosTC = (): AppThunk => async dispatch => {
    try {
        const response = await todoListAPI.getTodoLists()
        dispatch(setTodosAC(response))
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
}
// export const fetchTodosTC = () => (dispatch: Dispatch) => {
//     todoListAPI.getTodoLists()
//         .then(res => {
//             dispatch(setTodosAC(res))
//         })
// }
export const addTodoListTC = (title: string): AppThunk => (dispatch) => {
    todoListAPI.createTodoList(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.item))
        })
}
export const removeTodoListTC = (todoListID: string): AppThunk => {
    return (dispatch) => {
        todoListAPI.deleteTodoList(todoListID)
            .then(res => {
                dispatch(removeTodoListAC(todoListID))
            })
    }
}
export const updateTodoListTitleTC = (todoListID: string, title: string): AppThunk => {
    return (dispatch) => {
        todoListAPI.updateTodoListTitle(todoListID, title)
            .then(res => {
                dispatch(changeTodoListTitleAC(todoListID, title))
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodoListAC>
export type SetTodosActionType = ReturnType<typeof setTodosAC>
export type TodoListActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodosActionType
export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}