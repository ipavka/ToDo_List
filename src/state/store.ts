import {tasksReducer} from './tasks-reducer';
import {todoListsReducer} from './todolists-reducer';
import {combineReducers, legacy_createStore as createStore} from 'redux';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer
})

export const store = createStore(rootReducer);
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
