import { Matrix4, MathUtils } from 'three'
import { artDepth } from './config'

interface DepthFrame {
  element: HTMLElement
  matrix: Matrix4
  left: number
  top: number
  width: number
  height: number
  strength: number
  progress: number
  pointerX: number
  pointerY: number
  originalTransform: string
  originalOrigin: string
}

interface DepthInput {
  activeId: string | undefined
  settled: boolean
  time: number
  delta: number
  progress: number
  scrollY: number
  viewportHeight: number
  mouseX: number | undefined
  mouseY: number | undefined
}

// CSS and the aura vertex use this exact column-major matrix and CSS axes.
export function composeArtDepth(matrix: Matrix4, rotationX: number, rotationY: number, scale: number, width: number) {
  const distance = Math.max(artDepth.minPerspective, width * artDepth.perspectiveWidth)
  const cx = Math.cos(rotationX)
  const sx = Math.sin(rotationX)
  const cy = Math.cos(rotationY)
  const sy = Math.sin(rotationY)
  // perspective(distance) * rotateX * rotateY * scale; Z stays unscaled.
  return matrix.set(
    cy * scale, 0, sy, 0,
    sx * sy * scale, cx * scale, -sx * cy, 0,
    -cx * sy * scale, sx * scale, cx * cy, 0,
    cx * sy * scale / distance, -sx * scale / distance, -cx * cy / distance, 1,
  )
}

export function createArtDepth(enabled: boolean) {
  const frames = new Map<string, DepthFrame>()
  document.querySelectorAll<HTMLElement>('[data-depth-surface]').forEach((element) => {
    const id = element.closest<HTMLElement>('[data-scene]')?.dataset.scene
    if (!id) return
    frames.set(id, {
      element, matrix: new Matrix4(), left: 0, top: 0, width: 1, height: 1,
      strength: 0, progress: 0, pointerX: 0, pointerY: 0,
      originalTransform: element.style.transform,
      originalOrigin: element.style.transformOrigin,
    })
  })
  let disposed = false

  return {
    // Layout reads happen only on initialisation/resize, with our own transforms
    // temporarily removed. No projected AABB is mistaken for the resting image.
    measure(readLayout: () => void) {
      if (disposed) return
      const previous: [HTMLElement, string][] = []
      frames.forEach(({ element }) => {
        previous.push([element, element.style.transform])
        element.style.transform = 'none'
      })
      try {
        frames.forEach((frame) => {
          const bounds = frame.element.getBoundingClientRect()
          frame.left = bounds.left
          frame.top = bounds.top + window.scrollY
          frame.width = bounds.width
          frame.height = bounds.height
        })
        readLayout()
      } finally {
        previous.forEach(([element, transform]) => { element.style.transform = transform })
      }
    },
    update(input: DepthInput) {
      if (disposed || !enabled) return
      const blend = 1 - Math.exp(-Math.max(0, input.delta) * artDepth.easing)
      frames.forEach((frame, id) => {
        const active = id === input.activeId && input.settled
        const visible = frame.top < input.scrollY + input.viewportHeight && frame.top + frame.height > input.scrollY
        frame.strength += ((active && visible ? 1 : 0) - frame.strength) * blend
        if (active) frame.progress = input.progress
        if (frame.strength < 0.0001) {
          frame.strength = 0
          frame.matrix.identity()
          frame.element.style.transform = frame.originalTransform
          delete frame.element.dataset.depthActive
          return
        }
        const x = input.mouseX === undefined ? 0 : MathUtils.clamp((input.mouseX - frame.left - frame.width / 2) / Math.max(1, frame.width / 2), -1, 1)
        const y = input.mouseY === undefined ? 0 : MathUtils.clamp((input.mouseY - frame.top + input.scrollY - frame.height / 2) / Math.max(1, frame.height / 2), -1, 1)
        frame.pointerX += (x - frame.pointerX) * blend
        frame.pointerY += (y - frame.pointerY) * blend
        const rx = MathUtils.clamp(Math.sin(input.time * 0.19 + frame.progress) * 0.004 - frame.pointerY * artDepth.maxTilt * 0.72, -artDepth.maxTilt, artDepth.maxTilt)
        const ry = MathUtils.clamp(Math.sin(input.time * 0.15 + frame.progress * 0.8 + 0.9) * 0.005 + frame.pointerX * artDepth.maxTilt * 0.72, -artDepth.maxTilt, artDepth.maxTilt)
        composeArtDepth(frame.matrix, rx * frame.strength, ry * frame.strength, 1 + (artDepth.scale - 1) * frame.strength, frame.width)
        frame.element.style.transformOrigin = '50% 50%'
        frame.element.style.transform = `matrix3d(${frame.matrix.elements.join(',')})`
        frame.element.dataset.depthActive = 'true'
      })
    },
    get(id: string) { return frames.get(id) },
    dispose() {
      if (disposed) return
      disposed = true
      frames.forEach((frame) => {
        frame.element.style.transform = frame.originalTransform
        frame.element.style.transformOrigin = frame.originalOrigin
        delete frame.element.dataset.depthActive
      })
      frames.clear()
    },
  }
}
