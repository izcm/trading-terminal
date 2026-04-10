import { KeyboardEvent, MouseEvent, useState } from 'react'

type CopyableProps = {
  value: string
  children?: React.ReactNode
  className?: string
}

export function Copyable({ value, children, className = '' }: CopyableProps) {
  const [copied, setCopied] = useState<boolean>(false)

  async function handleCopy(e: KeyboardEvent | MouseEvent) {
    e.stopPropagation()

    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <span
      onClick={handleCopy}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCopy(e)
        }
      }}
      className={`
        cursor-pointer
        text-accent
        underline underline-offset-2 decoration-dotted
        hover:decoration-solid
        hover:text-accent-strong
        transition-colors
        ${className}
        `}
      title="Click to copy"
    >
      {copied ? 'copied' : (children ?? value)}
    </span>
  )
}
