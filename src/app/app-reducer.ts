import {AppThunk} from "./store";
import {authAPI} from "../api/todolists-api";
import {ResultCodeStatuses} from "../components/Todolist/todolists-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../components/Login/login-reducer";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}
export type InitialStateType = typeof initialState
export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

// actions
export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status,} as const;
}
export const setAppErrorAC = (error: string | null) => {
    return {type: 'APP/SET-ERROR', error} as const;
}
export const setAppInitializedAC = (isInitialized: boolean) => {
    return {type: 'APP/SET-IS-INITIALIZED', isInitialized} as const
}

// Thunk
export const initializeAppTC = (): AppThunk => dispatch => {
    dispatch(setAppStatusAC('loading'));
    authAPI.authMe().then(res => {
        if (res.resultCode === ResultCodeStatuses.success) {
            dispatch(setIsLoggedInAC(true));
            dispatch(setAppStatusAC('succeeded'));
        } else {
            handleServerAppError(res, dispatch);
        }
    }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    }).finally(() => dispatch(setAppInitializedAC(true)));
}

// type
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type SetAppInitializedType = ReturnType<typeof setAppInitializedAC>
export type AppActionsType = SetAppStatusType | SetAppErrorType | SetAppInitializedType
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
