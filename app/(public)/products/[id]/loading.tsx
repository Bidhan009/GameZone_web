export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0f1218]">
            <div className="bg-[#1a1f29] border-b border-gray-800 py-4">
                <div className="container mx-auto px-4">
                    <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="rounded-2xl bg-[#1a1f29] p-6 border border-gray-800">
                        <div className="aspect-square bg-gray-800 rounded-xl animate-pulse"></div>
                    </div>
                    <div className="space-y-6">
                        <div className="h-6 w-20 bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-10 w-3/4 bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-12 w-32 bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-6 w-48 bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-24 w-full bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-14 w-full bg-gray-800 rounded animate-pulse mt-8"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
