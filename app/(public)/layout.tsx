// export default function Layout({ children }: { children: React.ReactNode }) {
//     return (
//         <section>
//             <main className="mx-auto  px-4 sm:px-6 lg:px-8">
//                 {children}
//             </main>
//         </section>
//     );
// }
"use client";

import { AuthProvider } from "@/context/AuthContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}