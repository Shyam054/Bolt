'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface UploadOrbitsProps {
  scrollProgress: MotionValue<number>;
}

function FileTypeOrbit({ fileType, index, scrollProgress }: {
  fileType: { name: string; color: string; shape: string };
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Orbital motion around center
      const radius = 4 + index * 0.5;
      const speed = 0.5 + index * 0.1;
      const angle = time * speed + index * (Math.PI * 2 / 8);
      
      meshRef.current.position.x = Math.cos(angle) * radius;
      meshRef.current.position.z = Math.sin(angle) * radius;
      meshRef.current.position.y = Math.sin(time + index) * 0.5;
      
      // Self rotation
      meshRef.current.rotation.x = time * 0.3 + index;
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.z = time * 0.1;
      
      // Scale based on scroll
      const scale = 0.8 + progress * 0.4;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const getShape = (shape: string) => {
    switch (shape) {
      case 'box':
        return <Box args={[0.6, 0.6, 0.6]} />;
      case 'sphere':
        return <Sphere args={[0.4]} />;
      case 'cylinder':
        return <Cylinder args={[0.3, 0.3, 0.8]} />;
      default:
        return <Box args={[0.6, 0.6, 0.6]} />;
    }
  };

  return (
    <Float speed={1 + index * 0.1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={meshRef}>
        <mesh>
          {getShape(fileType.shape)}
          <meshStandardMaterial 
            color={fileType.color}
            transparent
            opacity={0.8}
            emissive={fileType.color}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* File type label */}
        <Text
          position={[0, -1, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {fileType.name}
        </Text>
        
        {/* Orbit trail */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4 + index * 0.5 - 0.02, 4 + index * 0.5 + 0.02, 64]} />
          <meshBasicMaterial 
            color={fileType.color}
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

function CentralUploadHub({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const hubRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (hubRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Gentle rotation
      hubRef.current.rotation.y = time * 0.1;
      
      // Pulsing scale
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      hubRef.current.scale.setScalar(pulse);
      
      // Glow intensity
      const material = (hubRef.current.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.1;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={hubRef}>
        {/* Main upload sphere */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#0057ff"
            transparent
            opacity={0.7}
            emissive="#0057ff"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Inner core */}
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial 
            color="#cfff04"
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Upload icon representation */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.2, 0.4, 0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <coneGeometry args={[0.15, 0.3, 3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Upload text */}
        <Text
          position={[0, -2, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          UPLOAD
        </Text>
      </group>
    </Float>
  );
}

function DataStreams({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const streamsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (streamsRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      streamsRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        const angle = (time + index * 0.5) % (Math.PI * 2);
        const radius = 2 + Math.sin(time + index) * 0.5;
        
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.position.y = Math.sin(time * 2 + index) * 2;
        
        // Fade based on distance from center
        const distance = mesh.position.length();
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = Math.max(0, 1 - distance / 5) * progress;
      });
    }
  });

  return (
    <group ref={streamsRef}>
      {Array.from({ length: 100 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.02]} />
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

function OrbitScene({ scrollProgress }: UploadOrbitsProps) {
  const sceneRef = useRef<THREE.Group>(null);
  
  const fileTypes = [
    { name: 'CSV', color: '#4CAF50', shape: 'box' },
    { name: 'JSON', color: '#FF9800', shape: 'sphere' },
    { name: 'ONNX', color: '#2196F3', shape: 'cylinder' },
    { name: 'PKL', color: '#9C27B0', shape: 'box' },
    { name: 'H5', color: '#F44336', shape: 'sphere' },
    { name: 'PT', color: '#00BCD4', shape: 'cylinder' },
    { name: 'TF', color: '#FFEB3B', shape: 'box' },
    { name: 'ZIP', color: '#795548', shape: 'sphere' },
  ];
  
  useFrame((state) => {
    if (sceneRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Scene rotation
      sceneRef.current.rotation.y = time * 0.02;
      
      // Vertical movement based on scroll
      sceneRef.current.position.y = -progress * 1;
    }
  });

  return (
    <group ref={sceneRef}>
      <CentralUploadHub scrollProgress={scrollProgress} />
      
      {fileTypes.map((fileType, index) => (
        <FileTypeOrbit
          key={index}
          fileType={fileType}
          index={index}
          scrollProgress={scrollProgress}
        />
      ))}
      
      <DataStreams scrollProgress={scrollProgress} />
    </group>
  );
}

export default function UploadOrbits({ scrollProgress }: UploadOrbitsProps) {
  return (
    <Canvas
      camera={{ 
        position: [0, 5, 10], 
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
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#0057ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#cfff04" />
      <spotLight 
        position={[0, 15, 0]} 
        intensity={0.8} 
        angle={Math.PI / 4}
        penumbra={0.5}
        color="#00f5ff"
      />
      
      <OrbitScene scrollProgress={scrollProgress} />
    </Canvas>
  );
}