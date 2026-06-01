type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="mt-4 animate-fade-in rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-2.5">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-sm font-medium text-red-800">{message}</p>
          <p className="mt-0.5 text-xs text-red-600">
            Please check your input and try again.
          </p>
        </div>
      </div>
    </div>
  );
}
