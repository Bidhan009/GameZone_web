"use server";

import { login, register, updateProfile, whoAmI, resetPassword, requestPasswordReset } from "@/lib/api/auth";
import type { ApiResponse } from "@/lib/api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


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
    } catch (error: Error | any) {
        const errorMessage = error instanceof Error ? error.message : 'Registration action failed';
        return { 
            success: false, 
            message: errorMessage
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
    } catch (error: Error | any) {
        const errorMessage = error instanceof Error ? error.message : 'Login action failed';
        return { 
            success: false, 
            message: errorMessage
        };
    }
};

export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
};

export async function handleWhoAmI() {
    try {
        const result = await whoAmI();
        if (result.success) {
            return {
                success: true,
                message: 'User data fetched successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to fetch user data' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export async function handleUpdateProfile(profileData: FormData) {
    try {
        const result = await updateProfile(profileData);
        if (result.success && result.data) {
            await setUserData(result.data); // update cookie 
            revalidatePath('/user/profile'); // revalidate profile image/ refresh new data
            return {
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email);
        if (response.success) {
            return {
                success: true,
                message: 'Password reset email sent successfully'
            }
        }
        return { success: false, message: response.message || 'Request password reset failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Request password reset action failed' }
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword);
        if (response.success) {
            return {
                success: true,
                message: 'Password has been reset successfully'
            }
        }
        return { success: false, message: response.message || 'Reset password failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Reset password action failed' }
    }
};