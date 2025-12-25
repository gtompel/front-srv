export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Скелетон приветствия */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 border border-emerald-200 animate-pulse">
        <div className="h-8 w-64 bg-emerald-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-emerald-200 rounded"></div>
      </div>

      {/* Скелетон статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-slate-200 rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }}></div>
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded mb-2 animate-pulse" style={{ animationDelay: `${i * 100 + 100}ms` }}></div>
            <div className="h-4 w-24 bg-slate-200 rounded mb-2 animate-pulse" style={{ animationDelay: `${i * 100 + 150}ms` }}></div>
            <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 200}ms` }}></div>
          </div>
        ))}
      </div>

      {/* Скелетон быстрых действий и активности */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 w-32 bg-slate-200 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 w-40 bg-slate-200 rounded mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-slate-200 rounded animate-pulse" style={{ animationDelay: `${i * 50 + 25}ms` }}></div>
                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" style={{ animationDelay: `${i * 50 + 50}ms` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

