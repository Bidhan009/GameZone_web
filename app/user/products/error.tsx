"use client";

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
                <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
                <p className="text-gray-500 mb-6">{error.message || "Failed to load products"}</p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
