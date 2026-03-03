export function SkeletonCard() {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-pulse flex flex-col items-center justify-center gap-4 border border-zinc-200/20 shadow-lg min-h-[160px]">
            <div className="w-24 h-24 bg-gray-300/30 rounded-full"></div>
            <div className="w-20 h-4 bg-gray-300/30 rounded-md"></div>
        </div>
    );
}
