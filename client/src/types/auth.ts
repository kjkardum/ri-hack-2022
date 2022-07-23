
export type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
            type: Key;
        }
        : {
            type: Key;
            payload: M[Key];
        };
};

export type AuthUser = null | any;

export type AuthState = {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthUser;
};

export type JWTContextType = {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthUser;
    method: 'jwt';
    login: (email: string, password: string) => Promise<{ success: boolean, message?: string }>;
    register: (email: string, password: string, repeatPassword: string) => Promise<{ success: boolean, message?: string }>;
    logout: () => Promise<void>;
};