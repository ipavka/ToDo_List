import React, {useCallback, useEffect} from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {TaskType} from "../api/todolists-api";
import {AddItemForm} from "../components/common/AddItemForm/AddItemForm";
import {ProgressBar} from "../components/common/ProgressBar/ProgressBar";
import {Snackbar} from "../components/common/Snackbar/Snackbar";
import {addTodoListTC} from "../components/Todolist/todolists-reducer";
import {AppRootStateType, useAppSelector} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../components/Login/Login";
import {Error404} from "../components/common/Error404/Error404";
import {Spinner} from "../components/common/Spinner/Spinner";
import {TodoListsWrapper} from "../components/Todolist/TodoListsWrapper";


export type TasksStateType = {
    [key: string]: TaskType[]
}

export const App = () => {

    const dispatch = useDispatch();

    const status = useAppSelector<RequestStatusType>(state => state.app.status);
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized);

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodoListTC(title))
    }, [dispatch])

    if (!isInitialized) {
        return <Spinner/>
    }

    return (<>
            {status === 'loading' && <ProgressBar/>}
            <Snackbar/>
            <Routes>
                <Route path="/"
                       element={<main className="mainBlock">
                           <div className="addInput">
                               <AddItemForm placeholder={'...add new ToDo List'} addItem={addTodolist}/>
                           </div>
                           <div className="todoListMainBlock">
                               <TodoListsWrapper/>
                           </div>
                       </main>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/404" element={<Error404/>}/>
                <Route path="*" element={<Navigate to={"/404"}/>}/>
            </Routes>
        </>
    );
}

export default App;
