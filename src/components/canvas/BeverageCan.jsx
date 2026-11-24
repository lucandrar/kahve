import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore, webglScrollState } from '../../store/useStore'

/**
 * Procedural Directional Brushed Metal Texture Generator
 * Creates micro-hairline scratches for luxury watch / aerospace-grade metal finish.
 */
function createBrushedMetalTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 512)

  // Thousands of fine horizontal brushed striations
  for (let i = 0; i < 2200; i++) {
    const y = Math.random() * 512
    const x = Math.random() * 512
    const len = 35 + Math.random() * 140
    const alpha = 0.03 + Math.random() * 0.07

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.fillRect(x, y, len, 0.75)
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.85})`
    ctx.fillRect(x, y + 0.75, len, 0.75)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 4)
  tex.needsUpdate = true
  return tex
}

/**
 * High-Resolution 2048x2048 Procedural Label & PBR Maps Generator
 * Features velvety matte cotton paper (roughness 0.85) contrasting against
 * hot-stamped bronze metallic foil (roughness 0.15, metalness 0.92).
 */
function createEspressoPbrTextures(flavor) {
  const width = 2048
  const height = 2048

  // 1. DIFFUSE / ALBEDO MAP
  const mapCanvas = document.createElement('canvas')
  mapCanvas.width = width
  mapCanvas.height = height
  const ctx = mapCanvas.getContext('2d')

  // 2. ROUGHNESS MAP (Dark = Mirror shiny foil, Bright = Velvety matte cotton paper)
  const roughCanvas = document.createElement('canvas')
  roughCanvas.width = width
  roughCanvas.height = height
  const rCtx = roughCanvas.getContext('2d')

  // 3. BUMP MAP (Hairline debossing, paper tooth, and raised foil embossing)
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bCtx = bumpCanvas.getContext('2d')

  if (!ctx || !rCtx || !bCtx) return { map: null, roughnessMap: null, bumpMap: null }

  // Section Boundaries:
  // Top Exposed Brushed Metal: 0 to 280
  // Tactile Cotton Paper Label Wrap: 280 to 1768 (Height: 1488px)
  // Bottom Exposed Brushed Metal: 1768 to 2048
  const wrapTop = 280
  const wrapBottom = 1768
  const wrapHeight = wrapBottom - wrapTop

  // --- A. Base Container Ceramic / Dark Espresso Body ---
  ctx.fillStyle = flavor.canBaseColor || '#1C120D'
  ctx.fillRect(0, 0, width, height)

  // Brushed micro-horizontal metal striations
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)'
  for (let y = 0; y < height; y += 4) {
    if (y < wrapTop || y > wrapBottom) {
      ctx.fillRect(0, y, width, 1.5)
    }
  }

  // Base metal roughness: smooth brushed metal (~ 0.22)
  rCtx.fillStyle = '#383838'
  rCtx.fillRect(0, 0, width, height)

  // Bump neutral
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, width, height)

  // --- B. Tactile Heavy Cotton Art Paper Label Wrap ---
  ctx.fillStyle = '#F4F0EB' // Warm Alabaster Heavy Cotton Paper
  ctx.fillRect(0, wrapTop, width, wrapHeight)

  // High-frequency cotton paper organic fiber grain
  ctx.fillStyle = 'rgba(44, 29, 24, 0.028)'
  for (let y = wrapTop; y < wrapBottom; y += 4) {
    ctx.fillRect(0, y, width, 1)
  }

  // Roughness: Cotton Paper is velvety matte (value ~ 0.85 = #D9D9D9)
  rCtx.fillStyle = '#D9D9D9'
  rCtx.fillRect(0, wrapTop, width, wrapHeight)

  // Bump: Fine paper tooth
  bCtx.fillStyle = '#888888'
  bCtx.fillRect(0, wrapTop, width, wrapHeight)

  // Label Top & Bottom Debossed Hairline Seams
  ctx.fillStyle = 'rgba(44, 29, 24, 0.35)'
  ctx.fillRect(0, wrapTop, width, 2)
  ctx.fillRect(0, wrapBottom - 2, width, 2)

  bCtx.fillStyle = '#484848' // Debossed seam line
  bCtx.fillRect(0, wrapTop, width, 3)
  bCtx.fillRect(0, wrapBottom - 3, width, 3)

  // --- C. Brushed Bronze Foil Stamping Accent Stripes ---
  const foilColor = flavor.accentColor || '#C89D7C'
  ctx.fillStyle = foilColor
  ctx.fillRect(0, wrapTop + 40, width, 6)
  ctx.fillRect(0, wrapBottom - 46, width, 6)

  // Hot-stamped foil roughness is mirror metallic (sheen ~ 0.15 = #262626)
  rCtx.fillStyle = '#262626'
  rCtx.fillRect(0, wrapTop + 40, width, 6)
  rCtx.fillRect(0, wrapBottom - 46, width, 6)

  // Raised embossed foil
  bCtx.fillStyle = '#B0B0B0'
  bCtx.fillRect(0, wrapTop + 40, width, 6)
  bCtx.fillRect(0, wrapBottom - 46, width, 6)

  // ----------------------------------------------------
  // PANEL 1: FRONT APERTURE (Center X = 1024)
  // ----------------------------------------------------
  const frontX = 1024

  // Archival Series Micro-Tag
  ctx.textAlign = 'center'
  ctx.font = '700 22px "Space Mono", monospace'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '8px'
  ctx.fillText(`KAHVE SANATININ EN SAF HALİ // ${flavor.vintage ? flavor.vintage.toUpperCase() : 'HASAT 2026'}`, frontX, wrapTop + 140)

  // Architectural Hairline Rule (Debossed)
  ctx.fillStyle = 'rgba(44, 29, 24, 0.28)'
  ctx.fillRect(frontX - 440, wrapTop + 175, 880, 2)
  bCtx.fillStyle = '#555555'
  bCtx.fillRect(frontX - 440, wrapTop + 175, 880, 2)

  // Primary Brandmark
  ctx.font = '900 136px "Syne", "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '22px'
  ctx.fillText('A E T H E R', frontX, wrapTop + 340)

  // Sub-brand in Hot-Stamped Warm Bronze Foil
  ctx.font = '700 28px "Space Mono", monospace'
  ctx.fillStyle = foilColor
  ctx.letterSpacing = '10px'
  ctx.fillText('ESPRESSO ARTISANAL RESERVE', frontX, wrapTop + 405)

  // Foil specular reflection & embossing for sub-brand
  rCtx.fillStyle = '#262626'
  rCtx.font = '700 28px "Space Mono", monospace'
  rCtx.textAlign = 'center'
  rCtx.letterSpacing = '10px'
  rCtx.fillText('ESPRESSO ARTISANAL RESERVE', frontX, wrapTop + 405)

  bCtx.fillStyle = '#A8A8A8'
  bCtx.font = '700 28px "Space Mono", monospace'
  bCtx.textAlign = 'center'
  bCtx.letterSpacing = '10px'
  bCtx.fillText('ESPRESSO ARTISANAL RESERVE', frontX, wrapTop + 405)

  // Flavor Title
  ctx.font = 'italic 700 64px "Playfair Display", Georgia, serif'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '2px'
  ctx.fillText(`No. ${flavor.number} — ${flavor.name}`, frontX, wrapTop + 565)

  // Origin & Elevation Sub-label
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#523C34'
  ctx.letterSpacing = '3px'
  ctx.fillText((flavor.origin || '').toUpperCase(), frontX, wrapTop + 630)

  // Bronze foil hairline anchor
  ctx.fillStyle = foilColor
  ctx.fillRect(frontX - 80, wrapTop + 690, 160, 4)
  rCtx.fillStyle = '#262626'
  rCtx.fillRect(frontX - 80, wrapTop + 690, 160, 4)
  bCtx.fillStyle = '#AAAAAA'
  bCtx.fillRect(frontX - 80, wrapTop + 690, 160, 4)

  // Cupping Notes
  ctx.font = '700 22px "Space Mono", monospace'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '4px'
  ctx.fillText((flavor.notes || []).join('   ·   ').toUpperCase(), frontX, wrapTop + 765)

  // Seal of Roasting Stamp (Embossed Bronze)
  const sealY = wrapTop + 965
  ctx.strokeStyle = foilColor
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(frontX, sealY, 82, 0, Math.PI * 2)
  ctx.stroke()

  rCtx.strokeStyle = '#262626'
  rCtx.lineWidth = 3
  rCtx.beginPath()
  rCtx.arc(frontX, sealY, 82, 0, Math.PI * 2)
  rCtx.stroke()

  ctx.font = '700 16px "Space Mono", monospace'
  ctx.fillStyle = '#2C1D18'
  ctx.fillText('SOĞUK DAMITMA', frontX, sealY - 18)
  ctx.font = '800 32px "Cinzel", serif'
  ctx.fillText('-2°C', frontX, sealY + 14)
  ctx.font = '700 16px "Space Mono", monospace'
  ctx.fillStyle = foilColor
  ctx.fillText('18 SAAT', frontX, sealY + 40)

  // Micro Volume & Batch Specifications
  ctx.font = '700 24px "Space Mono", monospace'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '5px'
  ctx.fillText(`330 ML   ·   100% ARABICA   ·   ${flavor.stats ? flavor.stats.batch : 'LOT-01'}`, frontX, wrapTop + 1200)

  // ----------------------------------------------------
  // PANEL 2: TECHNICAL SPECIFICATIONS (Left X = 420)
  // ----------------------------------------------------
  const leftX = 420
  ctx.textAlign = 'left'
  ctx.font = '700 22px "Space Mono", monospace'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '4px'
  ctx.fillText('DEMLEME SPESİFİKASYONLARI', leftX - 220, wrapTop + 240)

  ctx.fillStyle = 'rgba(44, 29, 24, 0.28)'
  ctx.fillRect(leftX - 220, wrapTop + 265, 520, 2)

  const specs = [
    ['METOT', 'SUB-ZERO DAMITMA (-2°C)'],
    ['SÜRE', (flavor.stats ? flavor.stats.extraction : '18 Saat') + ' YAVAŞ DAMLA'],
    ['ÇEKİRDEK', (flavor.stats ? flavor.stats.beans : '100% Arabica').toUpperCase()],
    ['RAKIM', flavor.stats ? flavor.stats.altitude : '2,200M'],
    ['KORUMA', 'AZOT BASINÇLI HERMETİK KAPAK'],
    ['ALÜMİNYUM', '100% SONSUZ GERİ DÖNÜŞÜM']
  ]
  specs.forEach(([label, val], idx) => {
    const rowY = wrapTop + 330 + idx * 78
    ctx.font = '700 18px "Space Mono", monospace'
    ctx.fillStyle = '#8C674B'
    ctx.fillText(label, leftX - 220, rowY)
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#2C1D18'
    ctx.fillText(val, leftX - 220, rowY + 28)
  })

  // ----------------------------------------------------
  // PANEL 3: SENSORY MANIFESTO (Right X = 1628)
  // ----------------------------------------------------
  const rightX = 1628
  ctx.textAlign = 'left'
  ctx.font = '700 22px "Space Mono", monospace'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '4px'
  ctx.fillText('DUYUSAL MANİFESTO', rightX - 220, wrapTop + 240)

  ctx.fillStyle = 'rgba(44, 29, 24, 0.28)'
  ctx.fillRect(rightX - 220, wrapTop + 265, 520, 2)

  ctx.font = 'italic 24px "Playfair Display", Georgia, serif'
  ctx.fillStyle = '#2C1D18'
  const lines = [
    'Kahvenin en saf, en güçlü hali.',
    'Her hasat, volkanik yüksek yaylalardan',
    'özenle seçilen çekirdeklerin 18 saatlik',
    'sub-zero damıtma döngüsüyle demlenir.',
    '',
    'Azot korumalı hermetik kapak ile',
    'uçucu kahve yağları ve zengin krema',
    'ilk andaki tazeliğiyle korunur.',
    '',
    'Soğuk içiniz. 100% geri dönüştürülebilir.'
  ]
  lines.forEach((l, idx) => {
    ctx.fillText(l, rightX - 220, wrapTop + 335 + idx * 46)
  })

  // Create Three.js Textures
  const mapTex = new THREE.CanvasTexture(mapCanvas)
  mapTex.colorSpace = THREE.SRGBColorSpace
  mapTex.anisotropy = 8
  mapTex.wrapS = THREE.RepeatWrapping
  mapTex.wrapT = THREE.ClampToEdgeWrapping
  mapTex.offset.set(0.12, 0)
  mapTex.needsUpdate = true

  const roughTex = new THREE.CanvasTexture(roughCanvas)
  roughTex.wrapS = THREE.RepeatWrapping
  roughTex.wrapT = THREE.ClampToEdgeWrapping
  roughTex.offset.set(0.12, 0)
  roughTex.needsUpdate = true

  const bumpTex = new THREE.CanvasTexture(bumpCanvas)
  bumpTex.wrapS = THREE.RepeatWrapping
  bumpTex.wrapT = THREE.ClampToEdgeWrapping
  bumpTex.offset.set(0.12, 0)
  bumpTex.needsUpdate = true

  return { map: mapTex, roughnessMap: roughTex, bumpMap: bumpTex }
}

