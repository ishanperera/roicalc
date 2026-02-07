export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-blue-500/25">
            S&amp;S
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-sm font-bold text-transparent">
              Syndicate &amp; Scale
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Real Estate ROI Calculator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
