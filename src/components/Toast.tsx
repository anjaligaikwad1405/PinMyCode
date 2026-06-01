"use client";

type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed right-4 top-4 z-50 animate-slide-in-right rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-lg shadow-slate-900/5">
      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {message}
    </div>
  );
}
