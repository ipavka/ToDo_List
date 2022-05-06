import {v1} from 'uuid';
import {todoListAPI, TodoListType} from "../api/todolists-api";
import {Dispatch} from "redux";

export const todoListId1 = v1();
export const todoListId2 = v1();

const initialState: TodoListDomainType[] = [
    // {
    //     id: todoListId1, title: "What to learn", filter: "all", addedDate: '',
    //     order: 0,
    // },
    // {
    //     id: todoListId2, title: "What to buy", filter: "all", addedDate: '',
    //     order: 0,
    // }
]

export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}

export const todoListsReducer = (state: TodoListDomainType[] = initialState, action: ActionsType): TodoListDomainType[] => {
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

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodosActionType

export type RemoveTodolistActionType = ReturnType<typeof removeTodoListAC>
export const removeTodoListAC = (todolistID: string) => {
    return {type: 'REMOVE-TODOLIST', todolistID,} as const;
}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export const addTodolistAC = (item: TodoListType) => {
    return {type: 'ADD-TODOLIST', item} as const;
}
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodoListTitleAC>
export const changeTodoListTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title,} as const;
}
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter,} as const;
}
export type SetTodosActionType = ReturnType<typeof setTodosAC>
export const setTodosAC = (todos: TodoListType[]) => {
    return {type: 'SET-TODOS', todos} as const
}


// Thunk
export const fetchTodosTC = () => (dispatch: Dispatch) => {
    todoListAPI.getTodoLists()
        .then(res => {
            dispatch(setTodosAC(res))
        })
}
export const addTodoListTC = (title: string) => (dispatch: Dispatch) => {
    todoListAPI.createTodoList(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.item))
        })
}
export const removeTodoListTC = (todoListID: string) => {
    return (dispatch: Dispatch) => {
        todoListAPI.deleteTodoList(todoListID)
            .then(res => {
                dispatch(removeTodoListAC(todoListID))
            })
    }
}
export const updateTodoListTitleTC = (todoListID: string, title: string) => {
    return (dispatch: Dispatch) => {
        todoListAPI.updateTodoListTitle(todoListID, title)
            .then(res => {
                dispatch(changeTodoListTitleAC(todoListID, title))
            })
    }
}