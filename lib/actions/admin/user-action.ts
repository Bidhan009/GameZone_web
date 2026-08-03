"use server";
import { createUser, getUserById, updateUser, deleteUser } from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";

export const handleCreateUser = async (data:FormData)=> {
    try{
        const response = await createUser(data)
        if(response.success){
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'Registration successful',
                data: response.data
            }
        }
        return{
            success: false,
            message: response.message || 'Registration failed'
        }
    }catch (error: Error | any){
        return { success: false, message: error.message || 'Registration action failed'}
    }
}

export const handleUpdateUser = async (data: FormData, id: string) => {
    try {
        const response = await updateUser(id, data);
        if (response.success) {
            revalidatePath('/admin/users');
            revalidatePath(`/admin/users/${id}`);
            return {
                success: true,
                message: 'User updated successfully',
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || 'Update failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Update user failed' };
    }
}

export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUser(id);
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'User deleted successfully'
            };
        }
        return {
            success: false,
            message: response.message || 'Delete failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Delete user failed' };
    }
}

export const fetchUserById = async (id: string) => {
    try {
        const user = await getUserById(id);
        return { success: true, data: user };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Failed to fetch user' };
    }
}