export default function AuthLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Скелетон сайдбара */}
      <div className="hidden md:block w-64 bg-slate-100 border-r border-slate-300">
        <div className="p-4 space-y-4">
          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 rounded animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col">
        {/* Скелетон хедера */}
        <div className="h-12 bg-slate-100 border-b border-slate-300 flex items-center justify-between px-6">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-64 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Скелетон контента */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Заголовок */}
            <div className="h-8 w-64 bg-slate-200 rounded animate-pulse"></div>
            
            {/* Карточки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <div className="h-12 w-12 bg-slate-200 rounded-lg mb-4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                  <div className="h-6 w-20 bg-slate-200 rounded mb-2 animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }}></div>
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 100}ms` }}></div>
                </div>
              ))}
            </div>

            {/* Таблица/Список */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Скелетон футера */}
        <div className="h-12 bg-slate-100 border-t border-slate-300 flex items-center justify-center">
          <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

