import { toast as sonnerToast } from 'sonner'

/** A fully custom toast that still maintains the animations and interactions. */
type ToastProps = {
  id: string | number
  title: string
  description: string
}

/*  so that you can call it without having to use toast.custom everytime. */
export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom(id => (
    <Toast id={id} title={toast.title} description={toast.description} />
  ))
}

export function Toast({ title, description }: ToastProps) {
  return (
    <div className="flex items-start gap-3 w-full md:max-w-[360px] rounded-xl border border bg-surface p-4 shadow-[var(--panel-shadow)]">
      {/* accent bar */}
      <div className="mt-1 h-2 w-2 rounded-full bg-accent" />

      <div className="flex-1">
        <p className="text-sm font-semibold text-accent-weak ">{title}</p>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>

      {/* dismiss */}
      <button
        className="text-xs text-muted hover:text-accent transition-colors"
        onClick={() => sonnerToast.dismiss()}
      >
        ✕
      </button>
    </div>
  )
}
