import React, {useCallback, useEffect} from 'react';
import './App.css';
import {useDispatch} from "react-redux";
import {TaskType} from "../api/todolists-api";
import {AddItemForm} from "../components/common/AddItemForm/AddItemForm";
import {Todolist} from "../components/Todolist/Todolist";
import {ProgressBar} from "../components/common/ProgressBar/ProgressBar";
import {Snackbar} from "../components/common/Snackbar/Snackbar";
import {addTodoListTC, fetchTodosTC, TodoListDomainType} from "../components/Todolist/todolists-reducer";
import {useAppSelector} from "./store";
import {RequestStatusType} from "./app-reducer";


export type TasksStateType = {
    [key: string]: TaskType[]
}

export const App = () => {

    useEffect(() => {
        dispatch(fetchTodosTC())
    }, [])

    const todoLists = useAppSelector<TodoListDomainType[]>(state => state.todoLists);
    const status = useAppSelector<RequestStatusType>(state => state.app.status);
    const  error = useAppSelector<string | null>(state => state.app.error);
    const dispatch = useDispatch();
// debugger
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodoListTC(title))
    }, [dispatch])

    return (<>
            {status === 'loading' && <ProgressBar/>}
            <Snackbar/>
            <main className="mainBlock">
                <div className="addInput">
                    <AddItemForm placeholder={'...add new ToDo List'} addItem={addTodolist}/>
                </div>
                <div className="todoListMainBlock">
                    {
                        todoLists.map(el => {
                            return (<Todolist
                                    key={el.id}
                                    todoList={el}/>
                            )
                        })
                    }
                </div>

            </main>
        </>

    );
}

export default App;
