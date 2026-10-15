import { inView, scroll } from 'motion'
import { animate } from 'motion/mini'
import { registerSceneProgress } from './scene-progress'

type Playback = ReturnType<typeof animate>

function runCleanup(action: () => void) {
  try {
    action()
  } catch {
    // A detached or unsupported native timeline can reject finishing/committing.
    // Continue cancelling the other controls and restoring the visible HTML.
  }
}

export function enhanceScene(scene: HTMLElement, kind: 'intro' | 'saga', parallax: boolean) {
  const revealElements = Array.from(scene.querySelectorAll<HTMLElement>('[data-reveal]'))
  const revealControls: Playback[] = []
  const scrollControls: Playback[] = []
  const stopScroll: (() => void)[] = []
  const progress = registerSceneProgress(scene.dataset.scene ?? kind)
  let stopInView: (() => void) | undefined
  let stopArtInView: (() => void) | undefined
  let disposed = false
  const artImage = scene.querySelector<HTMLImageElement>('.saga-section__art img')

  function restoreReveals() {
    revealElements.forEach((element) => {
      element.style.removeProperty('opacity')
      element.style.removeProperty('transform')
    })
    artImage?.style.removeProperty('opacity')
    artImage?.style.removeProperty('transform')
  }

  function finishReveals() {
    scene.dataset.revealed = 'true'
    scene.dataset.artRevealed = 'true'
    try {
      if (stopInView) runCleanup(stopInView)
      if (stopArtInView) runCleanup(stopArtInView)
      revealControls.forEach((control) => {
        runCleanup(() => control.complete())
        runCleanup(() => control.cancel())
      })
    } finally {
      restoreReveals()
    }
  }

  function revealArt() {
    if (disposed || !artImage || scene.dataset.artRevealed === 'true') return
    scene.dataset.artRevealed = 'true'
    try {
      revealControls.push(animate(artImage, {
        opacity: [0.8, 1],
        transform: ['scale(1.025)', 'scale(1)'],
      }, { duration: 0.95, ease: [0.22, 1, 0.36, 1] }))
    } catch {
      artImage.style.removeProperty('opacity')
      artImage.style.removeProperty('transform')
    }
  }

  function reveal() {
    if (disposed || scene.dataset.revealed === 'true') return
    scene.dataset.revealed = 'true'

    try {
      revealElements.forEach((element, index) => {
        const interactive = element.matches('a, button')
        revealControls.push(animate(element, {
          opacity: [interactive ? 0.85 : 0.72, 1],
          transform: [`translateY(${interactive ? 12 : 32}px)`, 'translateY(0px)'],
        }, {
          duration: 0.72,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }))
      })
    } catch {
      finishReveals()
    }
  }

  function onFocus() {
    finishReveals()
  }

  const art = scene.querySelector<HTMLElement>('.saga-section__art picture')
  const edge = scene.querySelector<HTMLElement>('.saga-section__edge')

  function cleanup() {
    disposed = true
    try {
      if (stopInView) runCleanup(stopInView)
      if (stopArtInView) runCleanup(stopArtInView)
      scene.removeEventListener('focusin', onFocus)
      stopScroll.forEach(runCleanup)
      progress.dispose()
      revealControls.forEach((control) => {
        runCleanup(() => control.complete())
        runCleanup(() => control.cancel())
      })
      scrollControls.forEach((control) => runCleanup(() => control.cancel()))
    } finally {
      restoreReveals()
      art?.style.removeProperty('transform')
      edge?.style.removeProperty('opacity')
    }
  }

  try {
    scene.addEventListener('focusin', onFocus)
    if (scene.contains(document.activeElement)) finishReveals()

    if (scene.dataset.revealed !== 'true') {
      const trigger = kind === 'intro'
        ? scene.querySelector<HTMLElement>('.hero__caption') ?? scene
        : scene.querySelector<HTMLElement>('.saga-section__heading') ?? scene
      // Returning no exit callback makes Motion disconnect after the first entry.
      stopInView = inView(trigger, reveal, { amount: 0.35 })
    }
    if (artImage && scene.dataset.artRevealed !== 'true') {
      // Mobile art precedes the heading: reveal it on its own first appearance.
      stopArtInView = inView(artImage, revealArt, { amount: 0.08 })
    }

    const scrollOptions: NonNullable<Parameters<typeof scroll>[1]> = {
      target: scene,
      offset: ['start end', 'end start'],
    }
    stopScroll.push(scroll((value, info) => progress.update(value, info.y), scrollOptions))

    if (parallax && kind === 'saga') {
      if (art) {
        const movement = animate(art, {
          // Move the complete flat illustration; faces are never separate layers.
          transform: ['translateY(36px)', 'translateY(-36px)'],
        }, { duration: 1, ease: 'linear', autoplay: false })
        scrollControls.push(movement)
        stopScroll.push(scroll(movement, scrollOptions))
      }
      if (edge) {
        const lighting = animate(edge, { opacity: [0.55, 0.8, 0.65] }, {
          duration: 1, ease: 'linear', autoplay: false,
        })
        scrollControls.push(lighting)
        stopScroll.push(scroll(lighting, scrollOptions))
      }
    }
  } catch (error) {
    cleanup()
    throw error
  }

  return cleanup
}
