import {combineReducers} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {AppActionsType, appReducer} from "./app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {TaskActionsType, tasksReducer} from "../components/Todolist/Task/tasks-reducer";
import {TodoListActionsType, todoListsReducer} from "../components/Todolist/todolists-reducer";
import {loginReducer} from "../components/Login/login-reducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
  app: appReducer,
  login: loginReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
});
export type AppRootStateType = ReturnType<typeof rootReducer>
export type RootActionsType = TaskActionsType
  | TodoListActionsType
  | AppActionsType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, RootActionsType>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store;
