export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
}: {
  label?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 text-sm border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue)]/10 transition-all placeholder:text-[var(--text-muted)]"
      />
    </div>
  )
}