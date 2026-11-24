import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore, webglScrollState } from '../../store/useStore'

/**
 * High-Resolution 2048x2048 Procedural Label Texture Generator
 * Dead-center aligned with camera:
 * - Upper section: Warm latte cream (#EFECE6 / #E8DEC8)
 * - Lower section: Sweeping organic liquid waves in deep emerald green (#006241) and rich espresso (#160E0A)
 * - Centered Brand Header: "AETHER®", "CAFFÈ ESPRESSO", circular emblem, and "220ml"
 */
function createChilledCupTextures(flavor) {
  // Ultra-High Resolution 4096 x 2048 (2:1 Cylindrical Aspect Ratio)
  const width = 4096
  const height = 2048

  // 1. DIFFUSE / ALBEDO MAP
  const mapCanvas = document.createElement('canvas')
  mapCanvas.width = width
  mapCanvas.height = height
  const ctx = mapCanvas.getContext('2d')

  // 2. ROUGHNESS MAP (Dark = Specular emblem/foil, Bright = Coated matte paper)
  const roughCanvas = document.createElement('canvas')
  roughCanvas.width = width
  roughCanvas.height = height
  const rCtx = roughCanvas.getContext('2d')

  // 3. BUMP MAP (Subtle paper fiber tooth, embossed emblem and wave ridges)
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bCtx = bumpCanvas.getContext('2d')

  if (!ctx || !rCtx || !bCtx) return { map: null, roughnessMap: null, bumpMap: null }

  // ------------------------------------------------------------------
  // A. BASE PAPER BACKGROUND (Warm Latte Cream #EFECE6 / #E8DEC8)
  // ------------------------------------------------------------------
  ctx.fillStyle = '#EFECE6'
  ctx.fillRect(0, 0, width, height)

  // Subtle vertical paper gradient: warmer toward the waves
  const creamGrad = ctx.createLinearGradient(0, 0, 0, 1100)
  creamGrad.addColorStop(0, '#F6F3EE')
  creamGrad.addColorStop(0.65, '#EFECE6')
  creamGrad.addColorStop(1, '#E6DEC8')
  ctx.fillStyle = creamGrad
  ctx.fillRect(0, 0, width, 1100)

  // Base roughness: coated matte paper (value ~ 0.65 = #A6A6A6)
  rCtx.fillStyle = '#A6A6A6'
  rCtx.fillRect(0, 0, width, height)

  // Base bump: neutral gray
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, width, height)

  // Tactile paper fiber grain
  ctx.fillStyle = 'rgba(44, 29, 24, 0.022)'
  for (let y = 0; y < 1100; y += 4) {
    ctx.fillRect(0, y, width, 1)
  }
  bCtx.fillStyle = '#858585'
  for (let y = 0; y < 1100; y += 4) {
    bCtx.fillRect(0, y, width, 1)
  }

  // ------------------------------------------------------------------
  // B. LAYERED ORGANIC LIQUID WAVES (Deep Forest Green, Espresso & Cream Swirls)
  // ------------------------------------------------------------------
  const waveBaseY = 1040

  // Edition wave primary color: Emerald Green (#006241 / #0B4F38) or custom edition accent
  const primaryWaveColor = flavor.id === 'yirgacheffe-anaerobic' ? '#006241' : (flavor.canBaseColor || '#1E1410')
  const secondaryWaveColor = '#160E0A' // Deep espresso roast
  const bronzeAccentColor = flavor.accentColor || '#C89D7C'

  // Wave Function Helper across 360-degree wrap (step: 16px for 4096 width)
  const drawWave = (context, startY, amp1, freq1, amp2, freq2, color) => {
    context.fillStyle = color
    context.beginPath()
    context.moveTo(0, height)
    context.lineTo(0, startY)
    for (let x = 0; x <= width; x += 16) {
      const angle = (x / width) * Math.PI * 2
      const y = startY + Math.sin(angle * freq1) * amp1 + Math.cos(angle * freq2) * amp2
      context.lineTo(x, y)
    }
    context.lineTo(width, height)
    context.closePath()
    context.fill()
  }

  // 1. Bottom Dark Espresso Foundation Wave
  drawWave(ctx, waveBaseY + 120, 65, 2, 45, 4, secondaryWaveColor)
  drawWave(rCtx, waveBaseY + 120, 65, 2, 45, 4, '#484848')

  // 2. Primary Deep Forest Green / Rich Edition Wave
  drawWave(ctx, waveBaseY, 80, 2, 50, 3, primaryWaveColor)
  drawWave(rCtx, waveBaseY, 80, 2, 50, 3, '#585858')

  // 3. Delicate Warm Bronze Wave Crest Stroke
  ctx.strokeStyle = bronzeAccentColor
  ctx.lineWidth = 6
  ctx.beginPath()
  for (let x = 0; x <= width; x += 16) {
    const angle = (x / width) * Math.PI * 2
    const y = waveBaseY + Math.sin(angle * 2) * 80 + Math.cos(angle * 3) * 50
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Hot-stamped bronze wave crest on roughness map
  rCtx.strokeStyle = '#262626'
  rCtx.lineWidth = 6
  rCtx.stroke()

  // 4. Stippled / Grainy Froth Texture along Wave Crests
  ctx.fillStyle = 'rgba(250, 246, 240, 0.45)'
  for (let s = 0; s < 750; s++) {
    const x = Math.random() * width
    const angle = (x / width) * Math.PI * 2
    const yCrest = waveBaseY + Math.sin(angle * 2) * 80 + Math.cos(angle * 3) * 50
    const y = yCrest + (Math.random() * 95) - 18
    const r = 1.0 + Math.random() * 3.5
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // ------------------------------------------------------------------
  // C. FRONT APERTURE EDITORIAL TYPOGRAPHY & BRAND EMBLEM (Center X = 2048)
  // Strictly separated within the central front zone (X: 25% to 75%)
  // ------------------------------------------------------------------
  const frontX = 2048

  // 1. Primary Front Typography Block with Horizontal Aspect Compensation (scaleX: 0.65)
  ctx.save()
  ctx.translate(frontX, 0)
  ctx.scale(0.65, 1) // Neutralizes cylindrical stretching and keeps text cleanly in central 55%
  ctx.textAlign = 'center'

  // Archival Header: "AETHER®"
  ctx.font = '900 60px "Syne", "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '11px'
  ctx.fillText('AETHER®', 0, 335)

  // Product Title: "CAFFÈ ESPRESSO"
  ctx.font = '800 102px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '14px'
  ctx.fillText('CAFFÈ', 0, 470)
  ctx.fillText('ESPRESSO', 0, 585)

  // Subtitle / Extraction Note
  ctx.font = '700 20px "Space Mono", monospace'
  ctx.fillStyle = '#8C674B'
  ctx.letterSpacing = '5px'
  ctx.fillText(`SUB-ZERO ARTISANAL COLD BREW // ${flavor.number || '01'}`, 0, 665)

  // Hairline Rule
  ctx.fillStyle = 'rgba(44, 29, 24, 0.22)'
  ctx.fillRect(-240, 705, 480, 2)

  // Cupping Notes Line (Compact 15px font, 2px letter-spacing, fits central column with generous margins)
  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#523C34'
  ctx.letterSpacing = '2px'
  const cuppingNotes = (flavor.notes || ['YABANİ YASEMİN', 'BERGAMOT', 'ŞEFTALİ']).slice(0, 3).join('  ·  ').toUpperCase()
  ctx.fillText(cuppingNotes, 0, 750)

  ctx.restore()

  // 2. Centerpiece Circular Minimalist Emblem (Y = 960) with Aspect Ratio Compensation
  const emblemY = 960
  const emblemRadius = 110

  // Draw Emblem on Diffuse Map
  ctx.save()
  ctx.translate(frontX, emblemY)
  ctx.scale(0.72, 1) // Projects as a true circle on curved cylinder

  // Outer Emblem Background (Pristine paper circle)
  ctx.fillStyle = '#F4F0EB'
  ctx.beginPath()
  ctx.arc(0, 0, emblemRadius, 0, Math.PI * 2)
  ctx.fill()

  // Outer Bronze Foil Ring
  ctx.strokeStyle = bronzeAccentColor
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(0, 0, emblemRadius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#2C1D18'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(0, 0, emblemRadius - 8, 0, Math.PI * 2)
  ctx.stroke()

  // Inner Monogram "Æ"
  ctx.textAlign = 'center'
  ctx.font = '900 85px "Syne", serif'
  ctx.fillStyle = '#2C1D18'
  ctx.fillText('Æ', 0, 28)

  ctx.font = '700 14px "Space Mono", monospace'
  ctx.fillStyle = bronzeAccentColor
  ctx.letterSpacing = '3px'
  ctx.fillText('ARTISANAL', 0, -55)
  ctx.fillText('EST. 2026', 0, 68)

  ctx.restore()

  // Foil sheen in roughness map for emblem ring
  rCtx.save()
  rCtx.translate(frontX, emblemY)
  rCtx.scale(0.72, 1)
  rCtx.strokeStyle = '#262626'
  rCtx.lineWidth = 4
  rCtx.beginPath()
  rCtx.arc(0, 0, emblemRadius, 0, Math.PI * 2)
  rCtx.stroke()
  rCtx.restore()

  // Raised bump for emblem
  bCtx.save()
  bCtx.translate(frontX, emblemY)
  bCtx.scale(0.72, 1)
  bCtx.fillStyle = '#A0A0A0'
  bCtx.beginPath()
  bCtx.arc(0, 0, emblemRadius, 0, Math.PI * 2)
  bCtx.fill()
  bCtx.restore()

  // 3. Bottom Volume & Micro-Batch Typographic Details (White text over dark wave)
  const botY = 1750
  ctx.save()
  ctx.translate(frontX, 0)
  ctx.scale(0.65, 1)
  ctx.textAlign = 'center'

  // Volume: "220ml"
  ctx.font = '800 76px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#F4F0EB'
  ctx.letterSpacing = '6px'
  ctx.fillText('220 ml', 0, botY)

  // Micro-Specs
  ctx.font = '700 18px "Space Mono", monospace'
  ctx.fillStyle = 'rgba(244, 240, 235, 0.85)'
  ctx.letterSpacing = '4px'
  ctx.fillText('100% ARABICA COLD EXTRACTED', 0, botY + 65)

  ctx.font = '600 15px "Space Mono", monospace'
  ctx.fillStyle = 'rgba(244, 240, 235, 0.65)'
  ctx.letterSpacing = '2.5px'
  ctx.fillText(`LOT ${flavor.stats ? flavor.stats.batch : 'ETH-491'}  ·  SHAKE WELL  ·  KEEP CHILLED`, 0, botY + 105)

  ctx.restore()

  // ------------------------------------------------------------------
  // D. BACK APERTURE: NUTRITION & SUSTAINABILITY (Strictly within X: 4% to 14%)
  // Generous buffer of >850px from front zone (frontX = 2048) ensures zero bleed
  // ------------------------------------------------------------------
  const backX = 200
  ctx.textAlign = 'left'
  ctx.font = '700 17px "Space Mono", monospace'
  ctx.fillStyle = '#2C1D18'
  ctx.letterSpacing = '3px'
  ctx.fillText('BESİN & MENŞEİ DEĞERLERİ', backX, 360)

  ctx.fillStyle = 'rgba(44, 29, 24, 0.22)'
  ctx.fillRect(backX, 385, 380, 2)

  const specs = [
    ['ÇEKİRDEK', (flavor.stats ? flavor.stats.beans : '100% Arabica').toUpperCase()],
    ['RAKIM', flavor.stats ? flavor.stats.altitude : '2,200M'],
    ['DAMITMA', '-2°C CRYO 18 SAAT'],
    ['KAFEİN', '140 MG DOĞAL'],
    ['ŞEKER', '0.0 G RAFİNE ŞEKER'],
    ['AMBALAJ', '100% GERİ DÖNÜŞTÜRÜLEBİLİR PP']
  ]
  specs.forEach(([k, v], i) => {
    ctx.font = '700 13px "Space Mono", monospace'
    ctx.fillStyle = '#8C674B'
    ctx.fillText(k, backX, 430 + i * 58)
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#2C1D18'
    ctx.fillText(v, backX, 452 + i * 58)
  })

  // Create Three.js Textures with EXACT 0.5 offset so frontX (2048) faces camera dead-ahead
  const mapTex = new THREE.CanvasTexture(mapCanvas)
  mapTex.colorSpace = THREE.SRGBColorSpace
  mapTex.anisotropy = 16
  mapTex.wrapS = THREE.RepeatWrapping
  mapTex.wrapT = THREE.ClampToEdgeWrapping
  mapTex.offset.set(0.5, 0)
  mapTex.needsUpdate = true

  const roughTex = new THREE.CanvasTexture(roughCanvas)
  roughTex.anisotropy = 16
  roughTex.wrapS = THREE.RepeatWrapping
  roughTex.wrapT = THREE.ClampToEdgeWrapping
  roughTex.offset.set(0.5, 0)
  roughTex.needsUpdate = true

  const bumpTex = new THREE.CanvasTexture(bumpCanvas)
  bumpTex.anisotropy = 16
  bumpTex.wrapS = THREE.RepeatWrapping
  bumpTex.wrapT = THREE.ClampToEdgeWrapping
  bumpTex.offset.set(0.5, 0)
  bumpTex.needsUpdate = true

  return { map: mapTex, roughnessMap: roughTex, bumpMap: bumpTex }
}

/**
 * Hyper-Realistic 220ml Chilled Coffee Cup with Tiered Lid Pop & Espresso Splash
 */
export default function CoffeeCup() {
  const groupRef = useRef()
  const lidRef = useRef()
  const splashCrownRef = useRef()
  const flyingDropsRef = useRef()

  const { viewport } = useThree()
  const isDesktop = viewport.width > 7.5

  const { activeFlavorIndex, flavors, explodedProgress: storeExploded } = useStore()

  // Multi-layered PBR texture sets generated once in memory
  const textureSets = useMemo(() => {
    return flavors.map((f) => createChilledCupTextures(f))
  }, [flavors])

  const currentTextures = textureSets[activeFlavorIndex] || { map: null, roughnessMap: null, bumpMap: null }

  // ------------------------------------------------------------------
  // 1. CUP BODY & ROLLED RIM GEOMETRY
  // Tapered conical body: topRadius: 0.72, bottomRadius: 0.52, height: 2.15
  // ------------------------------------------------------------------
  const cupHeight = 2.15
  const topRadius = 0.72
  const bottomRadius = 0.52

  const rolledRimGeometry = useMemo(() => {
    return new THREE.TorusGeometry(topRadius + 0.012, 0.024, 16, 64)
  }, [topRadius])

  const recessedBaseGeometry = useMemo(() => {
    const points = []
    points.push(new THREE.Vector2(0, -cupHeight / 2 + 0.05))
    points.push(new THREE.Vector2(0.42, -cupHeight / 2 + 0.05))
    points.push(new THREE.Vector2(0.45, -cupHeight / 2))
    points.push(new THREE.Vector2(0.50, -cupHeight / 2))
    points.push(new THREE.Vector2(bottomRadius, -cupHeight / 2 + 0.03))
    return new THREE.LatheGeometry(points, 64)
  }, [cupHeight, bottomRadius])

  // ------------------------------------------------------------------
  // 2. INNER DARK ESPRESSO LIQUID SURFACE (Visible when lid opens)
  // ------------------------------------------------------------------
  const innerLiquidGeometry = useMemo(() => {
    return new THREE.CircleGeometry(topRadius - 0.028, 48)
  }, [topRadius])

  const innerLiquidMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#1E0F0A', // Deep dark espresso
      roughness: 0.12,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      ior: 1.34,
      envMapIntensity: 2.0
    })
  }, [])

  // Golden crema ring on top of liquid surface
  const cremaRingGeometry = useMemo(() => {
    return new THREE.RingGeometry(topRadius - 0.14, topRadius - 0.028, 48)
  }, [topRadius])

  const cremaRingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#C68B53', // Golden hazelnut crema
      roughness: 0.32,
      metalness: 0.05,
      envMapIntensity: 1.4
    })
  }, [])

  // ------------------------------------------------------------------
  // 3. SIGNATURE TWO-TIER IVORY SNAP DOME LID GEOMETRY
  // ------------------------------------------------------------------
  const tieredLidGeometry = useMemo(() => {
    const points = []
    // 1. Snap-fit skirt hanging down over rolled lip
    points.push(new THREE.Vector2(0.765, -0.05))
    points.push(new THREE.Vector2(0.760, 0.01))
    // 2. Outer horizontal ledge
    points.push(new THREE.Vector2(0.755, 0.05))
    points.push(new THREE.Vector2(0.715, 0.065))
    // 3. Lower tier step
    points.push(new THREE.Vector2(0.665, 0.075))
    // 4. Stepped upper riser
    points.push(new THREE.Vector2(0.640, 0.165))
    // 5. Upper dome bevel
    points.push(new THREE.Vector2(0.595, 0.205))
    // 6. Top drinking platform
    points.push(new THREE.Vector2(0.420, 0.215))
    // 7. Drinking / straw hole recess indentation
    points.push(new THREE.Vector2(0.380, 0.175))
    points.push(new THREE.Vector2(0.120, 0.175))
    points.push(new THREE.Vector2(0.040, 0.155))
    points.push(new THREE.Vector2(0, 0.155))
    return new THREE.LatheGeometry(points, 64)
  }, [])

  const lidMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#F7F6F2', // Crisp white/ivory polypropylene
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.20,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.8
    })
  }, [])

  // ------------------------------------------------------------------
  // 4. PROCEDURAL 3D ESPRESSO LIQUID CROWN / SPLASH
  // ------------------------------------------------------------------
  const splashCrownGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.58, 0.44, 0.70, 48, 16, true)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i) // -0.35 to +0.35
      let z = pos.getZ(i)
      const angle = Math.atan2(z, x)
      const t = (y + 0.35) / 0.70 // 0 at base, 1 at crest

      // Organic fluting crown spikes
      const flute = Math.sin(angle * 7) * 0.12 * Math.pow(t, 1.8)
      const flare = 1 + t * 0.42 + flute
      x *= flare
      z *= flare

      // Scalloped splash rim
      if (t > 0.55) {
        y += Math.sin(angle * 7 + 0.4) * 0.12 * ((t - 0.55) / 0.45)
      }
      pos.setXYZ(i, x, y, z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  const splashMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#23110B', // Glossy dark espresso
      transmission: 0.35,
      transparent: true,
      opacity: 0.96,
      roughness: 0.10,
      clearcoat: 0.95,
      clearcoatRoughness: 0.05,
      ior: 1.34,
      envMapIntensity: 2.2
    })
  }, [])

  // Flying Espresso Droplets in Zero-G (InstancedMesh)
  const dropCount = 32
  const dropGeo = useMemo(() => new THREE.SphereGeometry(1, 12, 10), [])
  const dropData = useMemo(() => {
    return Array.from({ length: dropCount }, (_, i) => {
      const angle = (i / dropCount) * Math.PI * 2 + Math.random() * 0.2
      const spreadR = 0.45 + Math.random() * 0.65
      const vy = 0.35 + Math.random() * 0.55
      const scale = 0.018 + Math.random() * 0.022
      return {
        dirX: Math.cos(angle) * spreadR,
        dirY: vy,
        dirZ: Math.sin(angle) * spreadR,
        baseScale: scale
      }
    })
  }, [dropCount])

  // ------------------------------------------------------------------
  // 5. CUP BODY & RIM MATERIALS
  // ------------------------------------------------------------------
  const cupMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: currentTextures.map,
      roughnessMap: currentTextures.roughnessMap,
      bumpMap: currentTextures.bumpMap,
      bumpScale: 0.007,
      roughness: 0.65,
      metalness: 0.03,
      envMapIntensity: 1.4
    })
  }, [currentTextures])

  const rimBaseMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#EFECE6',
      roughness: 0.55,
      metalness: 0.02
    })
  }, [])

  // ------------------------------------------------------------------
  // 6. WEIGHTED INERTIA & 60 FPS INTERACTION LOOP
  // ------------------------------------------------------------------
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    const mouseX = state.mouse.x || 0
    const mouseY = state.mouse.y || 0
    const scrollProgress = Number.isFinite(webglScrollState.progress) ? webglScrollState.progress : 0

    // Combine scroll-derived exploded progress with manual user slider
    const scrollExploded = Number.isFinite(webglScrollState.exploded) ? webglScrollState.exploded : 0
    const userExploded = Number.isFinite(storeExploded) ? storeExploded : 0
    const activeExploded = Math.min(1, Math.max(0, Math.max(scrollExploded, userExploded)))

    // Slow organic sine-wave floating ("breathing") oscillation
    const breathY = Math.sin(time * 1.05) * 0.026
    const breathRotZ = Math.cos(time * 0.8) * 0.012

    // Responsive Spatial Positioning & Refined 3D Proportions
    let targetX = 0
    let targetY = 0 // Centered between ESPR and ESSO in Hero
    let targetZ = 0
    let targetScale = 0.92 // Perfectly balanced commanding scale between ESPR and ESSO

    if (isDesktop) {
      if (scrollProgress < 0.20) {
        // Hero Section: Perfectly balanced commanding scale between ESPR and ESSO
        targetX = 0.0
        targetY = 0.0
        targetScale = 0.92
      } else if (scrollProgress >= 0.20 && scrollProgress < 0.48) {
        // Flavor Selector: Slides elegantly to desktop right
        targetX = 1.25
        targetY = -0.10
        targetScale = 0.88
      } else if (scrollProgress >= 0.48 && scrollProgress < 0.72) {
        // Section 03 ("Dekompoze Hassasiyet"): Staged cleanly on desktop right (x: 1.62) with zero text overlap
        targetX = 1.62
        targetY = -0.05
        targetZ = 0.10
        targetScale = 0.98
      } else {
        // Craft Bento Grid: Peripheral right
        targetX = 0.98
        targetY = -0.10
        targetScale = 0.84
      }
    } else {
      targetScale = 0.80
      targetY = 0.0
    }

    // Heavy inertia damping with lerp rate delta * 4
    const lerpRate = Math.min(1, Math.max(0.01, delta * 3.8))

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX + mouseX * 0.08, lerpRate)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + breathY + mouseY * 0.07, lerpRate)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpRate)
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, lerpRate))

    // Rotation: Deliberate scroll-driven rotation + subtle mouse parallax (no auto-spinning drift)
    const baseRotY = scrollProgress * Math.PI * 2.8 + mouseX * 0.16
    const sectionTiltX = (scrollProgress >= 0.48 && scrollProgress < 0.72) ? 0.35 : 0.0
    const targetRotX = sectionTiltX + mouseY * 0.07 + Math.sin(time * 0.5) * 0.018

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseRotY, lerpRate)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, lerpRate)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, breathRotZ, lerpRate)

    // ------------------------------------------------------------------
    // 7. DYNAMIC LID POP & FLUID ESPRESSO SPLASH ANIMATION
    // ------------------------------------------------------------------
    if (lidRef.current) {
      // Lid elevates +0.65, tilts z: -0.22, x: +0.15, and pops sideways x: -0.12
      const targetLidY = cupHeight / 2 + 0.02 + activeExploded * 0.65
      const targetLidX = -0.12 * activeExploded
      const targetLidRotZ = -0.22 * activeExploded
      const targetLidRotX = 0.15 * activeExploded

      lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, targetLidY, delta * 5)
      lidRef.current.position.x = THREE.MathUtils.lerp(lidRef.current.position.x, targetLidX, delta * 5)
      lidRef.current.rotation.z = THREE.MathUtils.lerp(lidRef.current.rotation.z, targetLidRotZ, delta * 5)
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetLidRotX, delta * 5)
    }

    // Espresso Splash Crown emerging upward from inside the cup
    if (splashCrownRef.current) {
      if (activeExploded > 0.01) {
        splashCrownRef.current.visible = true
        const targetCrownScale = Math.min(1.0, activeExploded * 1.15)
        const targetCrownY = cupHeight / 2 + 0.05 + activeExploded * 0.28

        splashCrownRef.current.position.y = THREE.MathUtils.lerp(splashCrownRef.current.position.y, targetCrownY, delta * 5)
        splashCrownRef.current.scale.y = THREE.MathUtils.lerp(splashCrownRef.current.scale.y, targetCrownScale, delta * 5)
        splashCrownRef.current.scale.x = THREE.MathUtils.lerp(splashCrownRef.current.scale.x, targetCrownScale, delta * 5)
        splashCrownRef.current.scale.z = THREE.MathUtils.lerp(splashCrownRef.current.scale.z, targetCrownScale, delta * 5)
        splashCrownRef.current.rotation.y += delta * 0.8
      } else {
        splashCrownRef.current.visible = false
        splashCrownRef.current.scale.set(0.001, 0.001, 0.001)
      }
    }

    // Flying Espresso Droplets in Zero-G
    if (flyingDropsRef.current) {
      const dummy = new THREE.Object3D()
      dropData.forEach((d, i) => {
        if (activeExploded > 0.02) {
          const p = activeExploded
          const x = d.dirX * (0.28 + p * 0.95)
          const y = cupHeight / 2 + 0.12 + d.dirY * (p * 0.88)
          const z = d.dirZ * (0.28 + p * 0.95)
          const s = d.baseScale * Math.min(1, p * 1.35)

          dummy.position.set(x, y, z)
          dummy.scale.set(s, s * 1.25, s * 0.9)
          dummy.rotation.set(time * 2 + i, time * 1.5, i)
        } else {
          dummy.position.set(0, cupHeight / 2, 0)
          dummy.scale.set(0, 0, 0)
        }
        dummy.updateMatrix()
        flyingDropsRef.current.setMatrixAt(i, dummy.matrix)
      })
      flyingDropsRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.92, 0.92, 0.92]}>
      {/* 1. Tapered Conical Cup Body with Centered Graphic Wave Label Texture */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={[topRadius, bottomRadius, cupHeight, 64, 1, true]}
        />
        <primitive object={cupMaterial} attach="material" />
      </mesh>

      {/* 2. Rolled Upper Lip Rim Bead */}
      <mesh
        geometry={rolledRimGeometry}
        material={rimBaseMaterial}
        position={[0, cupHeight / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* 3. Recessed Cup Base */}
      <mesh
        geometry={recessedBaseGeometry}
        material={rimBaseMaterial}
        position={[0, 0, 0]}
      />

      {/* 4. Inner Dark Espresso Liquid Surface (Visible upon lid lift) */}
      <mesh
        geometry={innerLiquidGeometry}
        material={innerLiquidMaterial}
        position={[0, cupHeight / 2 - 0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* 5. Golden Crema Meniscus Ring */}
      <mesh
        geometry={cremaRingGeometry}
        material={cremaRingMaterial}
        position={[0, cupHeight / 2 - 0.058, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* 6. Procedural 3D Espresso Liquid Crown / Splash */}
      <mesh
        ref={splashCrownRef}
        geometry={splashCrownGeometry}
        material={splashMaterial}
        position={[0, cupHeight / 2 + 0.05, 0]}
        visible={false}
      />

      {/* 7. Flying Zero-G Espresso Droplets (InstancedMesh) */}
      <instancedMesh
        ref={flyingDropsRef}
        args={[dropGeo, splashMaterial, dropCount]}
      />

      {/* 8. Signature Two-Tier Ivory Dome Lid (Elevates & Tilts upon slider/scroll) */}
      <mesh
        ref={lidRef}
        geometry={tieredLidGeometry}
        material={lidMaterial}
        position={[0, cupHeight / 2 + 0.02, 0]}
      />
    </group>
  )
}
