"use server";

import { login, register } from "@/lib/api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";

/** * Interface for the Backend API Response.
 * This ensures TypeScript knows what 'response.success' and 'response.data' are.
 */
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    token?: string;
    data?: T;
}

export const handleRegister = async (data: RegisterData): Promise<ApiResponse> => {
    try {
        // We cast the call to our Interface to fix the 'unknown' error
        const response = (await register(data)) as ApiResponse;

        if (response.success) {
            return {
                success: true,
                message: 'Registration successful',
                data: response.data
            };
        }

        return {
            success: false,
            message: response.message || 'Registration failed'
        };
    } catch (error: any) {
        return { 
            success: false, 
            message: error.message || 'Registration action failed' 
        };
    }
};

export const handleLogin = async (data: LoginData): Promise<ApiResponse> => {
    try {
        const response = (await login(data)) as ApiResponse;

        if (response.success) {
            // Store session data in cookies
            if (response.token) await setAuthToken(response.token);
            if (response.data) await setUserData(response.data);

            return {
                success: true,
                message: 'Login successful',
                data: response.data
            };
        }

        return {
            success: false,
            message: response.message || 'Login failed'
        };
    } catch (error: any) {
        return { 
            success: false, 
            message: error.message || 'Login action failed' 
        };
    }
};

export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
};