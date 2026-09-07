"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Glass Bubble that responds to mouse ─── */
const GlassBubble = ({ scrollY }: { scrollY: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth mouse follow
    smoothMouse.current.x += (mousePos.current.x - smoothMouse.current.x) * 0.05;
    smoothMouse.current.y += (mousePos.current.y - smoothMouse.current.y) * 0.05;

    // Gentle rotation
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.1 + smoothMouse.current.y * 0.15;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08 + smoothMouse.current.x * 0.15;
    meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;

    // Subtle breathing scale
    const breathe = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
    meshRef.current.scale.setScalar(2.2 * breathe);
  });

  return (
    <mesh ref={meshRef} scale={2.2}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshTransmissionMaterial
        backside
        samples={16}
        resolution={512}
        transmission={1}
        roughness={0.05}
        thickness={0.3}
        ior={1.5}
        chromaticAberration={0.06}
        anisotropy={0.1}
        distortion={0.0}
        distortionScale={0.3}
        temporalDistortion={0.0}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor="#F5EDE4"
        color="#FFFFFF"
        toneMapped={true}
      />
    </mesh>
  );
};

/* ─── Inner floating particles ─── */
const InnerParticles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    particles.current = Array.from({ length: 30 }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.5 + Math.random() * 1.2;
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.current.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02 + Math.random() * 0.03, 8, 8]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#C87355' : i % 3 === 1 ? '#F5EDE4' : '#E8D5C4'}
            transparent
            opacity={0.6}
            emissive={i % 3 === 0 ? '#C87355' : '#F5EDE4'}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ─── Main Scene ─── */
const Scene = ({ scrollY }: { scrollY: number }) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#FAF6F2" />
      <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#C87355" />
      <pointLight position={[0, 5, 0]} intensity={1} color="#F5EDE4" />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <GlassBubble scrollY={scrollY} />
        <InnerParticles />
      </Float>

      <Sparkles
        count={60}
        scale={6}
        size={1.5}
        speed={0.3}
        opacity={0.2}
        color="#C87355"
      />

      <Environment preset="city" />
    </>
  );
};

/* ─── Exported Component ─── */
export const OrganicSphere = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (rect.height || 1)));
        setScrollY(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'auto' }}
      >
        <Scene scrollY={scrollY} />
      </Canvas>
    </div>
  );
};
