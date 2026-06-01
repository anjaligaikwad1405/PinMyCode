type LoadingStateProps = {
  message: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-500">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400/40" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-slate-500" />
      </span>
      {message}
    </div>
  );
}
