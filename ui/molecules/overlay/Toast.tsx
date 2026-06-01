import { toast as sonnerToast } from 'sonner'

type ToastVariant = 'default' | 'success' | 'error'

type ToastAction = {
  text: string
  fn: () => void
}

type ToastProps = {
  id: string | number
  title: string
  description: string
  variant?: ToastVariant
  toastAction?: ToastAction
}

function getTitleColor(variant?: ToastVariant) {
  switch (variant) {
    case 'error':
      return 'text-failure'
    case 'success':
      return 'text-success'
    default:
      return 'text-accent-weak'
  }
}

/*  so that you can call it without having to use toast.custom everytime. */
export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom(id => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      variant={toast.variant}
      toastAction={toast.toastAction}
    />
  ))
}
export function Toast({ title, description, variant, toastAction }: ToastProps) {
  return (
    <div className="flex items-start gap-3 w-full md:max-w-[360px] rounded-xl border border-default bg-surface p-4 shadow-[var(--panel-shadow)]">
      <div className="mt-1 h-2 w-2 rounded-full bg-accent" />

      <div className="flex-1">
        <p className={`text-sm font-semibold ${getTitleColor(variant)}`}>{title}</p>
        <p className="mt-1 text-xs text-muted">
          {description}{' '}
          {toastAction && (
            <button onClick={() => toastAction.fn()} className="text-accent underline">
              {toastAction.text}
            </button>
          )}
        </p>
      </div>

      <button
        className="text-xs text-muted hover:text-accent transition-colors"
        onClick={() => sonnerToast.dismiss()}
      >
        ✕
      </button>
    </div>
  )
}
