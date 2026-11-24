import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { webglScrollState } from '../../store/useStore'

/**
 * Ultra-High Resolution 1024x1024 Crema Albedo Texture Generator
 * Features hazelnut micro-bubbles, tiger-striping marbling, and liquid coffee depth.
 */
function createPhotorealisticCremaTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // 1. Radial Base (Dark roast edge to warm golden hazelnut center)
  const grad = ctx.createRadialGradient(512, 512, 35, 512, 512, 512)
  grad.addColorStop(0, '#E5A85C')    // Warm golden center foam
  grad.addColorStop(0.26, '#C8833C') // Golden hazelnut crema
  grad.addColorStop(0.60, '#8A481E') // Deep reddish-amber roast
  grad.addColorStop(0.86, '#46200D') // Dark espresso ring
  grad.addColorStop(1, '#1C0A04')    // Edge meniscus
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 1024)

  // 2. High-Frequency Micro-Marbling (Emulsion Tiger Striping)
  ctx.fillStyle = 'rgba(245, 195, 130, 0.32)'
  for (let i = 0; i < 85; i++) {
    const angle = (i / 85) * Math.PI * 2
    const dist = 50 + Math.random() * 390
    const x = 512 + Math.cos(angle) * dist
    const y = 512 + Math.sin(angle) * dist
    const r = 18 + Math.random() * 52

    ctx.beginPath()
    ctx.ellipse(x, y, r * 1.85, r * 0.65, angle + 0.45, 0, Math.PI * 2)
    ctx.fill()
  }

  // 3. Dark Extraction Swirl Veins
  ctx.strokeStyle = 'rgba(28, 12, 6, 0.48)'
  ctx.lineWidth = 3.2
  for (let j = 0; j < 28; j++) {
    ctx.beginPath()
    let cx = 512 + (Math.random() - 0.5) * 280
    let cy = 512 + (Math.random() - 0.5) * 280
    ctx.moveTo(cx, cy)
    for (let k = 0; k < 5; k++) {
      cx += (Math.random() - 0.5) * 110
      cy += (Math.random() - 0.5) * 110
      ctx.lineTo(cx, cy)
    }
    ctx.stroke()
  }

  // 4. Perimeter Micro-Bubbles
  ctx.fillStyle = 'rgba(255, 242, 220, 0.6)'
  for (let b = 0; b < 220; b++) {
    const bAngle = Math.random() * Math.PI * 2
    const bDist = 415 + Math.random() * 85
    const bx = 512 + Math.cos(bAngle) * bDist
    const by = 512 + Math.sin(bAngle) * bDist
    const br = 1.2 + Math.random() * 3.6
    ctx.beginPath()
    ctx.arc(bx, by, br, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

/**
 * Procedural 1024x1024 Crema Bump Map Generator
 * Thousands of micro-dimples and foam pores that catch specular light.
 */
function createCremaBumpTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 1024, 1024)

  // Thousands of micro-foam bubble dimples
  for (let i = 0; i < 3200; i++) {
    const x = Math.random() * 1024
    const y = Math.random() * 1024
    const r = 1.0 + Math.random() * 3.5
    const depth = Math.random() > 0.5

    ctx.fillStyle = depth ? 'rgba(50, 50, 50, 0.28)' : 'rgba(190, 190, 190, 0.28)'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

/**
 * Dynamic Flowing Espresso Liquid Stream Component
 * Continuous cascading liquid stream with impact ripples on crema.
 */
function FlowingEspressoStream({ position = [0, 0, 0] }) {
  const streamRef = useRef()
  const rippleRef1 = useRef()
  const rippleRef2 = useRef()
  const rippleRef3 = useRef()

  // Procedural stream geometry (Tapered curved column from portafilter height into cup)
  const streamGeometry = useMemo(() => {
    // 3D curve with gentle organic helical wiggle
    const curvePoints = []
    const segments = 45
    const topY = 2.8
    const botY = 0.985
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const y = THREE.MathUtils.lerp(topY, botY, t)
      const wiggle = Math.sin(t * Math.PI * 3) * 0.025 * (1 - t * 0.5)
      const wiggleZ = Math.cos(t * Math.PI * 3) * 0.02 * (1 - t * 0.5)
      curvePoints.push(new THREE.Vector3(wiggle, y, wiggleZ))
    }
    const path = new THREE.CatmullRomCurve3(curvePoints)
    // Tapered radius: slightly thicker at top, narrow in mid-air, spreading at impact
    return new THREE.TubeGeometry(path, 45, 0.045, 16, false)
  }, [])

  // Rich amber/dark roast liquid stream material with high specular shine
  const streamMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#240F06', // Rich roasted espresso
      emissive: '#180702',
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.35,
      transparent: true,
      opacity: 0.96,
      ior: 1.34,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06
    })
  }, [])

  // 60 FPS Fluid Stream Animation Loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // 1. Fluid Stream Surface Micro-Wave Wiggle
    if (streamRef.current) {
      streamRef.current.rotation.y = time * 2.8
    }

    // 2. Impact Waves on Crema Surface
    if (rippleRef1.current) {
      const p1 = (time * 1.8) % 1
      rippleRef1.current.scale.setScalar(1 + p1 * 3.8)
      rippleRef1.current.material.opacity = (1 - p1) * 0.65
    }
    if (rippleRef2.current) {
      const p2 = ((time * 1.8) + 0.33) % 1
      rippleRef2.current.scale.setScalar(1 + p2 * 3.8)
      rippleRef2.current.material.opacity = (1 - p2) * 0.65
    }
    if (rippleRef3.current) {
      const p3 = ((time * 1.8) + 0.66) % 1
      rippleRef3.current.scale.setScalar(1 + p3 * 3.8)
      rippleRef3.current.material.opacity = (1 - p3) * 0.65
    }
  })

  return (
    <group position={position}>
      {/* 1. Main Continuous Cascading Espresso Stream Column */}
      <mesh ref={streamRef} geometry={streamGeometry} material={streamMaterial} />

      {/* 2. Expanding Impact Ripple Rings on the Crema Surface */}
      <mesh
        ref={rippleRef1}
        position={[0, 0.99, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.04, 0.09, 32]} />
        <meshBasicMaterial color="#E5A85C" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      <mesh
        ref={rippleRef2}
        position={[0, 0.99, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.04, 0.09, 32]} />
        <meshBasicMaterial color="#E5A85C" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      <mesh
        ref={rippleRef3}
        position={[0, 0.99, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.04, 0.09, 32]} />
        <meshBasicMaterial color="#E5A85C" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Micro Droplet Splatters at Impact */}
      {[0, 1, 2, 3, 4].map((idx) => {
        const a = (idx * Math.PI * 2) / 5
        return (
          <mesh
            key={idx}
            position={[Math.cos(a) * 0.1, 1.01, Math.sin(a) * 0.1]}
            scale={0.016}
            material={streamMaterial}
          >
            <sphereGeometry args={[1, 12, 12]} />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * Double-Walled Borosilicate Glass Espresso Cup with Crema & Smoked Saucer
 */
export default function GlassEspressoCup() {
  const groupRef = useRef()
  const steamRef = useRef()

  const { viewport } = useThree()
  const isDesktop = viewport.width > 7.5

  // Textures generated once
  const cremaTexture = useMemo(() => createPhotorealisticCremaTexture(), [])
  const cremaBump = useMemo(() => createCremaBumpTexture(), [])

  // 1. Double-Walled Borosilicate Glass Demitasse Geometry (Lathe)
  const glassGeometry = useMemo(() => {
    const points = []
    // Thick solid optical base foot
    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(0.50, 0))
    points.push(new THREE.Vector2(0.54, 0.08))
    // Outer flared glass demitasse wall
    points.push(new THREE.Vector2(0.62, 0.26))
    points.push(new THREE.Vector2(0.76, 0.60))
    points.push(new THREE.Vector2(0.90, 1.02))
    points.push(new THREE.Vector2(0.96, 1.30)) // Outer top rim
    // Smooth rounded glass lip
    points.push(new THREE.Vector2(0.94, 1.35))
    points.push(new THREE.Vector2(0.88, 1.33))
    // Inner vacuum-insulated bowl
    points.push(new THREE.Vector2(0.82, 1.10))
    points.push(new THREE.Vector2(0.68, 0.70))
    points.push(new THREE.Vector2(0.50, 0.38))
    points.push(new THREE.Vector2(0.32, 0.22))
    points.push(new THREE.Vector2(0, 0.20))
    return new THREE.LatheGeometry(points, 64)
  }, [])

  // 2. Liquid Espresso Body (Suspended inside the inner glass bowl)
  const liquidGeometry = useMemo(() => {
    const points = []
    points.push(new THREE.Vector2(0, 0.21))
    points.push(new THREE.Vector2(0.31, 0.23))
    points.push(new THREE.Vector2(0.49, 0.38))
    points.push(new THREE.Vector2(0.67, 0.70))
    points.push(new THREE.Vector2(0.78, 0.98)) // Top liquid meniscus
    points.push(new THREE.Vector2(0, 0.98))
    return new THREE.LatheGeometry(points, 48)
  }, [])

  // 3. Crema Foam Disc Geometry
  const cremaGeometry = useMemo(() => {
    return new THREE.CircleGeometry(0.77, 48)
  }, [])

  // 4. Top Glass Rim Accent Ring (Ensures razor-sharp glass silhouette)
  const rimAccentGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.92, 0.02, 16, 64)
  }, [])

  // 5. Smoked Bronze Luxury Saucer Geometry (Lathe)
  const saucerGeometry = useMemo(() => {
    const points = []
    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(0.64, 0))
    points.push(new THREE.Vector2(0.70, 0.04))
    points.push(new THREE.Vector2(0.80, 0.06))
    points.push(new THREE.Vector2(1.22, 0.17))
    points.push(new THREE.Vector2(1.46, 0.30))
    points.push(new THREE.Vector2(1.52, 0.36)) // Outer rim
    points.push(new THREE.Vector2(1.50, 0.39))
    points.push(new THREE.Vector2(1.42, 0.36))
    points.push(new THREE.Vector2(1.12, 0.22))
    points.push(new THREE.Vector2(0.74, 0.10))
    points.push(new THREE.Vector2(0.52, 0.07))
    points.push(new THREE.Vector2(0, 0.05))
    return new THREE.LatheGeometry(points, 64)
  }, [])

  // 6. Ergonomic Fluted Glass Handle
  const handleGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.38, 0.07, 24, 48, Math.PI * 1.15)
  }, [])

  // 7. Photorealistic PBR Materials
  // A. Heavy Borosilicate Glass (Visible crystalline clarity, specular sheen & physical thickness)
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#FFFFFF',
      transmission: 0.72, // Crystal transmission while retaining clear visible glass body & edges
      transparent: true,
      opacity: 0.90,
      roughness: 0.03,
      ior: 1.52, // Borosilicate crown glass refraction index
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: '#FFFFFF',
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      attenuationColor: '#F5EBE1',
      attenuationDistance: 1.4
    })
  }, [])

  // B. Rich Amber Espresso Liquid Body
  const liquidMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#1E0A04', // Deep roasted dark espresso body
      emissive: '#100502',
      transmission: 0.30,
      transparent: true,
      opacity: 0.98,
      roughness: 0.08,
      ior: 1.34,
      thickness: 0.85,
      specularIntensity: 1.0,
      specularColor: '#FFD8A8',
      clearcoat: 1.0
    })
  }, [])

  // C. Tiger-Striped Crema Foam Layer with Micro-Porous Bump Map
  const cremaMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: cremaTexture,
      bumpMap: cremaBump,
      bumpScale: 0.024,
      roughness: 0.26,
      metalness: 0.04
    })
  }, [cremaTexture, cremaBump])

  // D. Top Rim Specular Accent Material
  const rimMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#FFFFFF',
      roughness: 0.02,
      clearcoat: 1.0,
      transmission: 0.85,
      transparent: true,
      opacity: 0.8
    })
  }, [])

  // E. Smoked Dark Bronze Saucer
  const saucerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#281A12', // Smoked espresso bronze
      metalness: 0.82,
      roughness: 0.24
    })
  }, [])

  // 8. Ambient Aroma Steam Wisps
  const steamCount = 38
  const [steamPositions, steamVelocities] = useMemo(() => {
    const pos = new Float32Array(steamCount * 3)
    const vel = new Float32Array(steamCount)
    for (let i = 0; i < steamCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.7
      pos[i * 3 + 1] = 1.0 + Math.random() * 1.3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.7
      vel[i] = 0.007 + Math.random() * 0.012
    }
    return [pos, vel]
  }, [steamCount])

  // Decoupled 60 FPS WebGL RAF Loop
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    const mouseX = state.mouse.x
    const mouseY = state.mouse.y
    const scrollProgress = webglScrollState.progress

    // Natural Organic Floating Oscillation
    const breathY = Math.sin(time * 1.1) * 0.035
    const breathRotX = Math.sin(time * 0.7) * 0.018
    const breathRotZ = Math.cos(time * 0.9) * 0.012

    // Responsive Scroll Choreography
    let targetX = 0
    let targetY = -0.22 // Perfectly centered between ESPR and ESSO in Hero
    let targetZ = 0
    let targetTiltX = 0.38 // Forward tilt to highlight golden crema and liquid refraction
    let targetRotY = scrollProgress * Math.PI * 2.6 + time * 0.04 + mouseX * 0.22
    let targetScale = 1.30

    if (isDesktop) {
      if (scrollProgress < 0.22) {
        // Hero Section: Centered, nestled perfectly between ESPR and ESSO
        targetX = 0.0
        targetY = -0.22
        targetTiltX = 0.38
        targetScale = 1.30
      } else if (scrollProgress >= 0.22 && scrollProgress < 0.48) {
        // Flavor Selector: Glides smoothly to desktop right
        targetX = 1.25
        targetY = -0.35
        targetTiltX = 0.45
        targetScale = 1.05
      } else if (scrollProgress >= 0.48 && scrollProgress < 0.72) {
        // Macro Extraction Story: Cinematic dolly zoom looking straight into crema
        targetX = 0.0
        targetY = -0.15
        targetZ = 0.5
        targetTiltX = 0.70 // Dramatic top-down macro angle!
        targetScale = 1.32
      } else {
        // Craft Bento Grid: Elegant peripheral staging
        targetX = 0.98
        targetY = -0.35
        targetTiltX = 0.35
        targetScale = 1.0
      }
    } else {
      targetScale = 0.95
      targetY = -0.25
      targetTiltX = 0.42
    }

    const lerpRate = Math.min(1, delta * 3.8)

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX + mouseX * 0.08, lerpRate)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + breathY + mouseY * 0.06, lerpRate)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpRate)
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, lerpRate))

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetTiltX + breathRotX + mouseY * 0.08, lerpRate)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, lerpRate)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, breathRotZ - mouseX * 0.04, lerpRate)

    // Aroma Steam Animation
    if (steamRef.current && steamRef.current.geometry.attributes.position) {
      const posAttr = steamRef.current.geometry.attributes.position
      const arr = posAttr.array
      for (let i = 0; i < steamCount; i++) {
        arr[i * 3 + 1] += steamVelocities[i]
        arr[i * 3 + 0] += Math.sin(time * 1.5 + i) * 0.002
        if (arr[i * 3 + 1] > 2.3) {
          arr[i * 3 + 1] = 1.02
          arr[i * 3 + 0] = (Math.random() - 0.5) * 0.6
          arr[i * 3 + 2] = (Math.random() - 0.5) * 0.6
        }
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.22, 0]}>
      {/* 1. Double-Walled Borosilicate Glass Cup (Physical Refraction & Specular Edge) */}
      <mesh
        geometry={glassGeometry}
        material={glassMaterial}
        position={[0, 0.06, 0]}
      />

      {/* 2. Top Rim Specular Accent Ring (Ensures crisp crystal rim definition) */}
      <mesh
        geometry={rimAccentGeometry}
        material={rimMaterial}
        position={[0, 1.40, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* 3. Rich Amber Espresso Liquid Body */}
      <mesh
        geometry={liquidGeometry}
        material={liquidMaterial}
        position={[0, 0.06, 0]}
      />

      {/* 4. Golden-Amber Tiger-Striped Crema Layer */}
      <mesh
        geometry={cremaGeometry}
        material={cremaMaterial}
        position={[0, 1.045, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* 5. Cascading Espresso Fluid Stream (Dynamic Pouring Flow) */}
      <FlowingEspressoStream position={[0, 0.06, 0]} />

      {/* 6. Fluted Glass Cup Handle */}
      <mesh
        geometry={handleGeometry}
        material={glassMaterial}
        position={[0.94, 0.76, 0]}
        rotation={[0, 0, -Math.PI / 1.15]}
      />

      {/* 7. Smoked Bronze Luxury Saucer Plate */}
      <mesh
        geometry={saucerGeometry}
        material={saucerMaterial}
        position={[0, -0.06, 0]}
      />

      {/* 8. Subtle Steam / Aroma Wisps */}
      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={steamCount}
            array={steamPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#FAF5EE"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 9. Soft Natural Grounding Contact Shadow */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.7, 48]} />
        <meshBasicMaterial
          color="#160E08"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
