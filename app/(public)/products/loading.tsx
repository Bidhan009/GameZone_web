export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0f1218]">
            <div className="bg-[#1a1f29] border-b border-gray-800 py-6">
                <div className="container mx-auto px-4">
                    <div className="h-8 w-48 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-64 bg-gray-800 rounded animate-pulse mt-2"></div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-gray-800 bg-[#1c212a] p-4">
                            <div className="h-48 bg-gray-800 rounded-xl animate-pulse mb-4"></div>
                            <div className="h-3 w-16 bg-gray-800 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-full bg-gray-800 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-2/3 bg-gray-800 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
