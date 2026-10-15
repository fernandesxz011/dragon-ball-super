import { useSyncExternalStore, type ReactNode } from 'react'
import { getMotionMode, MotionModeContext, subscribeToMotionPreferences, type MotionMode } from './preferences'

export function MotionProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore<MotionMode>(subscribeToMotionPreferences, getMotionMode, () => 'static')
  return <MotionModeContext value={mode}>{children}</MotionModeContext>
}
