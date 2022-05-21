import {AppThunk} from "../../app/store";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {clearTodosDataAC, ResultCodeStatuses} from "../Todolist/todolists-reducer";


const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const loginReducer = (
    state: InitialStateType = initialState, action: LoginActionsType): InitialStateType => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN": {
            return {...state, isLoggedIn: action.value}
        }
        default:
            return state;
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) => {
    return {type: 'login/SET-IS-LOGGED-IN', value,} as const;
}

// Thunk
export const authLogInTC = (data: LoginParamsType): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'));
        authAPI.login(data)
            .then(res => {
                if (res.resultCode === ResultCodeStatuses.success) {
                    dispatch(setIsLoggedInAC(true));
                    dispatch(setAppStatusAC('succeeded'));
                } else {
                    handleServerAppError(res, dispatch);
                }
            }).catch((rej: AxiosError) => {
            handleServerNetworkError(rej.message, dispatch);
        })
    }
}

export const logoutTC  = (): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        authAPI.logout()
            .then(res => {
                if (res.resultCode === ResultCodeStatuses.success) {
                    dispatch(setIsLoggedInAC(false));
                    dispatch(setAppStatusAC('succeeded'));
                    dispatch(clearTodosDataAC());
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch((rej: AxiosError) => {
                handleServerNetworkError(rej.message, dispatch)
            })
    }
}

// types
export type LoginActionsType = ReturnType<typeof setIsLoggedInAC>


