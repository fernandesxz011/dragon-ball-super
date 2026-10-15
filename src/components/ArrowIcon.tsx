type ArrowDirection = 'up-right' | 'down-right' | 'up'

const arrowPaths: Record<ArrowDirection, string> = {
  'up-right': 'M5 19 19 5M5 5h14v14',
  'down-right': 'M5 5 19 19M5 19h14V5',
  up: 'M12 20V4m-7 7 7-7 7 7',
}

export function ArrowIcon({ direction = 'up-right' }: { direction?: ArrowDirection }) {
  return (
    <svg
      className="arrow-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={arrowPaths[direction]} />
    </svg>
  )
}
