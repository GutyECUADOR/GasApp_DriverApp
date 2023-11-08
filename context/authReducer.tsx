import { User } from "../interfaces/appInterfaces";

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated'
    token: string | null;
    errorMessage: string;
    errorRegisterMessage: string;
    user: User | null;
}

type AuthAction = | 
    { type: 'signUp', payload: { token: string, user: User }}
    | { type: 'addError', payload: string }
    | { type: 'removeError'}
    | { type: 'addRegisterError', payload: string }
    | { type: 'removeRegisterError'}
    | { type: 'notAuthenticated'}
    | { type: 'logout'}


export const authReducer = ( state: AuthState, action: AuthAction) : AuthState => {
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'not-authenticated',
                token: null,
                errorMessage: action.payload
            }
            break;

        case 'removeError':
            return {
                ...state,
                errorMessage : ''
            }

        case 'addRegisterError':
            return {
                ...state,
                user: null,
                status: 'not-authenticated',
                token: null,
                errorRegisterMessage: action.payload
            }
            break;

        case 'removeRegisterError':
            return {
                ...state,
                errorRegisterMessage : ''
            }

        case 'signUp':
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user
            }

        case 'logout':
        case 'notAuthenticated':
            return {
                ...state,
                errorMessage: '',
                status: 'not-authenticated',
                token: null,
                user: null
            }

       
        default:
            return state;
            break;
    } 
}