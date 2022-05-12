export type RequestStatusType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const initialState: RequestStatusType = {
    status: 'loading',
    error: 'some error...'
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP-SET-STATUS':
            return {...state, status: action.status}
        case 'APP-SET-ERROR':
            return {...state, status: action.error}
        default:
            return state
    }
}

type ActionsType = any