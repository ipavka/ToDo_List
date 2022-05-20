import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {AppActionsType, appReducer} from "./app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {TaskActionsType, tasksReducer} from "../components/Todolist/Task/tasks-reducer";
import {TodoListActionsType, todoListsReducer} from "../components/Todolist/todolists-reducer";
import {LoginActionsType, loginReducer} from "../components/Login/login-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    login: loginReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppRootStateType = ReturnType<typeof rootReducer>
export type RootActionsType = TaskActionsType
    | TodoListActionsType
    | AppActionsType
    | LoginActionsType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, RootActionsType>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store;
