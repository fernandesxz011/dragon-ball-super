interface ScrollAxis {
  current: number
  targetOffset: number
  targetLength: number
  containerLength: number
}

interface SceneProgress {
  id: string
  progress: number
  top: number
  height: number
  viewportHeight: number
}

const scenes = new Map<string, SceneProgress>()
let scrollPosition = 0

// Motion owns the scroll measurements. Three reads this small mutable bridge,
// so neither a second scroll listener nor React updates per frame are needed.
export function registerSceneProgress(id: string) {
  const entry: SceneProgress = { id, progress: 0, top: 0, height: 0, viewportHeight: 0 }
  scenes.set(id, entry)
  return {
    update(progress: number, axis: ScrollAxis) {
      if (scenes.get(id) !== entry) return
      entry.progress = progress
      entry.top = axis.targetOffset - axis.current
      entry.height = axis.targetLength
      entry.viewportHeight = axis.containerLength
      scrollPosition = axis.current
    },
    dispose() {
      if (scenes.get(id) === entry) scenes.delete(id)
    },
  }
}

export function getSceneView() {
  let predominant: SceneProgress | undefined
  let bestScore = 0
  scenes.forEach((entry) => {
    const visible = Math.max(0, Math.min(entry.viewportHeight, entry.top + entry.height) - Math.max(0, entry.top))
    if (!visible) return
    const distance = Math.abs(entry.top + entry.height / 2 - entry.viewportHeight / 2)
    const score = visible - distance * 0.025
    if (score > bestScore) {
      bestScore = score
      predominant = entry
    }
  })
  return { id: predominant?.id, progress: predominant?.progress ?? 0, scrollPosition }
}
