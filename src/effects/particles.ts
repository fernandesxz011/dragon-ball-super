import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Color, Points, ShaderMaterial, Vector2, Vector4 } from 'three'
import { energyField, effectThemes, maxProtectedRects, type EffectQuality } from './config'

// The interior stays fully protected; the fade begins outside its padded edge.
export const energyMaskShader = `
  float contentVisibility(vec2 screen) {
    float visibility = 1.0;
    for (int i = 0; i < ${maxProtectedRects}; i++) {
      if (i >= uRectCount) break;
      vec4 bounds = uRects[i];
      vec2 outside = max(max(bounds.xy - screen, screen - bounds.zw), vec2(0.0));
      visibility = min(visibility, smoothstep(0.0, uMaskFeather, length(outside)));
      if (visibility <= 0.001) return 0.0;
    }
    return visibility;
  }
`

export function createEnergyParticles(quality: EffectQuality) {
  const count = quality.particles
  let seed = 4917
  function random() {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const seeds = new Float32Array(count)
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = random() - 0.5
    positions[index * 3 + 1] = random() - 0.5
    positions[index * 3 + 2] = (random() - 0.5) * energyField.depthRange
    sizes[index] = quality.particleMinSize + random() * (quality.particleMaxSize - quality.particleMinSize)
    seeds[index] = random()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new Float32BufferAttribute(sizes, 1))
  geometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1))
  const uniforms = {
    uTime: { value: 0 }, uDpr: { value: 1 }, uCameraZ: { value: 700 },
    uViewport: { value: new Vector2(1, 1) },
    uPrimary: { value: new Color('#69adff') }, uSecondary: { value: new Color('#af80f3') },
    uIntensity: { value: effectThemes.intro.intensity }, uSpread: { value: 0.3 },
    uMaskFeather: { value: energyField.maskFeather },
    uRectCount: { value: 0 },
    uRects: { value: Array.from({ length: maxProtectedRects }, () => new Vector4()) },
  }
  const material = new ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, depthTest: false,
    blending: AdditiveBlending, toneMapped: false,
    vertexShader: `
      attribute float aSize;
      attribute float aSeed;
      uniform float uTime, uDpr, uCameraZ, uSpread;
      uniform vec2 uViewport;
      varying float vSeed;
      varying float vStreak;
      void main() {
        vec3 p = position;
        p.x = p.x * uViewport.x + sin(uTime * 0.24 + aSeed * 18.0) * 13.0;
        p.x += sign(p.x) * uSpread * 6.0;
        p.y = (fract(p.y + 0.5 + uTime * (0.022 + aSeed * 0.018)) - 0.5) * uViewport.y;
        p.xy *= uCameraZ / (uCameraZ - p.z);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vStreak = step(${1 - energyField.streakRatio}, aSeed);
        float lengthScale = mix(1.0, ${energyField.streakLength}, vStreak);
        gl_PointSize = min(${energyField.maxSpritePixels}.0, aSize * lengthScale * uDpr * uCameraZ / max(120.0, -mvPosition.z));
        vSeed = aSeed;
      }`,
    fragmentShader: `
      uniform float uDpr, uIntensity, uMaskFeather;
      uniform vec2 uViewport;
      uniform vec3 uPrimary, uSecondary;
      uniform int uRectCount;
      uniform vec4 uRects[${maxProtectedRects}];
      varying float vSeed;
      varying float vStreak;
      ${energyMaskShader}
      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float angle = 0.38 + vSeed * 0.7;
        mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        point = rotation * point;
        point.y *= mix(1.0, 5.0, vStreak);
        float radius = length(point) * 2.0;
        if (radius >= 1.0) discard;
        vec2 screen = vec2(gl_FragCoord.x / uDpr, uViewport.y - gl_FragCoord.y / uDpr);
        float visibility = contentVisibility(screen);
        if (visibility <= 0.001) discard;
        float core = exp(-radius * radius * 15.0);
        float glow = exp(-radius * radius * 3.5) * (1.0 - smoothstep(0.65, 1.0, radius));
        vec3 color = mix(uPrimary, uSecondary, step(0.72, vSeed));
        color = mix(color, vec3(1.0, 0.95, 0.85), core * 0.7);
        gl_FragColor = vec4(color, glow * uIntensity * (0.8 + vSeed * 0.2) * visibility);
        #include <colorspace_fragment>
      }`,
  })
  const points = new Points(geometry, material)
  points.frustumCulled = false
  points.renderOrder = -1
  let disposed = false
  return {
    points, uniforms,
    dispose() {
      if (disposed) return
      disposed = true
      points.removeFromParent()
      geometry.dispose()
      material.dispose()
    },
  }
}

export type EnergyUniforms = ReturnType<typeof createEnergyParticles>['uniforms']
