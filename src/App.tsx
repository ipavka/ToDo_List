import React, {useCallback} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {AddItemForm} from './components/AddItemForm';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTodolistAC, TodoListDomainType} from "./state/todolists-reducer";
import {TaskType} from "./api/todolists-api";


export type TasksStateType = {
    [key: string]: TaskType[]
}

export const App = () => {

    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists)
    const dispatch = useDispatch();

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [dispatch])

    return (
        <div className="App">
            <AddItemForm addItem={addTodolist}/>
            {
                todoLists.map(el => {
                    return (<main>
                            <Todolist
                                key={el.id}
                                todoList={el}
                            />
                        </main>
                    )
                })
            }
        </div>
    );
}

export default App;
