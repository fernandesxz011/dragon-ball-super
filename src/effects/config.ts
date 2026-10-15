export const effectThemes = {
  intro: { primary: '#69adff', secondary: '#af80f3', intensity: 0.82, spread: 0.3 },
  moro: { primary: '#7abaff', secondary: '#72e3ed', intensity: 0.85, spread: 0.2 },
  granolah: { primary: '#edb36f', secondary: '#87c29b', intensity: 0.76, spread: 0.6 },
  'super-hero': { primary: '#b29aef', secondary: '#efd18f', intensity: 0.82, spread: 0.4 },
  'black-freeza': { primary: '#9771d1', secondary: '#e2dced', intensity: 0.68, spread: 0.8 },
} as const

export const effectQuality = {
  desktop: { particles: 200, maxDpr: 1.5, renderInterval: 1000 / 45, edgeWidth: 180 },
  compact: { particles: 64, maxDpr: 1, renderInterval: 1000 / 30, edgeWidth: 40 },
} as const

export const maxProtectedRects = 24
export const maxBufferDimension = 4096

export function getEffectTheme(id: string | undefined) {
  return effectThemes[id as keyof typeof effectThemes] ?? effectThemes.intro
}
