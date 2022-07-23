import {createContext, ReactNode, useEffect, useReducer} from 'react';
// utils
import axios from '../utils/axios';
import {isValidToken, setSession} from '../utils/jwt';
// @types
import {ActionMap, AuthState, AuthUser, JWTContextType} from '../types/auth';
import jwtDecode from "jwt-decode";
import {ref} from "yup";
import {loginAccount, registerAccount} from "../endpoints/AccountEndpoints";
import Iconify from "../components/Iconify";

// ----------------------------------------------------------------------

enum Types {
    Initial = 'INITIALIZE',
    Login = 'LOGIN',
    Logout = 'LOGOUT',
    Register = 'REGISTER',
}

type JWTAuthPayload = {
    [Types.Initial]: {
        isAuthenticated: boolean;
        user: AuthUser;
    };
    [Types.Login]: {
        user: AuthUser;
    };
    [Types.Logout]: undefined;
    [Types.Register]: {
        user: AuthUser;
    };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                isAuthenticated: action.payload.isAuthenticated,
                isInitialized: true,
                user: action.payload.user,
            };
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };

        case 'REGISTER':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
            };

        default:
            return state;
    }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
    children: ReactNode;
};

function AuthProvider({children}: AuthProviderProps) {
    const [state, dispatch] = useReducer(JWTReducer, initialState);

    useEffect(() => {
        const initialize = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');

                if (accessToken) {
                    if (isValidToken(accessToken)) {
                        setSession(accessToken);
                        const user = createUserFromToken(accessToken);

                        dispatch({
                            type: Types.Initial,
                            payload: {
                                isAuthenticated: true,
                                user,
                            },
                        });
                    } else {
                        delete axios.defaults.headers.common["Authorization"];
                        throw new Error('Invalid or expired refresh token');
                    }
                } else {
                    dispatch({
                        type: Types.Initial,
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: Types.Initial,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
    }, []);

    const login = async (email: string, password: string) => {
        const {succeeded, data} = await loginAccount(email, password);

        if (!succeeded) {
            throw new Error('Login failed. Check your username and password');
        }
        const {jwToken} = data;

        setSession(jwToken);
        dispatch({
            type: Types.Login,
            payload: {
                user: createUserFromToken(jwToken)
            },
        });
    };

    const createUserFromToken = (jwToken: string) => {
        const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const user: any = jwtDecode(jwToken);
        user.role = user[roleClaim] ?? "";
        return user;
    }

    const register = async (email: string, password: string, repeatPassword: string) => {
        const response = await registerAccount(email, password, repeatPassword);
        /*
        const {accessToken, user} = response.data;

        window.localStorage.setItem('accessToken', accessToken);
        dispatch({
            type: Types.Register,
            payload: {
                user,
            },
        });
         */
    };

    const logout = async () => {
        setSession(null);
        dispatch({type: Types.Logout});
    };


    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'jwt',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export {AuthContext, AuthProvider};
