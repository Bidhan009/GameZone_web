// src/lib/api/admin/user.ts
import { API } from "../endpoints";
import axios from "../axios";
import { ApiResponse } from "../auth";
// import { userBox } from "@/lib/hive/boxes"; // Ensure this path is correct

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
        throw new Error(error.response?.data?.message || 'Create user failed');
    }
}