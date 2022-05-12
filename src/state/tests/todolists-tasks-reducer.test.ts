import {TasksStateType} from "../../App";
import {addTodolistAC, TodoListDomainType, todoListsReducer} from "../todolists-reducer";
import {tasksReducer} from "../tasks-reducer";
import {v1} from "uuid";


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: TodoListDomainType[] = [];

    const action = addTodolistAC(
        {id: v1(), title: "What to learn", addedDate: '', order: 0});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.item.id);
    expect(idFromTodoLists).toBe(action.item.id);
});
