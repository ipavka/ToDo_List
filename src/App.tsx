import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {AddItemForm} from './components/AddItemForm';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTodoListTC, fetchTodosTC, TodoListDomainType} from "./state/todolists-reducer";
import {TaskType} from "./api/todolists-api";


export type TasksStateType = {
    [key: string]: TaskType[]
}

export const App = () => {

    useEffect(() => {
        dispatch(fetchTodosTC())
    }, [])

    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists)
    const dispatch = useDispatch();

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodoListTC(title))
    }, [dispatch])

    return (
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
    );
}

export default App;
