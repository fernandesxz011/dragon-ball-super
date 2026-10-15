import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
  ShaderMaterial,
  SphereGeometry,
  type Material,
} from 'three'

export interface DragonBall {
  group: Group
  update: (elapsedSeconds: number, pointerX: number, pointerY: number, moving: boolean) => void
  dispose: () => void
}

function createStarGeometry() {
  const shape = new Shape()

  for (let point = 0; point < 10; point += 1) {
    const angle = Math.PI / 2 + point * Math.PI / 5
    const radius = point % 2 === 0 ? 0.16 : 0.068
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (point === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }

  shape.closePath()
  return new ShapeGeometry(shape)
}

const orbVertexShader = `
  varying vec3 vLocalPosition;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  void main() {
    vLocalPosition = position;
    vViewNormal = normalMatrix * normal;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`

function createCoreMaterial() {
  return new ShaderMaterial({
    name: 'dragon-ball-luminous-amber',
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new Color('#d54c05') },
      uOrange: { value: new Color('#ff850d') },
      uAmber: { value: new Color('#ffd369') },
      uGold: { value: new Color('#ffe8ac') },
    },
    vertexShader: orbVertexShader,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uDeep, uOrange, uAmber, uGold;
      varying vec3 vLocalPosition;
      varying vec3 vViewNormal;
      varying vec3 vViewPosition;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }
      float noise(vec3 p) {
        vec3 cell = floor(p);
        vec3 blend = fract(p);
        blend = blend * blend * (3.0 - 2.0 * blend);
        return mix(
          mix(mix(hash(cell), hash(cell + vec3(1.0, 0.0, 0.0)), blend.x),
              mix(hash(cell + vec3(0.0, 1.0, 0.0)), hash(cell + vec3(1.0, 1.0, 0.0)), blend.x), blend.y),
          mix(mix(hash(cell + vec3(0.0, 0.0, 1.0)), hash(cell + vec3(1.0, 0.0, 1.0)), blend.x),
              mix(hash(cell + vec3(0.0, 1.0, 1.0)), hash(cell + vec3(1.0, 1.0, 1.0)), blend.x), blend.y), blend.z);
      }
      void main() {
        vec3 normal = normalize(vViewNormal);
        vec3 viewDirection = isOrthographic ? vec3(0.0, 0.0, 1.0) : normalize(vViewPosition);
        float facing = clamp(dot(normal, viewDirection), 0.0, 1.0);
        float fresnel = pow(1.0 - facing, 2.2);
        float light = max(dot(normal, normalize(vec3(-0.48, 0.72, 0.62))), 0.0);
        vec3 p = vLocalPosition;
        vec3 drift = vec3(uTime * 0.012, -uTime * 0.009, 0.0);
        float broad = noise(p * 6.5 + drift);
        float fine = noise(p * 21.0 + broad * 1.7);

        // An off-centre warm core and curved edge replace a flat lit disk.
        vec2 corePosition = (p.xy - vec2(0.08, -0.12)) * vec2(1.25, 1.0);
        float core = exp(-dot(corePosition, corePosition) * 2.6);
        vec3 color = mix(uDeep, uOrange, 0.35 + light * 0.65);
        color = mix(color, uAmber, core * 0.68);
        color *= 0.93 + (broad - 0.5) * 0.2 + (fine - 0.5) * 0.1;
        float flecks = smoothstep(0.72, 0.93, fine) * smoothstep(0.3, 0.65, broad);
        color += uGold * flecks * (0.16 + fresnel * 0.24);

        float innerRim = exp(-pow((facing - 0.19) / 0.075, 2.0));
        color = mix(color, uGold, innerRim * 0.78);
        color += uGold * fresnel * 0.36;
        float reflection = pow(light, 76.0);
        color = mix(color, uGold, reflection * 0.85);
        float lowerArc = pow(max(dot(normal.xy, normalize(vec2(0.52, -0.85))), 0.0), 10.0);
        color += uGold * lowerArc * innerRim * 0.4;

        gl_FragColor = vec4(color, 0.91 + fresnel * 0.08);
        #include <colorspace_fragment>
      }
    `,
  })
}

function createHaloMaterial() {
  return new ShaderMaterial({
    name: 'dragon-ball-glass-edge',
    side: BackSide,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
    uniforms: { uGold: { value: new Color('#ffb83e') } },
    vertexShader: orbVertexShader,
    fragmentShader: `
      uniform vec3 uGold;
      varying vec3 vLocalPosition;
      varying vec3 vViewNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 viewDirection = isOrthographic ? vec3(0.0, 0.0, 1.0) : normalize(vViewPosition);
        float edge = pow(clamp(1.0 - abs(dot(normalize(vViewNormal), viewDirection)), 0.0, 1.0), 2.6);
        gl_FragColor = vec4(uGold, edge * 0.23);
        #include <colorspace_fragment>
      }
    `,
  })
}

export function createDragonBall(): DragonBall {
  const group = new Group()
  group.name = 'dragon-ball-four-stars'
  const orb = new Group()
  orb.name = 'dragon-ball-floating-body'
  group.add(orb)

  const sphereGeometry = new SphereGeometry(1, 40, 28)
  const starGeometry = createStarGeometry()
  const geometries: BufferGeometry[] = [sphereGeometry, starGeometry]
  const coreMaterial = createCoreMaterial()
  const haloMaterial = createHaloMaterial()
  const starMaterial = new MeshBasicMaterial({
    color: 0xf21e32,
    side: DoubleSide,
    transparent: true,
    opacity: 0.98,
    depthWrite: false,
    forceSinglePass: true,
    toneMapped: false,
  })
  const materials: Material[] = [coreMaterial, haloMaterial, starMaterial]

  // Both passes share one sphere. The outer pass only adds a narrow contour,
  // leaving the red inset stars above the glass rather than under the glare.
  const halo = new Mesh(sphereGeometry, haloMaterial)
  halo.name = 'dragon-ball-glass-halo'
  halo.scale.setScalar(1.045)
  const core = new Mesh(sphereGeometry, coreMaterial)
  core.name = 'dragon-ball-luminous-core'
  core.renderOrder = 2
  orb.add(halo, core)

  for (const x of [-0.25, 0.25]) {
    for (const y of [-0.25, 0.25]) {
      const star = new Mesh(starGeometry, starMaterial)
      star.name = 'dragon-ball-star'
      star.position.set(x, y, 0.7)
      // Preserve saturated red through the lightweight, non-refractive shell.
      star.renderOrder = 4
      orb.add(star)
    }
  }

  let disposed = false

  function update(elapsedSeconds: number, pointerX: number, pointerY: number, moving: boolean) {
    if (disposed) return
    const elapsed = Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) : 0
    const x = Number.isFinite(pointerX) ? MathUtils.clamp(pointerX, -1, 1) : 0
    const y = Number.isFinite(pointerY) ? MathUtils.clamp(pointerY, -1, 1) : 0
    coreMaterial.uniforms.uTime.value = moving ? elapsed : 0

    // Only the child moves: the caller owns the slot placement/scale on group.
    orb.position.y = moving ? Math.sin(elapsed * 0.72) * 0.045 : 0
    orb.rotation.set(
      -0.03 + (moving ? Math.sin(elapsed * 0.27) * 0.025 + y * 0.045 : 0),
      0.05 + (moving ? Math.sin(elapsed * 0.23) * 0.04 + x * 0.07 : 0),
      moving ? Math.sin(elapsed * 0.19) * 0.018 : 0,
    )
  }

  update(0, 0, 0, false)

  return {
    group,
    update,
    dispose() {
      if (disposed) return
      disposed = true
      group.removeFromParent()
      orb.clear()
      group.clear()
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      geometries.length = 0
      materials.length = 0
    },
  }
}
