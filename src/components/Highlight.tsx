export function highlight(value: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return value;
  const index = value.toLowerCase().indexOf(trimmed.toLowerCase());
  if (index < 0) return value;
  return (
    <>
      {value.slice(0, index)}
      <mark className="rounded bg-slate-200 px-0.5 text-slate-900">
        {value.slice(index, index + trimmed.length)}
      </mark>
      {value.slice(index + trimmed.length)}
    </>
  );
}
