'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface LayerStackProps {
  layers: Array<{
    title: string;
    description: string;
    color: string;
  }>;
  scrollProgress: MotionValue<number>;
}

function StackLayer({ layer, index, scrollProgress }: {
  layer: any;
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Stack animation - layers rise up based on scroll
      const targetY = index * 2 - 3;
      const scrollOffset = Math.max(0, (progress - 0.4) * 5); // Start animation at 40% scroll
      const layerProgress = Math.min(1, Math.max(0, scrollOffset - index * 0.2));
      
      meshRef.current.position.y = -10 + layerProgress * (targetY + 10);
      meshRef.current.rotation.x = (1 - layerProgress) * Math.PI * 0.5;
      meshRef.current.rotation.y = time * 0.1 + index * 0.2;
      
      // Scale and opacity based on reveal
      const scale = 0.5 + layerProgress * 0.5;
      meshRef.current.scale.setScalar(scale);
      
      // Text positioning
      textRef.current.position.copy(meshRef.current.position);
      textRef.current.position.x += 4;
      textRef.current.rotation.y = -meshRef.current.rotation.y * 0.5;
      
      // Glow intensity based on progress
      const material = (meshRef.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = layerProgress * 0.3;
    }
  });

  return (
    <>
      <Float speed={0.5 + index * 0.1} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={meshRef}>
          <Box args={[3, 0.5, 3]}>
            <meshStandardMaterial 
              color={layer.color}
              transparent
              opacity={0.8}
              emissive={layer.color}
              emissiveIntensity={0.1}
            />
          </Box>
          
          {/* Glow effect */}
          <Box args={[3.2, 0.6, 3.2]} position={[0, 0, 0]}>
            <meshBasicMaterial 
              color={layer.color}
              transparent
              opacity={0.1}
            />
          </Box>
          
          {/* Data flow particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh 
              key={i}
              position={[
                (Math.random() - 0.5) * 4,
                0.5 + i * 0.1,
                (Math.random() - 0.5) * 4
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial 
                color={layer.color}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      </Float>
      
      <group ref={textRef}>
        <Text
          fontSize={0.4}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          maxWidth={6}
        >
          {layer.title}
        </Text>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.2}
          color="#cccccc"
          anchorX="left"
          anchorY="middle"
          maxWidth={8}
        >
          {layer.description}
        </Text>
      </group>
    </>
  );
}

function DataFlow({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const flowRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (flowRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Animate data flow between layers
      flowRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        mesh.position.y = -8 + (time * 2 + index * 0.5) % 16;
        mesh.position.x = Math.sin(time + index) * 0.5;
        mesh.position.z = Math.cos(time + index) * 0.5;
        
        // Fade based on position
        const material = mesh.material as THREE.MeshBasicMaterial;
        const alpha = Math.sin((mesh.position.y + 8) / 16 * Math.PI);
        material.opacity = alpha * 0.6 * progress;
      });
    }
  });

  return (
    <group ref={flowRef}>
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.03]} />
          <meshBasicMaterial 
            color="#00f5ff"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function StackScene({ layers, scrollProgress }: LayerStackProps) {
  const sceneRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (sceneRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Gentle scene rotation
      sceneRef.current.rotation.y = time * 0.02;
      
      // Camera zoom based on scroll
      const zoom = 1 + progress * 0.5;
      sceneRef.current.scale.setScalar(zoom);
    }
  });

  return (
    <group ref={sceneRef}>
      {layers.map((layer, index) => (
        <StackLayer
          key={index}
          layer={layer}
          index={index}
          scrollProgress={scrollProgress}
        />
      ))}
      <DataFlow scrollProgress={scrollProgress} />
    </group>
  );
}

export default function LayerStack({ layers, scrollProgress }: LayerStackProps) {
  return (
    <Canvas
      camera={{ 
        position: [8, 2, 8], 
        fov: 50,
        near: 0.1,
        far: 1000 
      }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-10, 5, -10]} intensity={0.4} color="#0057ff" />
      <spotLight 
        position={[0, 15, 0]} 
        intensity={0.8} 
        angle={Math.PI / 3}
        penumbra={0.5}
        color="#cfff04"
      />
      
      <StackScene layers={layers} scrollProgress={scrollProgress} />
    </Canvas>
  );
}