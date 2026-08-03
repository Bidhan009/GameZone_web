// src/lib/api/admin/user.ts
import { API } from "../endpoints";
import axios from "../axios";
import { ApiResponse } from "../auth";



export const createUser = async (userData: FormData) => {
    try {
        const response = await axios.post(
            API.ADMIN.USER.CREATE,
            userData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const result = response.data as ApiResponse;

        if (result.success && result.data) {
            // --- CRITICAL HIVE SYNC ---
            // We save the user returned from MongoDB (result.data) into Hive
            // result.data now contains the _id and the profileImage path
            
            // await userBox.put(result.data._id, result.data); 
            console.log("Syncing MongoDB data to Hive:", result.data);
        }

        return result;
    } catch (error: any) {
        console.error('=== CREATE USER API ERROR ===');
        console.error('Create user failed:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            headers: error.config?.headers
          }
        });
        throw new Error(error.response?.data?.message || 'Create user failed');
    }
}

export async function getUsers(): Promise<any[]> {
  const endpoint = API.ADMIN.USER.GET_ALL;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const fullUrl = `${baseUrl}${endpoint}`;
  
  console.log("=== USERS API DEBUG ===");
  console.log("Endpoint:", endpoint);
  console.log("Full URL:", fullUrl);
  console.log("Base URL:", baseUrl);
  
  try {
    // Test if backend is reachable
    try {
      const healthCheck = await axios.get(`${baseUrl}/`);
      console.log("Backend health check:", healthCheck.data);
    } catch (healthError: any) {
      console.error("Backend health check failed:", healthError.message);
      console.error("Backend might not be running on:", baseUrl);
      return [];
    }
    
    console.log("Fetching users from:", endpoint);
    const response = await axios.get(endpoint);
    console.log("Users API response:", response.data);
    
    const result = response?.data as ApiResponse | null;

    // Defensive: if response.data is missing or not an object, return empty list
    if (!result || typeof result !== 'object') {
      console.error('getUsers: unexpected response shape', response?.data);
      return [];
    }

    // Add base URL to profile image paths if they exist
    if (result.success && result.data) {
      const usersWithImages = result.data.map((user: any) => ({
        ...user,
        profileImage: user.profileImage ? `${baseUrl}${user.profileImage}` : null,
        fullProfileImageUrl: user.profileImage ? `${baseUrl}${user.profileImage}` : null
      }));
      console.log("Users with image URLs:", usersWithImages);
      return usersWithImages;
    } else {
      console.warn("API returned no users:", result);
      return [];
    }
  } catch (error: any) {
    console.error('=== USERS API ERROR ===');
    console.error('Get users failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });
    return [];
  }
}

export const getUserById = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(API.ADMIN.USER.GET_ONE(id));
    const result = response.data as ApiResponse;
    
    if (result.success && result.data) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      return {
        ...result.data,
        profileImage: result.data.profileImage ? `${baseUrl}${result.data.profileImage}` : null,
        fullProfileImageUrl: result.data.profileImage ? `${baseUrl}${result.data.profileImage}` : null
      };
    }
    throw new Error(result.message || 'User not found');
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    throw new Error(error.response?.data?.message || 'Get user failed');
  }
}

export const updateUser = async (id: string, userData: FormData): Promise<any> => {
  try {
    const response = await axios.put(API.ADMIN.USER.UPDATE(id), userData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const result = response.data as ApiResponse;
    
    if (result.success) {
      return result;
    }
    throw new Error(result.message || 'Update failed');
  } catch (error: any) {
    console.error('Update user error:', error);
    throw new Error(error.response?.data?.message || 'Update user failed');
  }
}

export const deleteUser = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete(API.ADMIN.USER.DELETE(id));
    const result = response.data as ApiResponse;
    
    if (result.success) {
      return result;
    }
    throw new Error(result.message || 'Delete failed');
  } catch (error: any) {
    console.error('Delete user error:', error);
    throw new Error(error.response?.data?.message || 'Delete user failed');
  }
}