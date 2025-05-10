const ProfileSkeleton = () => (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 rounded-xl"></div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12 sm:-mt-16 px-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded-full border-4 border-white shadow-md"></div>
            <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-80"></div>
            </div>
            <div className="flex-grow"></div>
            <div className="hidden sm:block">
                <div className="h-10 w-40 bg-gray-200 rounded-md"></div>
            </div>
        </div>

        <div className="sm:hidden mt-4 px-4">
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>

        <div className="mt-8 px-4">
            <div className="flex gap-3 overflow-x-auto pb-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 w-32 bg-gray-200 rounded-md"></div>
                ))}
            </div>

            <div className="mt-6 space-y-4">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        </div>
    </main>
);

export default ProfileSkeleton;