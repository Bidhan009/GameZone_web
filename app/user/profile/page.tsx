import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound, redirect } from "next/navigation";
import UpdateUserForm from "../_components/UpdateProfile";


export default async function Page() {
    const result = await handleWhoAmI();

    if (!result.success) {
        // If we can't fetch user data (e.g. unauthenticated), send them to login
        return redirect("/login");
    }

    if (!result.data) {
        notFound();
    }

    return (
        <div>
            <UpdateUserForm user={result.data} />
        </div>
    );
}