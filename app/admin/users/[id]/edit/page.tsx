import { fetchUserById } from "@/lib/actions/admin/user-action";
import EditUserForm from "@/app/admin/users/_components/EditUserForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditUserPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await fetchUserById(id);
    
    if (!result.success || !result.data) {
        return (
            <div className="p-6">
                <Link href="/admin/users" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="h-4 w-4" /> Back to Users
                </Link>
                <div className="text-center py-12">
                    <p className="text-destructive">User not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Link href={`/admin/users/${id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to User Details
            </Link>
            
            <div className="max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit User</h1>
                <EditUserForm user={result.data} />
            </div>
        </div>
    );
}
