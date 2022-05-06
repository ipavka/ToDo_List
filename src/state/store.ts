import {TaskActionsType, tasksReducer} from './tasks-reducer';
import {setTodosAC, TodoListActionsType, todoListsReducer} from './todolists-reducer';
import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {todoListAPI} from "../api/todolists-api";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TaskActionsType | TodoListActionsType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

// @ts-ignore
window.store = store;
