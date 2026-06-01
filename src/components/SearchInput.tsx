type SearchInputProps = {
  label: string;
  onChange: (value: string) => void;
  value: string;
  placeholder: string;
  wrapperClassName?: string;
  inputMode?: "numeric";
  maxLength?: number;
  id?: string;
};

export function SearchInput({
  label,
  onChange,
  value,
  placeholder,
  wrapperClassName = "",
  inputMode,
  maxLength,
  id,
}: SearchInputProps) {
  return (
    <div className={wrapperClassName}>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10"
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
