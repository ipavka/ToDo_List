import {v1} from 'uuid';
import {
    addTodolistAC, changeTodolistFilterAC,
    changeTodoListTitleAC,
    FilterValuesType, removeTodoListAC, TodoListDomainType,
    todoListsReducer
} from "../todolists-reducer";


test('correct todolist should be removed', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    const startState: TodoListDomainType[] = [
        {id: todoListId1, title: "What to learn", filter: "all", addedDate: '',
        order: 0,},
        {id: todoListId2, title: "What to buy", filter: "all", addedDate: '',
        order: 0,}
    ]

    const endState = todoListsReducer(startState, removeTodoListAC(todoListId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
});

test('correct todolist should be added', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodoListTitle = "New Todolist";

    const startState: TodoListDomainType[] = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: '',
        order: 0,},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: '',
        order: 0,}
    ]

    const endState = todoListsReducer(startState, addTodolistAC(newTodoListTitle))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodoListTitle);
});

test('correct todolist should change its name', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New Todolist";

    const startState: TodoListDomainType[] = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0}
    ]

    const endState = todoListsReducer(
        startState, changeTodoListTitleAC(todolistId2, newTodolistTitle)
    );

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newFilter: FilterValuesType = "completed";

    const startState: TodoListDomainType[] = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0,},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0,}
    ]

    const endState = todoListsReducer(startState, changeTodolistFilterAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

