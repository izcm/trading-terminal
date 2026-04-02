export const Spinner = ({ size = 16 }: { size?: number }) => (
  <div
    style={{ width: size, height: size }}
    className="animate-spin rounded-full border-2 border-accent/50 border-t-transparent"
  />
)
