"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-6">{error.message || "Failed to load product details"}</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/user/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
