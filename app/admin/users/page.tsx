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
import {toast} from "react-toastify";

export default function UsersPage(){
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users`;
            console.log("Fetching from:", url); // Debug 1
            
            const response = await fetch(url);
            const result = await response.json();
            
            console.log("Backend Response:", result); // Debug 2 - LOOK AT THIS IN CONSOLE

            // Check if data.users exists, otherwise try data (if the backend returns a raw array)
            if (result.success && result.data) {
    setUsers(result.data); 
} else if (Array.isArray(result)) {
    setUsers(result);
} else {
    console.warn("Expected 'data' array in response but got:", result);
}
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

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Link className="bg-blue-600 text-white p-2 rounded" href="/admin/users/create">
                    + Create User
                </Link>
            </div>

            {/* <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any) => (
                        <tr key={user._id} className="text-center">
                            <td className="border p-2">{user.username}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2 space-x-2">
                                <Link href={`/admin/users/${user._id}`} className="text-green-600">View</Link>
                                <Link href={`/admin/users/${user._id}/edit`} className="text-blue-600">Edit</Link>
                                <button className="text-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    );
}