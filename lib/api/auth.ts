import { LoginData, RegisterData } from "@/app/(auth)/schema"
import { UserData } from "@/lib/cookie"
import axios from "./axios"
import { API } from "./endpoints"

export interface ApiResponse<T = UserData> {
    success: boolean;
    message?: string;
    token?: string;
    data?: T;
}

export const register = async (registerData: RegisterData): Promise<ApiResponse> => {
    try {
        const response = await axios.post(API.AUTH.REGISTER, registerData)
        return response.data as ApiResponse
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        const axiosError = error as { response?: { data?: { message?: string } } };
        throw new Error(axiosError.response?.data?.message || errorMessage)
    }
}

export const login = async (loginData: LoginData): Promise<ApiResponse> => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData)
        return response.data as ApiResponse
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        const axiosError = error as { response?: { data?: { message?: string } } };
        throw new Error(axiosError.response?.data?.message || errorMessage)
    }
}