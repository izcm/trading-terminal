'use client'

interface CheckboxProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none relative">
      <div className="relative w-4 h-4 flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange?.(e.target.checked)}
          className="
            peer w-4 h-4 rounded-sm 
            border border-accent/50 
            bg-transparent
            cursor-pointer 
            appearance-none
            transition-all

            hover:border-accent/80
            checked:border-accent
          "
        />

        {/* CHECKMARK */}
        <span
          className="
            absolute text-accent text-[14px] leading-none
            pointer-events-none
            opacity-0 peer-checked:opacity-100 
            transition-opacity
          "
        >
          ✓
        </span>
      </div>

      <span className="text-sm text-muted peer-hover:text-accent transition-colors">{label}</span>
    </label>
  )
}
