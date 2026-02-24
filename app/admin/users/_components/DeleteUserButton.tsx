"use client";
import { Trash2 } from "lucide-react";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface DeleteUserButtonProps {
    userId: string;
}

export default function DeleteUserButton({ userId }: DeleteUserButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await handleDeleteUser(userId);
            if (response.success) {
                toast.success("User deleted successfully");
                router.push('/admin/users');
            } else {
                toast.error(response.message || "Failed to delete user");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm hover:opacity-90"
        >
            <Trash2 className="h-4 w-4" /> Delete
        </button>
    );
}
