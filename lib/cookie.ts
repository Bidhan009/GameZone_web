"use server"

import { cookies } from "next/headers"

export interface UserData {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

const COOKIE_MAX_AGE = 60 * 60; // 1 hour, in seconds — matches SEC-07's JWT expiry

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,                                  // JS cannot read this cookie — blocks XSS token theft
        secure: process.env.NODE_ENV === 'production',    // HTTPS-only in production; allows localhost HTTP in dev
        sameSite: 'lax',                                  // CSRF defense-in-depth
        maxAge: COOKIE_MAX_AGE,                           // matches JWT expiry — no stale cookie outliving the token
        path: '/',
    })
}
export const getAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return token || null;
}
export const setUserData = async (userData: UserData) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'user_data',
        value: JSON.stringify(userData),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
    })
}
export const getUserData = async (): Promise<UserData | null> => {
    const cookieStore = await cookies();
    const userData = cookieStore.get('user_data')?.value || null;
    return userData ? JSON.parse(userData) : null;
}

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    cookieStore.delete('user_data');
}

