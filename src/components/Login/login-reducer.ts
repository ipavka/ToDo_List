import {todoListAPI, TodoListType} from "../../api/todolists-api";
import {AppThunk} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState = {}

export const loginReducer = (
    state: any = initialState, action: any): any => {
    switch (action.type) {
        default:
            return state;
    }
}

// actions
// export const removeTodoListAC = (todolistID: string) => {
//     return {type: 'REMOVE-TODOLIST', todolistID,} as const;
// }


// Thunk
export const authLogInTC = (): AppThunk => async dispatch => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
}


// types
export type LoginActionsType = any


