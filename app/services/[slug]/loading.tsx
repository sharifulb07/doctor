export default function ServiceLoadingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
      <div className="h-12 w-3/4 bg-slate-200 rounded animate-pulse" />
      <div className="h-5 w-full bg-slate-200 rounded animate-pulse" />
      <div className="h-5 w-5/6 bg-slate-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 h-80 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
