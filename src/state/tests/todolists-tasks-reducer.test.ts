import {TasksStateType} from "../../App";
import {addTodolistAC, TodoListDomainType, todoListsReducer} from "../todolists-reducer";
import {tasksReducer} from "../tasks-reducer";


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: TodoListDomainType[] = [];

    const action = addTodolistAC("new todolist");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.todolistID);
    expect(idFromTodoLists).toBe(action.todolistID);
});
