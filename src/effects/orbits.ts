import {
  AdditiveBlending,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  TorusGeometry,
} from 'three'

export interface OrbitalEnergy {
  group: Group
  update: (time: number) => void
  dispose: () => void
}

function createArcGeometry(tube: number, arc: number, segments: number, fade: number) {
  const geometry = new TorusGeometry(1, tube, 5, segments, arc)
  const uv = geometry.getAttribute('uv')
  const colors = new Float32Array(uv.count * 4)

  for (let vertex = 0; vertex < uv.count; vertex += 1) {
    const progress = uv.getX(vertex)
    const edge = Math.min(progress / fade, (1 - progress) / fade, 1)
    const offset = vertex * 4
    colors[offset] = 1
    colors[offset + 1] = 1
    colors[offset + 2] = 1
    colors[offset + 3] = MathUtils.smoothstep(edge, 0, 1)
  }

  // Vertex alpha feathers the ends without textures or a postprocessing pass.
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 4))
  return geometry
}

export function createOrbitalEnergy(): OrbitalEnergy {
  const group = new Group()
  group.name = 'dragon-ball-orbital-energy'
  const arc = Math.PI * 1.76
  const coreGeometry = createArcGeometry(0.0065, arc, 96, 0.09)
  const haloGeometry = createArcGeometry(0.027, arc, 96, 0.13)
  const segmentGeometry = createArcGeometry(0.01, Math.PI * 0.16, 16, 0.24)
  const geometries = [coreGeometry, haloGeometry, segmentGeometry]

  const materialOptions = {
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
  }
  const coreMaterial = new MeshBasicMaterial({ ...materialOptions, color: 0xffc55b, opacity: 0.62 })
  const haloMaterial = new MeshBasicMaterial({ ...materialOptions, color: 0xff9424, opacity: 0.075 })
  const segmentMaterial = new MeshBasicMaterial({ ...materialOptions, color: 0xffedb3, opacity: 0.9 })
  const materials = [coreMaterial, haloMaterial, segmentMaterial]

  const settings = [
    { radius: 1.14, tiltX: 0.46, tiltY: 0.16, tiltZ: -0.35, phase: 0.4, speed: 0.085, flow: 0.38 },
    { radius: 1.28, tiltX: -0.48, tiltY: 0.48, tiltZ: 0.85, phase: 2.1, speed: -0.07, flow: -0.31 },
    { radius: 1.4, tiltX: 0.62, tiltY: -0.18, tiltZ: -0.9, phase: 4.3, speed: 0.055, flow: 0.29 },
  ]

  const orbits = settings.map((setting, index) => {
    const plane = new Group()
    plane.name = `orbital-energy-plane-${index + 1}`
    plane.rotation.set(setting.tiltX, setting.tiltY, setting.tiltZ)
    plane.scale.setScalar(setting.radius)
    const track = new Group()
    track.name = 'orbital-energy-track'
    const halo = new Mesh(haloGeometry, haloMaterial)
    halo.name = 'orbital-energy-halo'
    const core = new Mesh(coreGeometry, coreMaterial)
    core.name = 'orbital-energy-core'
    core.renderOrder = 1
    const segment = new Mesh(segmentGeometry, segmentMaterial)
    segment.name = 'orbital-energy-moving-segment'
    segment.renderOrder = 2
    track.add(halo, core)
    plane.add(track, segment)
    group.add(plane)
    return { track, segment, ...setting }
  })

  let disposed = false

  function update(time: number) {
    if (disposed) return
    const elapsed = Number.isFinite(time) ? Math.max(0, time) : 0

    orbits.forEach((orbit) => {
      // Spin within fixed inclined planes, keeping energy outside the stars.
      orbit.track.rotation.z = orbit.phase + elapsed * orbit.speed
      orbit.segment.rotation.z = orbit.phase + 1.2 + elapsed * (orbit.speed + orbit.flow)
    })
  }

  update(0)

  return {
    group,
    update,
    dispose() {
      if (disposed) return
      disposed = true
      group.removeFromParent()
      orbits.forEach((orbit) => {
        orbit.track.clear()
        orbit.segment.removeFromParent()
      })
      group.clear()
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      orbits.length = 0
      geometries.length = 0
      materials.length = 0
    },
  }
}
