import axios, {AxiosResponse} from "axios";
import {apiConfig} from "../configs/config";


const instance = axios.create({
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    headers: {
        'API-KEY': apiConfig.NETWORK_KEY as string
    },
})

const placeholderInst = axios.create({
    withCredentials: true,
    baseURL: "https://jsonplaceholder.typicode.com/",

})

type PlaceHolderType = {
    userId: number
    id: number
    title: string
    completed: boolean
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type TodoListType = {
    id: string
    addedDate: string
    order: number
    title: string
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors?: string[]
    data: D
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}


export const ToDoListAPI = {
    getTodos() {
        return instance.get<TodoListType[]>(`todo-lists`)
            .then(res => res.data)
    },
    setTodos(title: string) {
        return instance.post<any, AxiosResponse<ResponseType<{ item: TodoListType }>>, { title: string }>(`todo-lists`,
            {title: title})
            .then(res => res.data)
    },
    deleteTodoList(todoID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoID}`)
            .then(res => res.data)
    },
    updateTodoListTitle(todoID: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todoID}`, {title: title})
            .then(res => res.data)
    },
}


export const titleToDoListAPI = { // random title name
    getTitle(value: number) {
        return placeholderInst.get<PlaceHolderType[]>(`todos?_start=${value}&_limit=1`)
            .then(res => res.data)
    },
}