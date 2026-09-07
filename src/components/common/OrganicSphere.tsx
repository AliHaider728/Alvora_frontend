"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Environment, Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const SphereBlob = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.8}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial
          color="#F5EDE4"
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.1}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
};

export const OrganicSphere = () => {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FAF6F2" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#C87355" />
        
        <SphereBlob />
        
        {/* Adds organic floating particles around the sphere */}
        <Sparkles count={80} scale={8} size={2} speed={0.4} opacity={0.3} color="#C87355" />
        
        {/* Soft shadow underneath */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
