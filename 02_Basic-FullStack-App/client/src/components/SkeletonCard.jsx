export const SkeletonCard = () => (
  <div className="rounded-2xl p-[1px] bg-gradient-to-r from-sky-500/30 via-indigo-500/30 to-purple-500/30">
    <div className="rounded-2xl bg-[#0b102a] p-6 animate-pulse space-y-4">
      <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
      <div className="h-3 w-full bg-slate-700 rounded"></div>
      <div className="h-3 w-5/6 bg-slate-700 rounded"></div>
    </div>
  </div>
);
