import { useContext, useEffect, useRef } from 'react'
import { MotionModeContext } from './preferences'

let motionModule: Promise<typeof import('./scene-motion')> | undefined

export function useSceneMotion(kind: 'intro' | 'saga') {
  const sceneRef = useRef<HTMLElement>(null)
  const mode = useContext(MotionModeContext)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    scene.dataset.motionMode = mode
    if (mode === 'static') return

    let disposed = false
    let cleanup: (() => void) | undefined
    motionModule ??= import('./scene-motion')

    // The page renders before this optional module loads. Failed enhancement
    // leaves the visible HTML and all native links available.
    void motionModule.then(({ enhanceScene }) => {
      if (!disposed) cleanup = enhanceScene(scene, kind, mode === 'full')
    }).catch(() => {
      if (!disposed) {
        scene.dataset.motionMode = 'static'
        scene.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
          element.style.removeProperty('opacity')
          element.style.removeProperty('transform')
        })
      }
    })

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [kind, mode])

  return sceneRef
}
