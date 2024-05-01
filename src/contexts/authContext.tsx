"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

type AuthToken = {
    token: string;
};

const AUTH_TOKEN_KEY = 'NEXTJS_AUTH_TOKEN';

export const AuthContext = createContext({
    login: (authToken: AuthToken) => {},
    logout: () => {},
    isLoggedIn: false,
    authToken: null,
});

export default function AuthContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const authTokenInLocalStorage = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const [authToken, setAuthToken] = useState(
        authTokenInLocalStorage !== null
            ? JSON.parse(authTokenInLocalStorage) 
            : null
    );

    const login = useCallback(function (authToken: AuthToken) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authToken));
        setAuthToken(authToken);
    }, []);

    const logout = useCallback(function () {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthToken(null);
    }, []);

    const value = useMemo(
        () => ({
            login,
            logout,
            isLoggedIn: authToken !== null,
            authToken,
        }), [authToken, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    return useContext(AuthContext);
}


