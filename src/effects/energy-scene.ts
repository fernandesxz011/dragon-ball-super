import { Color, OrthographicCamera, Scene, SRGBColorSpace, WebGLRenderer } from 'three'
import { getSceneView } from '../motion/scene-progress'
import { artDepth, energyField, effectQuality, getEffectTheme, maxBufferDimension, maxProtectedRects, orbInteraction } from './config'
import { createDragonBall } from './dragon-ball'
import { createEnergyParticles } from './particles'
import { createOrbitalEnergy } from './orbits'
import { createEnergyRibbons } from './energy-ribbons'
import { createArtDepth } from './art-depth'
import { createCharacterAura } from './character-aura'

interface ProtectedRect { left: number; top: number; right: number; bottom: number; image?: boolean }

const protectedSelectors = '.site-header, .saga-index, .about, .site-footer, [data-protect-region], h1, .hero__description, .hero__action-copy p, .explore-link, .saga-section__title-group, .saga-section__description'

function imageLayoutBounds(image: HTMLImageElement) {
  const bounds = image.getBoundingClientRect()
  const imageTransform = window.getComputedStyle(image).transform
  const imageMatrix = imageTransform === 'none' ? undefined : new DOMMatrixReadOnly(imageTransform)
  const width = bounds.width / (imageMatrix ? Math.max(0.01, Math.hypot(imageMatrix.a, imageMatrix.b)) : 1)
  const height = bounds.height / (imageMatrix ? Math.max(0.01, Math.hypot(imageMatrix.c, imageMatrix.d)) : 1)
  const picture = image.closest('picture')
  const pictureTransform = picture ? window.getComputedStyle(picture).transform : 'none'
  const pictureMatrix = pictureTransform === 'none' ? undefined : new DOMMatrixReadOnly(pictureTransform)
  // Cache the resting layout, not one arbitrary point of the scroll/reveal.
  return new DOMRect(
    bounds.left + (bounds.width - width) / 2 - (pictureMatrix?.m41 ?? 0),
    bounds.top + (bounds.height - height) / 2 - (pictureMatrix?.m42 ?? 0),
    width, height,
  )
}

