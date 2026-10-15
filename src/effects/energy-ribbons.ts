import { AdditiveBlending, Mesh, PlaneGeometry, ShaderMaterial, Vector4 } from 'three'
import { energyField, maxProtectedRects, type EffectQuality } from './config'
import { energyMaskShader, type EnergyUniforms } from './particles'

export function createEnergyRibbons(shared: EnergyUniforms, quality: EffectQuality) {
  const geometry = new PlaneGeometry(2, 2)
  const uniforms = {
    ...shared,
    uArtwork: { value: new Vector4(0, 0, 1, 1) },
    uCoreWidth: { value: quality.ribbonCoreWidth },
    uGlowWidth: { value: quality.ribbonGlowWidth },
    uStrength: { value: quality.ribbonStrength },
  }
  const material = new ShaderMaterial({
    name: 'foreground-energy-ribbons',
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
    toneMapped: false,
    vertexShader: `
      uniform vec2 uViewport;
      uniform vec4 uArtwork;
      void main() {
        // Rasterize only the lower artwork envelope, not the entire viewport.
        vec2 pixel = vec2(mix(uArtwork.x, uArtwork.z, uv.x),
          mix(uArtwork.w, mix(uArtwork.y, uArtwork.w, ${energyField.ribbonStart}), uv.y));
        gl_Position = vec4(pixel.x / uViewport.x * 2.0 - 1.0,
          1.0 - pixel.y / uViewport.y * 2.0, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime, uDpr, uIntensity, uSpread, uMaskFeather;
      uniform float uCoreWidth, uGlowWidth, uStrength;
      uniform vec2 uViewport;
      uniform vec4 uArtwork;
      uniform vec3 uPrimary, uSecondary;
      uniform int uRectCount;
      uniform vec4 uRects[${maxProtectedRects}];
      ${energyMaskShader}
      void main() {
        vec2 screen = vec2(gl_FragCoord.x / uDpr, uViewport.y - gl_FragCoord.y / uDpr);
        vec2 size = max(uArtwork.zw - uArtwork.xy, vec2(1.0));
        vec2 p = (screen - uArtwork.xy) / size;
        if (p.y < ${energyField.ribbonStart} || p.y > 1.0 || p.x < 0.0 || p.x > 1.0) discard;

        float first = 0.75 + sin(p.x * 5.4 - uTime * 0.27 + uSpread) * 0.066;
        float second = 0.9 + sin(p.x * 4.2 + uTime * 0.22 + 1.1) * 0.048;
        float third = 0.63 + sin(p.x * 6.1 - uTime * 0.18 + 2.2) * 0.033;
        float firstDistance = abs(p.y - first) * size.y;
        float secondDistance = abs(p.y - second) * size.y;
        float thirdDistance = abs(p.y - third) * size.y;
        float distance = min(firstDistance, min(secondDistance, thirdDistance));
        if (distance > uGlowWidth * 2.4) discard;
        float visibility = contentVisibility(screen);
        if (visibility <= 0.001) discard;

        float core = exp(-pow(distance / uCoreWidth, 2.0));
        float glow = exp(-pow(distance / uGlowWidth, 2.0));
        float flow = 0.72 + 0.28 * pow(0.5 + 0.5 * sin(p.x * 7.0 - uTime * 0.7), 2.0);
        float ends = smoothstep(0.0, 0.055, p.x) * (1.0 - smoothstep(0.945, 1.0, p.x));
        ends *= 1.0 - smoothstep(0.965, 1.0, p.y);
        vec3 color = mix(uPrimary, uSecondary, step(secondDistance, firstDistance));
        color = mix(color, vec3(1.0, 0.95, 0.84), core * 0.72);
        float alpha = min(0.92, (core * 0.82 + glow * 0.3) * flow * uIntensity * uStrength);
        gl_FragColor = vec4(color, alpha * visibility * ends);
        #include <colorspace_fragment>
      }
    `,
  })
  const mesh = new Mesh(geometry, material)
  mesh.name = 'foreground-energy-ribbons'
  mesh.frustumCulled = false
  mesh.renderOrder = -2
  let disposed = false
  return {
    mesh, uniforms,
    dispose() {
      if (disposed) return
      disposed = true
      mesh.removeFromParent()
      geometry.dispose()
      material.dispose()
    },
  }
}
