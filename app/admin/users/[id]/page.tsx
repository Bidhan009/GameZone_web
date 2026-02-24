import { fetchUserById } from "@/lib/actions/admin/user-action";
import { ArrowLeft, Edit, Calendar, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import DeleteUserButton from "@/app/admin/users/_components/DeleteUserButton";

export default async function UserDetailPage({
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

    const user = result.data;
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

    return (
        <div className="p-6">
            <Link href="/admin/users" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to Users
            </Link>
            
            <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <h1 className="text-2xl font-bold">User Details</h1>
                        <div className="flex gap-2">
                            <Link 
                                href={`/admin/users/${id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90"
                            >
                                <Edit className="h-4 w-4" /> Edit
                            </Link>
                            <DeleteUserButton userId={id} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        {user.profileImage ? (
                            <img 
                                src={user.profileImage} 
                                alt={user.fullName || 'User'} 
                                className="h-32 w-32 rounded-full object-cover ring-4 ring-border"
                            />
                        ) : (
                            <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-16 w-16 text-muted-foreground" />
                            </div>
                        )}
                        <h2 className="mt-4 text-xl font-semibold">{user.fullName || 'N/A'}</h2>
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full mt-2">
                            {user.role || 'user'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium">{user.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Phone</p>
                                <p className="text-sm font-medium">{user.phone || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Joined Date</p>
                                <p className="text-sm font-medium">{joinedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