function imagePlacement(image: HTMLImageElement, bounds: DOMRect) {
  const style = window.getComputedStyle(image)
  // Source dimensions stay stable before decode and avoid the integer rounding
  // of naturalWidth/naturalHeight on width-descriptor srcsets.
  const imageRatio = Number(image.getAttribute('width')) / Number(image.getAttribute('height'))
    || image.naturalWidth / image.naturalHeight
    || bounds.width / Math.max(1, bounds.height)
  if (style.objectFit !== 'cover' && style.objectFit !== 'contain') {
    return { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height }
  }
  const width = style.objectFit === 'cover'
    ? Math.max(bounds.width, bounds.height * imageRatio)
    : Math.min(bounds.width, bounds.height * imageRatio)
  const height = width / imageRatio
  const [horizontal = '50%', vertical = '50%'] = style.objectPosition.split(/\s+/)
  function alignment(value: string) {
    if (value === 'right' || value === 'bottom') return 1
    if (value === 'left' || value === 'top') return 0
    return value.endsWith('%') ? Number.parseFloat(value) / 100 : 0.5
  }
  return {
    left: bounds.left + (bounds.width - width) * alignment(horizontal),
    top: bounds.top + (bounds.height - height) * alignment(vertical),
    width, height,
  }
}

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
    host.removeAttribute('data-effect-aura')
    host.removeAttribute('data-effect-aura-textures')
    host.removeAttribute('data-effect-depth')
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
    const field = createEnergyParticles(quality)
    releases.push(field.dispose)
    field.points.name = 'foreground-energy-particles'
    const ribbons = createEnergyRibbons(field.uniforms, quality)
    releases.push(ribbons.dispose)
    const aura = createCharacterAura(field.uniforms, quality)
    releases.push(aura.dispose)
    const depth = createArtDepth(desktop)
    releases.push(depth.dispose)
    const ball = createDragonBall()
    releases.push(ball.dispose)
    const orbits = createOrbitalEnergy()
    releases.push(orbits.dispose)
    ball.group.add(orbits.group)
    scene.add(aura.mesh, ribbons.mesh, field.points, ball.group)

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
    const artworkRects = new Map<string, ProtectedRect>()
    releases.push(() => artworkRects.clear())
    const fullArtworkRects = new Map<string, ProtectedRect>()
    releases.push(() => fullArtworkRects.clear())
    const artworkClips = new Map<string, ProtectedRect>()
    releases.push(() => artworkClips.clear())
    let mouseX: number | undefined
    let mouseY: number | undefined
    let easedX = 0
    let easedY = 0
    const themeColors = new Map<string, { primary: Color; secondary: Color }>()
    releases.push(() => themeColors.clear())

    function refreshLayout() {
      depth.measure(readLayout)
    }

    function readLayout() {
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
      protectedRects = Array.from(document.querySelectorAll<HTMLElement>(protectedSelectors)).flatMap<ProtectedRect>((element) => {
        const bounds = element instanceof HTMLImageElement
          ? imageLayoutBounds(element) : element.getBoundingClientRect()
        if (element.dataset.protectRegion && element instanceof HTMLImageElement) {
          const placement = imagePlacement(element, bounds)
          const horizontalPadding = energyField.maskPadding + bounds.width * energyField.artScaleAllowance
          const verticalPadding = energyField.motionPadding + bounds.height * energyField.artScaleAllowance
          return element.dataset.protectRegion.split(';').map((region) => {
            const values = region.split(',').map(Number)
            // Invalid author data conservatively protects the complete image.
            const [x, y, regionWidth, regionHeight] = values.length === 4
              && values.every(Number.isFinite) && values[2] > 0 && values[3] > 0
              ? values : [0, 0, 1, 1]
            return {
              image: true,
              left: Math.max(bounds.left, placement.left + placement.width * x) - horizontalPadding,
              right: Math.min(bounds.right, placement.left + placement.width * (x + regionWidth)) + horizontalPadding,
              top: Math.max(bounds.top, placement.top + placement.height * y) + scrollY - verticalPadding,
              bottom: Math.min(bounds.bottom, placement.top + placement.height * (y + regionHeight)) + scrollY + verticalPadding,
            }
          })
        }
        // Include the full HTML entrance and art parallax range in the mask.
        const padding = element.matches('[data-reveal], h1, .saga-section__title-group') ? energyField.motionPadding : energyField.maskPadding
        return [{ left: bounds.left - padding, right: bounds.right + padding, top: bounds.top + scrollY - padding, bottom: bounds.bottom + scrollY + padding }]
      })
      artworkRects.clear()
      fullArtworkRects.clear()
      artworkClips.clear()
      document.querySelectorAll<HTMLElement>('[data-scene]').forEach((element) => {
        const image = element.querySelector<HTMLImageElement>('img[data-protect-region]')
        if (!image || !element.dataset.scene) return
        const bounds = imageLayoutBounds(image)
        const placement = imagePlacement(image, bounds)
        fullArtworkRects.set(element.dataset.scene, {
          left: placement.left, right: placement.left + placement.width,
          top: placement.top + scrollY, bottom: placement.top + placement.height + scrollY,
        })
        const clip = image.closest<HTMLElement>('.hero__media, .saga-section__art')?.getBoundingClientRect() ?? bounds
        artworkClips.set(element.dataset.scene, {
          left: clip.left, right: clip.right, top: clip.top + scrollY, bottom: clip.bottom + scrollY,
        })
        artworkRects.set(element.dataset.scene, {
          left: Math.max(bounds.left, placement.left),
          right: Math.min(bounds.right, placement.left + placement.width),
          top: Math.max(bounds.top, placement.top) + scrollY,
          bottom: Math.min(bounds.bottom, placement.top + placement.height) + scrollY,
        })
      })
      field.uniforms.uViewport.value.set(width, height)
      field.uniforms.uDpr.value = dpr
      field.uniforms.uCameraZ.value = camera.position.z
      ball.group.scale.setScalar(Math.min(rect.width, rect.height) * 0.4)
      host.dataset.effectDpr = String(dpr)
      host.dataset.effectParticles = String(quality.particles)
      layoutDirty = false
      lastScroll = Number.NaN
    }

    function updateMasks(scrollY: number) {
      let count = 0
      let auraCount = 0
      protectedRects.forEach((rect) => {
        const top = rect.top - scrollY
        const bottom = rect.bottom - scrollY
        if (bottom < 0 || top > height) return
        if (count < maxProtectedRects) field.uniforms.uRects.value[count++].set(rect.left, top, rect.right, bottom)
        if (!rect.image && auraCount < maxProtectedRects) aura.uniforms.uRects.value[auraCount++].set(rect.left, top, rect.right, bottom)
      })
      field.uniforms.uRectCount.value = count
      aura.uniforms.uRectCount.value = auraCount
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
        const artwork = view.id ? artworkRects.get(view.id) : undefined
        ribbons.mesh.visible = !!artwork && artwork.bottom > scrollY && artwork.top < scrollY + height
        if (artwork) ribbons.uniforms.uArtwork.value.set(artwork.left, artwork.top - scrollY, artwork.right, artwork.bottom - scrollY)

        const enteredAt = view.artEnteredAt
        const settled = enteredAt === 0 || (enteredAt !== undefined && time - enteredAt >= artDepth.artSettleMs)
        depth.update({
          activeId: view.id, settled, time: elapsed, delta, progress: view.progress,
          scrollY, viewportHeight: height,
          mouseX: pointerEnabled ? mouseX : undefined, mouseY: pointerEnabled ? mouseY : undefined,
        })
        const surface = view.id ? depth.get(view.id) : undefined
        const auraImage = view.id ? fullArtworkRects.get(view.id) : undefined
        const auraClip = view.id ? artworkClips.get(view.id) : undefined
        const auraVisible = !!(settled && view.id && surface && auraImage && auraClip && artwork
          && artwork.bottom > scrollY && artwork.top < scrollY + height)
        aura.mesh.visible = auraVisible && aura.select(view.id!)
        if (aura.mesh.visible && surface && auraImage && auraClip) {
          const parallax = desktop && view.id !== 'intro' ? artDepth.parallaxDistance * (1 - 2 * view.progress) : 0
          aura.uniforms.uImage.value.set(auraImage.left, auraImage.top - scrollY + parallax, auraImage.right, auraImage.bottom - scrollY + parallax)
          aura.uniforms.uFrame.value.set(auraClip.left, auraClip.top - scrollY, auraClip.right, auraClip.bottom - scrollY)
          aura.uniforms.uSurfaceCenter.value.set(surface.left + surface.width / 2, surface.top - scrollY + surface.height / 2)
          aura.uniforms.uArtMatrix.value.copy(surface.matrix)
          aura.uniforms.uAuraOpacity.value = enteredAt === 0 ? 1 : Math.min(1, Math.max(0, (time - enteredAt! - artDepth.artSettleMs) / artDepth.auraFadeMs))
        }
        const auraStatus = aura.mesh.visible ? view.id! : auraVisible ? 'fallback' : 'hidden'
        if (host.dataset.effectAura !== auraStatus) host.dataset.effectAura = auraStatus
        const textureCount = String(aura.textureCount)
        if (host.dataset.effectAuraTextures !== textureCount) host.dataset.effectAuraTextures = textureCount
        const depthMode = desktop ? 'full' : 'identity'
        if (host.dataset.effectDepth !== depthMode) host.dataset.effectDepth = depthMode

        let targetX = 0
        let targetY = 0
        if (pointerEnabled && mouseX !== undefined && mouseY !== undefined && ball.group.visible) {
          const slotWidth = slotRect.right - slotRect.left
          const slotHeight = slotRect.bottom - slotRect.top
          const dx = mouseX - (slotRect.left + slotRect.right) / 2
          const dy = mouseY - ((slotRect.top + slotRect.bottom) / 2 - scrollY)
          const radius = Math.max(orbInteraction.proximityMinRadius, slotWidth * orbInteraction.proximityRadiusScale)
          const nearRadius = slotWidth * orbInteraction.proximityInnerScale
          const proximity = Math.max(0, Math.min(1, (radius - Math.hypot(dx, dy)) / Math.max(1, radius - nearRadius)))
          targetX = Math.max(-1, Math.min(1, dx / Math.max(1, slotWidth * orbInteraction.normalizationScale))) * proximity
          targetY = Math.max(-1, Math.min(1, -dy / Math.max(1, slotHeight * orbInteraction.normalizationScale))) * proximity
        }
        const pointerBlend = 1 - Math.exp(-delta * orbInteraction.easing)
        easedX += (targetX - easedX) * pointerBlend
        easedY += (targetY - easedY) * pointerBlend
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
      mouseX = event.clientX
      mouseY = event.clientY
    }
    function onPointerOut(event: PointerEvent) { if (!event.relatedTarget) { mouseX = undefined; mouseY = undefined } }
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
