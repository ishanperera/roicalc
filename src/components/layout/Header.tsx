export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            S&amp;S
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">
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
