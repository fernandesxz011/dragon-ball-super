export const effectThemes = {
  intro: { primary: '#69adff', secondary: '#af80f3', intensity: 0.82, spread: 0.3 },
  moro: { primary: '#7abaff', secondary: '#72e3ed', intensity: 0.85, spread: 0.2 },
  granolah: { primary: '#edb36f', secondary: '#87c29b', intensity: 0.76, spread: 0.6 },
  'super-hero': { primary: '#b29aef', secondary: '#efd18f', intensity: 0.82, spread: 0.4 },
  'black-freeza': { primary: '#9771d1', secondary: '#e2dced', intensity: 0.68, spread: 0.8 },
} as const

export const effectQuality = {
  desktop: {
    particles: 200, maxDpr: 1.5, renderInterval: 1000 / 45,
    particleMinSize: 6, particleMaxSize: 18,
    ribbonCoreWidth: 1.65, ribbonGlowWidth: 12, ribbonStrength: 1.15,
    auraTextureSize: 1024, auraWideBlur: 18, auraRimBlur: 2.2, auraStrength: 1.1,
  },
  compact: {
    particles: 64, maxDpr: 1, renderInterval: 1000 / 30,
    particleMinSize: 4, particleMaxSize: 10,
    ribbonCoreWidth: 1.35, ribbonGlowWidth: 9, ribbonStrength: 1,
    auraTextureSize: 640, auraWideBlur: 14, auraRimBlur: 2, auraStrength: 1,
  },
} as const

export type EffectQuality = (typeof effectQuality)[keyof typeof effectQuality]

export const energyField = {
  streakRatio: 0.2,
  streakLength: 2.3,
  maxSpritePixels: 64,
  depthRange: 360,
  maskFeather: 12,
  maskPadding: 12,
  motionPadding: 44,
  artScaleAllowance: 0.013,
  ribbonStart: 0.5,
} as const

export const orbInteraction = {
  proximityRadiusScale: 1.6,
  proximityInnerScale: 0.75,
  proximityMinRadius: 150,
  normalizationScale: 0.55,
  pointerTilt: 0.27,
  maxTilt: 0.3,
  floatAmplitude: 0.045,
  easing: 6,
} as const

export const artDepth = {
  maxTilt: Math.PI / 150,
  scale: 1.012,
  minPerspective: 1100,
  perspectiveWidth: 1.2,
  easing: 4,
  artSettleMs: 1000,
  auraFadeMs: 350,
  parallaxDistance: 36,
} as const

export const auraDissolve: Record<string, readonly [number, number]> = {
  intro: [0.59, 0.76],
  'black-freeza': [0.78, 0.96],
}

export const maxProtectedRects = 24
export const maxBufferDimension = 4096

export function getEffectTheme(id: string | undefined) {
  return effectThemes[id as keyof typeof effectThemes] ?? effectThemes.intro
}
