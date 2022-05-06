import {v1} from 'uuid';
import {TodoListType} from "../api/todolists-api";

export const todoListId1 = v1();
export const todoListId2 = v1();

const initialState: TodoListDomainType[] = [
    {
        id: todoListId1, title: "What to learn", filter: "all", addedDate: '',
        order: 0,
    },
    {
        id: todoListId2, title: "What to buy", filter: "all", addedDate: '',
        order: 0,
    }
]
// const initialState: Array<TodoListType> =  []

export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}

export const todoListsReducer = (state: TodoListDomainType[] = initialState, action: ActionsType): TodoListDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.todolistID)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistID,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0,
            }, ...state]
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

export type RemoveTodolistActionType = ReturnType<typeof removeTodoListAC>
export const removeTodoListAC = (todolistID: string) => {
    return {type: 'REMOVE-TODOLIST', todolistID,} as const;
}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title, todolistID: v1(),} as const;
}
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodoListTitleAC>
export const changeTodoListTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title,} as const;
}
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter,} as const;
}

