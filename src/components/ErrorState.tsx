type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="w-full rounded-lg border border-red-100 bg-red-50 p-4 text-red-950">
      <p className="text-sm font-semibold">{message}</p>
      <p className="mt-1 text-sm text-red-800">
        Please check your browser location settings and try again.
      </p>
    </div>
  );
}
