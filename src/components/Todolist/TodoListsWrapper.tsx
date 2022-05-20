import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType, useAppSelector} from "../../app/store";
import {fetchTodosTC, TodoListDomainType} from "./todolists-reducer";
import {Todolist} from "./Todolist";
import {useNavigate} from "react-router-dom";

export const TodoListsWrapper = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const todoLists = useAppSelector<TodoListDomainType[]>(state => state.todoLists);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.login.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchTodosTC())
        } else {
            navigate('login')
        }
    }, [isLoggedIn])

    return (
        <>
            {
                todoLists.map(el => {
                    return (<Todolist
                            key={el.id}
                            todoList={el}/>
                    )
                })
            }
        </>
    );
};

