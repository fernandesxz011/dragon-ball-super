import { createContext } from 'react'

export type MotionMode = 'static' | 'reveal' | 'full'
export const MotionModeContext = createContext<MotionMode>('static')

let mediaQueries: { reduced: MediaQueryList; desktop: MediaQueryList } | undefined

function getMediaQueries() {
  mediaQueries ??= {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)'),
    desktop: window.matchMedia('(min-width: 901px)'),
  }
  return mediaQueries
}

export function getMotionMode(): MotionMode {
  const { reduced, desktop } = getMediaQueries()
  return reduced.matches ? 'static' : desktop.matches ? 'full' : 'reveal'
}

export function subscribeToMotionPreferences(onChange: () => void) {
  const { reduced, desktop } = getMediaQueries()
  reduced.addEventListener('change', onChange)
  desktop.addEventListener('change', onChange)

  return () => {
    reduced.removeEventListener('change', onChange)
    desktop.removeEventListener('change', onChange)
  }
}
