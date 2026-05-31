export function LoadingState() {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-950">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
      <p className="text-sm font-medium">Detecting location...</p>
    </div>
  );
}
