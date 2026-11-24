import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import CoffeeCup from './CoffeeCup'
import FloatingParticles from './FloatingParticles'
import StudioLighting from './StudioLighting'

export default function Scene() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05
        }}
        className="w-full h-full"
      >
        {/* Directional Key, Fill & Accent Spotlights */}
        <StudioLighting />

        {/* Commercial Studio Softbox HDRI Rig */}
        <Environment resolution={256}>
          {/* 1. Left Vertical Softbox Strip (Warm Cream Specular Highlight) */}
          <Lightformer
            form="rect"
            intensity={2.8}
            color="#FFF8EE"
            position={[-3.6, 0.2, 2.0]}
            scale={[1.2, 8.5, 1]}
            target={[0, 0, 0]}
          />

          {/* 2. Right Vertical Softbox Strip (Cool White Specular Highlight) */}
          <Lightformer
            form="rect"
            intensity={2.5}
            color="#F0F4FF"
            position={[3.6, 0.2, 1.6]}
            scale={[1.0, 8.5, 1]}
            target={[0, 0, 0]}
          />

          {/* 3. Overhead Ring Lightformer (Catches the Ivory Lid's Tiered Ridges) */}
          <Lightformer
            form="ring"
            intensity={3.2}
            color="#FFFFFF"
            position={[0, 4.6, 0.2]}
            scale={[4.2, 4.2, 1]}
            target={[0, 0, 0]}
          />

          {/* 4. Warm Amber Backlight / Bottom Kick Lightformer */}
          <Lightformer
            form="rect"
            intensity={1.8}
            color="#C89D7C"
            position={[0, -2.4, -3.2]}
            scale={[6.0, 3.2, 1]}
            target={[0, 0, 0]}
          />
        </Environment>

        {/* 3D Chilled Coffee Cup with Tiered Lid & Wave Label strictly at world [0, 0, 0] */}
        <CoffeeCup />

        {/* Floating Roasted Coffee Beans in Zero-G */}
        <FloatingParticles />

        {/* Soft Commercial Contact Shadows Grounding the Cup */}
        <ContactShadows
          position={[0, -1.26, 0]}
          opacity={0.38}
          scale={5.8}
          blur={2.4}
          far={3.0}
          color="#1A110D"
        />
      </Canvas>
    </div>
  )
}
