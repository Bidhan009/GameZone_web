// import Link from "next/link";

// export default function Page() {
//     return (
//         <div>
//             <Link className="text-blue-500 border border-blue-500 p-2 rounded inline-block"
//              href="/admin/users/create">Create User</Link>
//         </div>
//     );
// }

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsers } from "@/lib/api/admin/user";
import { 
  User, 
  Edit, 
  Trash2, 
  Mail, 
  Shield, 
  MoreHorizontal,
  Search,
  Filter,
  Eye
} from "lucide-react";

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage(){
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                console.log("Users fetched:", usersData);
                setUsers(usersData);
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div>Loading Users...</div>;

    const resolveMediaUrl = (path?: string) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      return `${base}${path}`;
    };

    const filteredUsers = users;

    const handleDeleteUser = (id: string) => {
      console.log("Delete user:", id);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Users Table</h1>
                <Link className="bg-blue-600 text-white p-2 rounded" href="/admin/users/create">
                    + Create User
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Photo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {user.profileImage ? (
                                                <img 
                                                    src={resolveMediaUrl(user.profileImage)} 
                                                    alt={user.fullName}
                                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-200 shadow-md"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%239CAAF'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' font-size='16' font-weight='bold' fill='white'%3E${user.fullName.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                                                    <span className="text-lg font-bold text-white">
                                                        {user.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{user.fullName}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                                            user.role === 'admin' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link 
                                                href={`/admin/users/${user._id}`}
                                                className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Link>
                                            
                                            <Link 
                                                href={`/admin/users/${user._id}/edit`}
                                                className="text-green-600 hover:text-green-900 inline-flex items-center gap-1 text-sm font-medium"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </Link>
                                            
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-sm font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
