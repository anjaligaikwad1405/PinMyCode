type RecentSearchesProps = {
  history: string[];
  onRun: (value: string) => void;
  onDelete: (value: string) => void;
  onClear: () => void;
};

export function RecentSearches({ history, onRun, onDelete, onClear }: RecentSearchesProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Recent Searches</h3>
        {history.length > 0 && (
          <button
            className="text-xs text-slate-400 transition hover:text-slate-700"
            onClick={onClear}
            type="button"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {history.length > 0 ? (
          history.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 pl-2.5 pr-1.5 py-1 text-xs"
            >
              <button
                className="text-slate-600 hover:text-slate-900"
                onClick={() => onRun(item)}
                type="button"
              >
                {item}
              </button>
              <button
                aria-label={`Remove ${item}`}
                className="p-0.5 text-slate-300 hover:text-slate-600"
                onClick={() => onDelete(item)}
                type="button"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-400">No searches yet.</p>
        )}
      </div>
    </div>
  );
}
