import { Color, OrthographicCamera, Scene, SRGBColorSpace, WebGLRenderer } from 'three'
import { getSceneView } from '../motion/scene-progress'
import { effectQuality, getEffectTheme, maxBufferDimension, maxProtectedRects } from './config'
import { createDragonBall } from './dragon-ball'
import { createEnergyParticles } from './particles'
import { createOrbitalEnergy } from './orbits'

interface ProtectedRect { left: number; top: number; right: number; bottom: number }

const protectedSelectors = '.site-header, .saga-index, .about, .site-footer, [data-protect-region], h1, .hero__description, .hero__action-copy p, .explore-link, .saga-section__title-group, .saga-section__description'

export function createEnergyScene(host: HTMLElement, desktop: boolean) {
  const slot = document.querySelector<HTMLElement>('.hero__sphere-slot')
  if (!slot) throw new Error('Missing decorative orb slot')
  const canvas = document.createElement('canvas')
  canvas.className = 'energy-effects__canvas'
  canvas.setAttribute('aria-hidden', 'true')
  const pointerEnabled = desktop && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const context = canvas.getContext('webgl2', { alpha: true, antialias: pointerEnabled, powerPreference: 'low-power' })
  if (!context || context.isContextLost()) throw new Error('WebGL2 unavailable')

  const releases: (() => void)[] = []
  let disposed = false
  function cleanup(loseContext = true) {
    if (disposed) return
    disposed = true
    // Also rolls back a partially initialized renderer. One failed release
    // must not strand the remaining listeners, resources or visible fallback.
    releases.reverse().forEach((release) => { try { release() } catch { /* Continue releasing. */ } })
    releases.length = 0
    slot!.removeAttribute('data-orb-rendered')
    canvas.remove()
    if (loseContext) {
      try { context?.getExtension('WEBGL_lose_context')?.loseContext() } catch { /* Context may already be lost. */ }
    }
  }

  try {

    const quality = pointerEnabled ? effectQuality.desktop : effectQuality.compact
    const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: pointerEnabled })
    releases.push(() => renderer.dispose())
    renderer.debug.onShaderError = () => { throw new Error('Energy shader unavailable') }
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = SRGBColorSpace
    const scene = new Scene()
    releases.push(() => scene.clear())
    // Orthographic projection keeps the peripheral orb circular and stars frontal.
    const camera = new OrthographicCamera(-1, 1, 1, -1, 1, 2000)
    camera.position.z = 1000
    const field = createEnergyParticles(quality.particles)
    releases.push(field.dispose)
    const ball = createDragonBall()
    releases.push(ball.dispose)
    const orbits = createOrbitalEnergy()
    releases.push(orbits.dispose)
    ball.group.add(orbits.group)
    scene.add(field.points, ball.group)

    let layoutDirty = true
    let width = 1
    let height = 1
    let dpr = 1
    let lastFrame = 0
    let lastClock = 0
    let elapsed = 0
    let lastScroll = Number.NaN
    let slotRect: ProtectedRect = { left: 0, top: 0, right: 0, bottom: 0 }
    let protectedRects: ProtectedRect[] = []
    let pointerX = 0
    let pointerY = 0
    let easedX = 0
    let easedY = 0
    const themeColors = new Map<string, { primary: Color; secondary: Color }>()
    releases.push(() => themeColors.clear())

    function refreshLayout() {
      width = Math.max(1, host.clientWidth)
      height = Math.max(1, host.clientHeight)
      dpr = Math.min(window.devicePixelRatio || 1, quality.maxDpr, maxBufferDimension / width, maxBufferDimension / height)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      camera.left = -width / 2
      camera.right = width / 2
      camera.top = height / 2
      camera.bottom = -height / 2
      camera.updateProjectionMatrix()
      const scrollY = window.scrollY
      const rect = slot!.getBoundingClientRect()
      slotRect = { left: rect.left, right: rect.right, top: rect.top + scrollY, bottom: rect.bottom + scrollY }
      protectedRects = Array.from(document.querySelectorAll<HTMLElement>(protectedSelectors)).map((element) => {
        const bounds = element.getBoundingClientRect()
        if (element.dataset.protectRegion && element instanceof HTMLImageElement) {
          const [x, y, regionWidth, regionHeight] = element.dataset.protectRegion.split(',').map(Number)
          // Account for right-aligned object-fit cover on compact screens.
          const imageRatio = element.naturalWidth / element.naturalHeight || element.width / element.height
          const renderedWidth = Math.max(bounds.width, bounds.height * imageRatio)
          const renderedHeight = renderedWidth / imageRatio
          const imageLeft = bounds.right - renderedWidth
          const imageTop = bounds.top + (bounds.height - renderedHeight) / 2
          return {
            left: Math.max(bounds.left, imageLeft + renderedWidth * x) - 12,
            right: Math.min(bounds.right, imageLeft + renderedWidth * (x + regionWidth)) + 12,
            top: Math.max(bounds.top, imageTop + renderedHeight * y) + scrollY - 44,
            bottom: Math.min(bounds.bottom, imageTop + renderedHeight * (y + regionHeight)) + scrollY + 44,
          }
        }
        // Include the full HTML entrance and art parallax range in the mask.
        const padding = element.matches('[data-reveal], h1, .saga-section__title-group') ? 44 : 12
        return { left: bounds.left - padding, right: bounds.right + padding, top: bounds.top + scrollY - padding, bottom: bounds.bottom + scrollY + padding }
      })
      field.uniforms.uViewport.value.set(width, height)
      field.uniforms.uDpr.value = dpr
      field.uniforms.uCameraZ.value = camera.position.z
      field.uniforms.uEdgeWidth.value = Math.min(quality.edgeWidth, width * 0.15)
      ball.group.scale.setScalar(Math.min(rect.width, rect.height) * 0.4)
      host.dataset.effectDpr = String(dpr)
      host.dataset.effectParticles = String(quality.particles)
      layoutDirty = false
      lastScroll = Number.NaN
    }

    function updateMasks(scrollY: number) {
      let count = 0
      protectedRects.forEach((rect) => {
        const top = rect.top - scrollY
        const bottom = rect.bottom - scrollY
        if (bottom < 0 || top > height || count >= maxProtectedRects) return
        field.uniforms.uRects.value[count++].set(rect.left, top, rect.right, bottom)
      })
      field.uniforms.uRectCount.value = count
      const top = slotRect.top - scrollY
      ball.group.visible = top < height && slotRect.bottom - scrollY > 0
      ball.group.position.set((slotRect.left + slotRect.right) / 2 - width / 2, height / 2 - (top + (slotRect.bottom - slotRect.top) / 2), 0)
    }

    function render(time: number) {
      if (disposed || document.hidden) return
      if (lastFrame && time - lastFrame < quality.renderInterval) return
      const delta = lastClock ? Math.min((time - lastClock) / 1000, 0.1) : 0
      lastClock = time
      lastFrame = time - ((time - lastFrame) % quality.renderInterval)
      elapsed += delta
      try {
        if (layoutDirty) refreshLayout()
        const view = getSceneView()
        const scrollY = window.scrollY
        if (scrollY !== lastScroll) { updateMasks(scrollY); lastScroll = scrollY }
        const theme = getEffectTheme(view.id)
        const themeId = view.id ?? 'none'
        if (!themeColors.has(themeId)) themeColors.set(themeId, { primary: new Color(theme.primary), secondary: new Color(theme.secondary) })
        const colors = themeColors.get(themeId)!
        const blend = 1 - Math.exp(-delta * 3.2)
        field.uniforms.uPrimary.value.lerp(colors.primary, blend)
        field.uniforms.uSecondary.value.lerp(colors.secondary, blend)
        field.uniforms.uIntensity.value += ((view.id ? theme.intensity : 0) - field.uniforms.uIntensity.value) * blend
        field.uniforms.uSpread.value += (theme.spread - field.uniforms.uSpread.value) * blend
        field.uniforms.uTime.value = elapsed
        easedX += (pointerX - easedX) * blend
        easedY += (pointerY - easedY) * blend
        ball.update(elapsed, pointerEnabled ? easedX : 0, pointerEnabled ? easedY : 0, true)
        orbits.update(elapsed)
        renderer.render(scene, camera)
        if (disposed) return
        slot!.dataset.orbRendered = 'true'
        if (host.dataset.effectSaga !== themeId) host.dataset.effectSaga = themeId
      } catch {
        cleanup()
        host.dataset.effectStatus = 'fallback'
      }
    }

    function onResize() { layoutDirty = true }
    function onPointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      pointerX = event.clientX / width * 2 - 1
      pointerY = 1 - event.clientY / height * 2
    }
    function onPointerOut(event: PointerEvent) { if (!event.relatedTarget) { pointerX = 0; pointerY = 0 } }
    function onContextLost(event: Event) {
      event.preventDefault()
      cleanup(false)
      host.dataset.effectStatus = 'fallback'
    }
    function onVisibility() {
      lastFrame = 0
      lastClock = 0
      renderer.setAnimationLoop(document.hidden ? null : render)
      host.dataset.effectStatus = document.hidden ? 'paused' : 'ready'
      if (!document.hidden) layoutDirty = true
    }
    const observer = new ResizeObserver(onResize)
    releases.push(() => observer.disconnect())
    observer.observe(document.querySelector('main')!)
    observer.observe(slot)
    observer.observe(host)
    canvas.addEventListener('webglcontextlost', onContextLost, true)
    releases.push(() => canvas.removeEventListener('webglcontextlost', onContextLost, true))
    window.addEventListener('resize', onResize, { passive: true })
    releases.push(() => window.removeEventListener('resize', onResize))
    document.addEventListener('visibilitychange', onVisibility)
    releases.push(() => document.removeEventListener('visibilitychange', onVisibility))
    if (pointerEnabled) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      releases.push(() => window.removeEventListener('pointermove', onPointer))
      window.addEventListener('pointerout', onPointerOut, { passive: true })
      releases.push(() => window.removeEventListener('pointerout', onPointerOut))
    }
    releases.push(() => renderer.setAnimationLoop(null))
    host.append(canvas)
    host.dataset.effectStatus = document.hidden ? 'paused' : 'ready'
    if (!document.hidden) { render(performance.now()); if (!disposed) renderer.setAnimationLoop(render) }
    return cleanup
  } catch (error) {
    cleanup()
    throw error
  }
}