export default function BeverageCan() {
  const groupRef = useRef()
  const topCapRef = useRef()
  const pullTabRef = useRef()
  const dropsRef = useRef()

  const { viewport } = useThree()
  const isDesktop = viewport.width > 7.5

  const { activeFlavorIndex, flavors } = useStore()

  // Directional brushed metal texture generated once
  const brushedMetalTexture = useMemo(() => createBrushedMetalTexture(), [])

  // Multi-layered PBR texture sets generated once in memory
  const textureSets = useMemo(() => {
    return flavors.map((f) => createEspressoPbrTextures(f))
  }, [flavors])

  const currentTextures = textureSets[activeFlavorIndex] || { map: null, roughnessMap: null, bumpMap: null }

  // Sleek 330ml Can Geometry Proportions
  const bodyRadius = 0.60
  const bodyHeight = 2.45
  const radialSegments = 64

  // Lathe Profiles with Precision Neck Taper & Beveled Lips
  const rimGeometry = useMemo(() => {
    const points = []
    points.push(new THREE.Vector2(0.60, 0))
    points.push(new THREE.Vector2(0.595, 0.04))
    points.push(new THREE.Vector2(0.56, 0.12)) // subtle neck taper
    points.push(new THREE.Vector2(0.53, 0.18))
    points.push(new THREE.Vector2(0.54, 0.22)) // outer lip bead
    points.push(new THREE.Vector2(0.505, 0.24)) // inner rim edge
    return new THREE.LatheGeometry(points, 64)
  }, [])

  const bottomGeometry = useMemo(() => {
    const points = []
    points.push(new THREE.Vector2(0.46, 0))
    points.push(new THREE.Vector2(0.51, 0.05))
    points.push(new THREE.Vector2(0.58, 0.14))
    points.push(new THREE.Vector2(0.60, 0.22))
    return new THREE.LatheGeometry(points, 64)
  }, [])

  // Rolex-Tier Brushed Bronze/Espresso Anodized Metal Material (MeshPhysicalMaterial)
  const bronzeRimMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#38251B',
      metalness: 0.95,
      roughness: 0.22,
      clearcoat: 0.40,
      clearcoatRoughness: 0.15,
      bumpMap: brushedMetalTexture,
      bumpScale: 0.003,
      envMapIntensity: 2.2
    })
  }, [brushedMetalTexture])

  // Micro-Condensation Droplets Setup (InstancedMesh)
  const dropletCount = 60
  const dropletGeometry = useMemo(() => new THREE.SphereGeometry(1, 12, 10), [])
  const dropletMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#FFFFFF',
      transmission: 0.95,
      transparent: true,
      opacity: 0.9,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      ior: 1.333, // Pure water droplet refraction
      envMapIntensity: 2.5
    })
  }, [])

  // Initialize condensation droplets instances once
  useEffect(() => {
    if (!dropsRef.current) return
    const dummy = new THREE.Object3D()
    const r = bodyRadius + 0.004

    for (let i = 0; i < dropletCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * (bodyHeight * 0.85)
      const scale = 0.005 + Math.random() * 0.012

      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r)
      dummy.rotation.set(0, -angle, 0)
      // Flatten droplet against the cylindrical wall
      dummy.scale.set(scale, scale * (0.9 + Math.random() * 0.4), scale * 0.45)
      dummy.updateMatrix()
      dropsRef.current.setMatrixAt(i, dummy.matrix)
    }
    dropsRef.current.instanceMatrix.needsUpdate = true
  }, [dropletCount, bodyRadius, bodyHeight])

  // Weighted Physics, Inertia & Organic Breathing Choreography (Locked 60 FPS)
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    const mouseX = state.mouse.x || 0
    const mouseY = state.mouse.y || 0
    const scrollProgress = Number.isFinite(webglScrollState.progress) ? webglScrollState.progress : 0
    const explodedProgress = Number.isFinite(webglScrollState.exploded) ? webglScrollState.exploded : 0

    // Slow organic sine-wave floating ("breathing") oscillation
    const breathY = Math.sin(time * 1.05) * 0.028
    const breathRotZ = Math.cos(time * 0.8) * 0.012

    // Scroll-Driven Spatial Separation: strictly at [0, 0, 0] in Hero
    let targetX = 0
    let targetY = 0 // Exactly at world origin [0, 0, 0]
    let targetZ = 0
    let targetScale = 1.18

    if (isDesktop) {
      if (scrollProgress < 0.20) {
        // Hero Section: Strictly centered at [0, 0, 0], nestled between ESPR and ESSO
        targetX = 0.0
        targetY = 0.0
        targetScale = 1.18
      } else if (scrollProgress >= 0.20 && scrollProgress < 0.48) {
        // Flavor Selector: Slides elegantly to desktop right
        targetX = 1.25
        targetY = -0.12
        targetScale = 1.0
      } else if (scrollProgress >= 0.48 && scrollProgress < 0.72) {
        // Macro Story: Dolly zoom center
        targetX = 0.0
        targetY = 0.05
        targetZ = 0.50
        targetScale = 1.18
      } else {
        // Craft Bento Grid: Peripheral right
        targetX = 0.98
        targetY = -0.12
        targetScale = 0.96
      }
    } else {
      targetScale = 0.92
      targetY = 0.0
    }

    // Heavy inertia damping with lerp rate delta * 3.6
    const lerpRate = Math.min(1, Math.max(0.01, delta * 3.6))

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX + mouseX * 0.08, lerpRate)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + breathY + mouseY * 0.07, lerpRate)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpRate)
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, lerpRate))

    // Heavy, slow deliberate rotation: watch studio softboxes glide across the surface
    const targetRotY = scrollProgress * Math.PI * 3.2 + time * 0.035 + mouseX * 0.18
    const targetRotX = mouseY * 0.07 + Math.sin(time * 0.5) * 0.018
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, lerpRate)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, lerpRate)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, breathRotZ, lerpRate)

    // Exploded Cap Elevation in Anatomy Section
    const targetElev = explodedProgress * 0.55
    if (topCapRef.current) {
      topCapRef.current.position.y = THREE.MathUtils.lerp(
        topCapRef.current.position.y,
        bodyHeight / 2 + 0.22 + targetElev,
        delta * 5
      )
    }
    if (pullTabRef.current) {
      pullTabRef.current.position.y = THREE.MathUtils.lerp(
        pullTabRef.current.position.y,
        bodyHeight / 2 + 0.24 + targetElev * 1.15,
        delta * 5
      )
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Main Can Body Cylinder with Multi-Layered PBR Textures (Matte Cotton Paper & Foil) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[bodyRadius, bodyRadius, bodyHeight, radialSegments, 1, true]} />
        <meshStandardMaterial
          map={currentTextures.map}
          roughnessMap={currentTextures.roughnessMap}
          bumpMap={currentTextures.bumpMap}
          bumpScale={0.008} // Rolex-grade paper tooth & embossed foil
          metalness={0.55}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* 2. Micro-Condensation Droplets (InstancedMesh) */}
      <instancedMesh
        ref={dropsRef}
        args={[dropletGeometry, dropletMaterial, dropletCount]}
      />

      {/* 3. Precision Beveled Top Rim with Neck Taper (Brushed Dark Bronze) */}
      <mesh
        geometry={rimGeometry}
        material={bronzeRimMaterial}
        position={[0, bodyHeight / 2, 0]}
      />

      {/* 4. Bottom Taper & Rim */}
      <mesh
        geometry={bottomGeometry}
        material={bronzeRimMaterial}
        position={[0, -bodyHeight / 2, 0]}
        rotation={[Math.PI, 0, 0]}
      />

      {/* 5. Can Bottom Inner Dome Plate */}
      <mesh position={[0, -bodyHeight / 2 + 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.46, 32]} />
        <meshPhysicalMaterial
          color="#221711"
          metalness={0.85}
          roughness={0.25}
          clearcoat={0.3}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* 6. Elevating Recessed Top Lid Cap */}
      <group ref={topCapRef} position={[0, bodyHeight / 2 + 0.22, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.0, 0.505, 48]} />
          <meshPhysicalMaterial
            color="#281A13"
            metalness={0.88}
            roughness={0.22}
            clearcoat={0.4}
            envMapIntensity={2.0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Scoring indent mark for opening */}
        <mesh position={[0.11, 0.002, 0.15]} rotation={[-Math.PI / 2, 0, 0.4]}>
          <planeGeometry args={[0.24, 0.15]} />
          <meshBasicMaterial color="#140C08" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* 7. Precision Pull-Tab in Brushed Bronze */}
      <group ref={pullTabRef} position={[0, bodyHeight / 2 + 0.24, 0]}>
        <mesh position={[0.05, 0.01, -0.09]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.17, 24]} />
          <meshPhysicalMaterial
            color="#C89D7C"
            metalness={0.92}
            roughness={0.16}
            clearcoat={0.5}
            envMapIntensity={2.4}
          />
        </mesh>
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.015, 16]} />
          <meshPhysicalMaterial
            color="#8C674B"
            metalness={0.90}
            roughness={0.20}
            clearcoat={0.4}
            envMapIntensity={2.0}
          />
        </mesh>
      </group>
    </group>
  )
}
