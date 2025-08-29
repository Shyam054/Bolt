'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface TunnelAPIProps {
  scrollProgress: MotionValue<number>;
}

function APITunnel({ scrollProgress }: TunnelAPIProps) {
  const tunnelRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create tunnel particles
  const { positions, colors } = useMemo(() => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      const z = (Math.random() - 0.5) * 40;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;
      
      // Color gradient from blue to lime
      const colorMix = (z + 20) / 40;
      colors[i * 3] = colorMix * 0.8; // R
      colors[i * 3 + 1] = 0.2 + colorMix * 0.8; // G
      colors[i * 3 + 2] = (1 - colorMix) * 1; // B
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (tunnelRef.current && particlesRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Tunnel rotation
      tunnelRef.current.rotation.z = time * 0.1;
      
      // Move through tunnel based on scroll
      tunnelRef.current.position.z = progress * 20 - 10;
      
      // Animate particles flowing through tunnel
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.1; // Move particles forward
        
        // Reset particles that have moved too far
        if (positions[i + 2] > 20) {
          positions[i + 2] = -20;
        }
        
        // Add some swirling motion
        const angle = time * 0.5 + i * 0.01;
        const radius = Math.sqrt(positions[i] * positions[i] + positions[i + 1] * positions[i + 1]);
        positions[i] = Math.cos(angle) * radius;
        positions[i + 1] = Math.sin(angle) * radius;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={tunnelRef}>
      {/* Tunnel structure */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, 0, i * 2 - 20]} rotation={[0, 0, i * 0.1]}>
          <ringGeometry args={[4.5, 5, 32]} />
          <meshBasicMaterial 
            color="#0057ff"
            transparent
            opacity={0.1 + (i / 20) * 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Data flow particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function FloatingAPIText({ scrollProgress }: TunnelAPIProps) {
  const textGroupRef = useRef<THREE.Group>(null);
  
  const apiTexts = [
    { text: 'POST /predict', position: [2, 1, -5] as [number, number, number] },
    { text: 'GET /models', position: [-2, -1, -8] as [number, number, number] },
    { text: 'REST API', position: [0, 2, -12] as [number, number, number] },
    { text: 'Python SDK', position: [3, -2, -15] as [number, number, number] },
    { text: 'Node.js SDK', position: [-3, 1, -18] as [number, number, number] },
  ];
  
  useFrame((state) => {
    if (textGroupRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      textGroupRef.current.children.forEach((child, index) => {
        const text = child as THREE.Group;
        text.position.z = apiTexts[index].position[2] + progress * 10;
        text.rotation.y = Math.sin(time + index) * 0.1;
        
        // Reset position when text moves too far
        if (text.position.z > 10) {
          text.position.z = -20;
        }
      });
    }
  });

  return (
    <group ref={textGroupRef}>
      {apiTexts.map((item, index) => (
        <Text
          key={index}
          position={item.position}
          fontSize={0.4}
          color="#cfff04"
          anchorX="center"
          anchorY="middle"
        >
          {item.text}
        </Text>
      ))}
    </group>
  );
}

function TunnelScene({ scrollProgress }: TunnelAPIProps) {
  const sceneRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (sceneRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Camera movement through tunnel
      state.camera.position.z = 5 - progress * 15;
      state.camera.lookAt(0, 0, -10);
      
      // Gentle scene rotation
      sceneRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
      sceneRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <group ref={sceneRef}>
      <APITunnel scrollProgress={scrollProgress} />
      <FloatingAPIText scrollProgress={scrollProgress} />
      
      {/* Tunnel entrance/exit glow */}
      <mesh position={[0, 0, -20]}>
        <circleGeometry args={[6, 32]} />
        <meshBasicMaterial 
          color="#0057ff"
          transparent
          opacity={0.2}
        />
      </mesh>
      
      <mesh position={[0, 0, 20]}>
        <circleGeometry args={[6, 32]} />
        <meshBasicMaterial 
          color="#cfff04"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

export default function TunnelAPI({ scrollProgress }: TunnelAPIProps) {
  return (
    <Canvas
      camera={{ 
        position: [0, 0, 5], 
        fov: 60,
        near: 0.1,
        far: 1000 
      }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#cfff04" />
      <pointLight position={[0, 0, -10]} intensity={0.5} color="#0057ff" />
      
      <TunnelScene scrollProgress={scrollProgress} />
    </Canvas>
  );
}