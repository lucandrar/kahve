import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Procedural Hyper-Realistic Arabica Coffee Bean Geometry Generator
 * Deforms a high-segment sphere by flattening the ventral side, elongating along Z,
 * and carving a realistic S-curved central furrow (crease) using vertex displacement.
 */
function createRealisticArabicaBeanGeometry() {
  const geo = new THREE.SphereGeometry(1, 36, 28)
  const pos = geo.attributes.position
  const count = pos.count

  for (let i = 0; i < count; i++) {
    let x = pos.getX(i)
    let y = pos.getY(i)
    let z = pos.getZ(i)

    // 1. Natural Arabica elongated proportions
    z *= 1.48
    x *= 0.94
    y *= 0.72

    // 2. Ventral Flat Underside with S-curved Furrow
    if (y < 0) {
      y *= 0.36 // Flatten towards zero

      // Characteristic S-curved central furrow
      const sCurve = Math.sin(z * 1.5) * 0.075 + Math.sin(z * 3.0) * 0.02
      const distToCrease = Math.abs(x - sCurve)

      // Carve deep inward crease along furrow
      if (distToCrease < 0.28) {
        const furrowIndent = Math.pow(1 - distToCrease / 0.28, 1.8) * 0.42
        y += furrowIndent // Pull deeply inward into the bean
      }
    } else {
      // Dorsal back dome: smooth natural curvature
      y *= (1 + 0.06 * (1 - Math.abs(x)))
    }

    // Subtle taper towards the bean poles
    const endTaper = 1 - Math.pow(Math.min(1, Math.abs(z) / 1.48), 2.2) * 0.22
    x *= endTaper
    y *= endTaper

    pos.setXYZ(i, x, y, z)
  }

  geo.computeVertexNormals()
  return geo
}

/**
 * Procedural Bump Map Generator for Roasted Coffee Beans
 * Generates organic roasted micro-pores, fine expansion fissures, and surface texture.
 */
function createBeanBumpTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Neutral gray base
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 512)

  // Organic micro-pores
  for (let i = 0; i < 2000; i++) {
    const px = Math.random() * 512
    const py = Math.random() * 512
    const r = 0.5 + Math.random() * 1.6
    const dark = Math.random() > 0.5
    ctx.fillStyle = dark ? 'rgba(40, 40, 40, 0.22)' : 'rgba(190, 190, 190, 0.22)'
    ctx.beginPath()
    ctx.arc(px, py, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Roasted expansion fissures / micro-cracks
  ctx.strokeStyle = 'rgba(35, 35, 35, 0.28)'
  ctx.lineWidth = 1.2
  for (let j = 0; j < 30; j++) {
    const startX = Math.random() * 512
    const startY = Math.random() * 512
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + (Math.random() - 0.5) * 45, startY + (Math.random() - 0.5) * 45)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  tex.needsUpdate = true
  return tex
}

function RoastedBeanItem({ geometry, material, position, rotation, scale, rotSpeed }) {
  const meshRef = useRef()

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += rotSpeed.x * delta
    meshRef.current.rotation.y += rotSpeed.y * delta
    meshRef.current.rotation.z += rotSpeed.z * delta
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

export default function FloatingParticles() {
  const groupRef = useRef()

  const beanGeometry = useMemo(() => createRealisticArabicaBeanGeometry(), [])
  const bumpTexture = useMemo(() => createBeanBumpTexture(), [])

  // Authentic Roasted Oil Sheen Material (MeshPhysicalMaterial with clearcoat)
  const beanMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#24130D', // Deep dark roasted coffee
      roughness: 0.35,
      metalness: 0.08,
      clearcoat: 0.28, // Roasted aromatic coffee oil sheen
      clearcoatRoughness: 0.18,
      bumpMap: bumpTexture,
      bumpScale: 0.035,
      envMapIntensity: 1.4
    })
  }, [bumpTexture])

  // 5 Sculpted Beans Positioned in Strategic Multi-Depth Planes
  const beans = useMemo(() => [
    { pos: [-2.1, 1.4, 0.4], rot: [0.6, 0.4, 0.3], scale: 0.28, rotSpeed: { x: 0.22, y: 0.32, z: 0.14 } },
    { pos: [2.3, -0.8, -0.6], rot: [0.2, 0.9, 0.5], scale: 0.25, rotSpeed: { x: -0.28, y: 0.18, z: -0.22 } },
    { pos: [1.9, 1.6, -1.2], rot: [0.8, -0.5, 0.4], scale: 0.22, rotSpeed: { x: 0.18, y: -0.28, z: 0.25 } },
    { pos: [-1.9, -1.2, -0.8], rot: [-0.4, 0.7, 0.2], scale: 0.24, rotSpeed: { x: -0.2, y: 0.3, z: 0.16 } },
    { pos: [0.4, 2.3, -1.4], rot: [1.1, 0.3, -0.6], scale: 0.20, rotSpeed: { x: 0.16, y: -0.2, z: 0.12 } }
  ], [])

  // Delicate Golden / Bronze Dust Motes
  const motesCount = 45
  const motesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(motesCount * 3)
    for (let i = 0; i < motesCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 7.5
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.5
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geo
  }, [motesCount])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    const mouseX = state.mouse.x * 0.1
    const mouseY = state.mouse.y * 0.1

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, mouseX, 1.5, delta)
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, mouseY, 1.5, delta)
    groupRef.current.rotation.y = time * 0.02
  })

  return (
    <group ref={groupRef}>
      {beans.map((b, idx) => (
        <RoastedBeanItem
          key={idx}
          geometry={beanGeometry}
          material={beanMaterial}
          position={b.pos}
          rotation={b.rot}
          scale={b.scale}
          rotSpeed={b.rotSpeed}
        />
      ))}

      {/* Floating Golden Motes catching studio rim lights */}
      <points geometry={motesGeo}>
        <pointsMaterial
          size={0.038}
          color="#C89D7C"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
