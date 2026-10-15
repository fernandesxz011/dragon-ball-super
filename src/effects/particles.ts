import { BufferGeometry, Float32BufferAttribute, Color, Points, ShaderMaterial, Vector2, Vector4 } from 'three'
import { maxProtectedRects } from './config'

export function createEnergyParticles(count: number) {
  let seed = 4917
  function random() {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const seeds = new Float32Array(count)
  for (let index = 0; index < count; index += 1) {
    const ground = index % 3 === 0
    positions[index * 3] = ground ? random() - 0.5 : (index % 2 ? -1 : 1) * (0.34 + random() * 0.16)
    positions[index * 3 + 1] = ground ? -0.5 + random() * 0.18 : random() - 0.5
    positions[index * 3 + 2] = (random() - 0.5) * 110
    sizes[index] = 3 + random() * 4.2
    seeds[index] = random()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new Float32BufferAttribute(sizes, 1))
  geometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1))
  const uniforms = {
    uTime: { value: 0 }, uDpr: { value: 1 }, uCameraZ: { value: 700 },
    uViewport: { value: new Vector2(1, 1) }, uEdgeWidth: { value: 44 },
    uPrimary: { value: new Color('#69adff') }, uSecondary: { value: new Color('#af80f3') },
    uIntensity: { value: 0.56 }, uSpread: { value: 0.3 },
    uRectCount: { value: 0 },
    uRects: { value: Array.from({ length: maxProtectedRects }, () => new Vector4()) },
  }
  const material = new ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, depthTest: false,
    vertexShader: `
      attribute float aSize;
      attribute float aSeed;
      uniform float uTime, uDpr, uCameraZ, uSpread;
      uniform vec2 uViewport;
      varying float vSeed;
      void main() {
        vec3 p = position;
        p.x = p.x * uViewport.x + sin(uTime * 0.22 + aSeed * 18.0) * 4.0;
        p.x += sign(p.x) * uSpread * 6.0;
        p.y = (fract(p.y + 0.5 + uTime * (0.016 + aSeed * 0.01)) - 0.5) * uViewport.y;
        p.xy *= uCameraZ / (uCameraZ - p.z);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = min(16.0, aSize * uDpr * uCameraZ / max(120.0, -mvPosition.z));
        vSeed = aSeed;
      }`,
    fragmentShader: `
      uniform float uDpr, uIntensity, uEdgeWidth;
      uniform vec2 uViewport;
      uniform vec3 uPrimary, uSecondary;
      uniform int uRectCount;
      uniform vec4 uRects[${maxProtectedRects}];
      varying float vSeed;
      void main() {
        vec2 screen = vec2(gl_FragCoord.x / uDpr, uViewport.y - gl_FragCoord.y / uDpr);
        // Clip the center and every protected rectangle at the pixel level.
        if (screen.x > uEdgeWidth && screen.x < uViewport.x - uEdgeWidth && screen.y < uViewport.y * 0.78) discard;
        for (int i = 0; i < ${maxProtectedRects}; i++) {
          if (i >= uRectCount) break;
          vec4 r = uRects[i];
          if (screen.x >= r.x && screen.x <= r.z && screen.y >= r.y && screen.y <= r.w) discard;
        }
        float radius = length(gl_PointCoord - 0.5) * 2.0;
        if (radius >= 1.0) discard;
        float glow = exp(-radius * radius * 4.8) * (1.0 - smoothstep(0.65, 1.0, radius));
        vec3 color = mix(uPrimary, uSecondary, step(0.82, vSeed));
        gl_FragColor = vec4(color, glow * uIntensity * (0.55 + vSeed * 0.4));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const points = new Points(geometry, material)
  points.frustumCulled = false
  return { points, uniforms, dispose() { points.removeFromParent(); geometry.dispose(); material.dispose() } }
}
