import { useContext, useEffect, useRef } from 'react'
import { MotionModeContext } from '../motion/preferences'

let sceneModule: Promise<typeof import('./energy-scene')> | undefined

export function EnergyEffects() {
  const hostRef = useRef<HTMLDivElement>(null)
  const mode = useContext(MotionModeContext)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    host.dataset.effectStatus = mode === 'static' ? 'static' : 'loading'
    if (mode === 'static') return
    let disposed = false
    let cleanup: (() => void) | undefined
    // Wait until the prioritized poster has decoded. This enhancement never
    // gates rendering, fonts, native navigation or the static four-star orb.
    const poster = document.querySelector<HTMLImageElement>('.hero__image')
    const ready = poster?.decode().catch(() => undefined) ?? Promise.resolve()
    void ready.then(() => {
      if (disposed) return
      sceneModule ??= import('./energy-scene')
      return sceneModule.then(({ createEnergyScene }) => {
        if (!disposed) cleanup = createEnergyScene(host, mode === 'full')
      })
    }).catch(() => {
      if (!disposed) host.dataset.effectStatus = 'fallback'
    })
    return () => {
      disposed = true
      cleanup?.()
    }
  }, [mode])

  return <div ref={hostRef} className="energy-effects" aria-hidden="true" inert />
}
