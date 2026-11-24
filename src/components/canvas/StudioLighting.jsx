import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export default function StudioLighting() {
  const rimLightRef = useRef()
  const { activeFlavorIndex, flavors } = useStore()
  const activeFlavor = flavors[activeFlavorIndex]

  const targetColor = React.useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    targetColor.set(activeFlavor.accentColor || '#C89D7C')
    if (rimLightRef.current) {
      rimLightRef.current.color.lerp(targetColor, 2.5 * delta)
    }
  })

  return (
    <>
      {/* 1. Subtle Ambient Fill (Leaves room for Environment softboxes) */}
      <ambientLight intensity={0.45} color="#FAF7F2" />

      {/* 2. Commercial Product Photography Key Light */}
      <directionalLight
        position={[4.0, 5.0, 3.5]}
        intensity={1.8}
        color="#FFFDF9"
      />

      {/* 3. Soft Opposite Shadow Fill Light */}
      <directionalLight
        position={[-4.0, 0.5, 2.5]}
        intensity={0.65}
        color="#EFE8DE"
      />

      {/* 4. Warm Bronze Rim Accent Spotlight */}
      <spotLight
        ref={rimLightRef}
        position={[-4.5, 3.5, -3.0]}
        angle={0.65}
        penumbra={1}
        intensity={2.8}
        distance={15}
        color="#C89D7C"
      />
    </>
  )
}
