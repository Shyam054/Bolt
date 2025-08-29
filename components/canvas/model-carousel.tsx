'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Box, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface ModelCarouselProps {
  models: Array<{
    name: string;
    author: string;
    downloads: string;
    type: string;
    description: string;
    tags: string[];
    trendingScore: number;
    framework: string;
  }>;
  scrollProgress: MotionValue<number>;
}

function FloatingModel({ position, model, index, scrollProgress }: {
  position: [number, number, number];
  model: any;
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Orbital motion with varying speeds
      const radius = 6 + index * 1.5;
      const speed = 0.3 + index * 0.1;
      const angle = time * speed + index * (Math.PI / 2);
      
      meshRef.current.position.x = Math.cos(angle) * radius;
      meshRef.current.position.z = Math.sin(angle) * radius;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + index) * 0.8;
      
      // Model rotation based on type and trending score
      const rotationSpeed = 0.2 + (model.trendingScore / 100) * 0.3;
      meshRef.current.rotation.x = time * rotationSpeed + index;
      meshRef.current.rotation.y = time * (rotationSpeed * 0.7);
      meshRef.current.rotation.z = Math.sin(time + index) * 0.1;
      
      // Scale based on scroll and trending score
      const baseScale = 0.8 + (model.trendingScore / 100) * 0.4;
      const scale = baseScale + progress * 0.3;
      meshRef.current.scale.setScalar(scale);
      
      // Glow intensity based on trending score
      const glowIntensity = (model.trendingScore / 100) * 0.5 + 0.2;
      glowRef.current.scale.setScalar(scale * 1.2);
      const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
      glowMaterial.opacity = glowIntensity * (0.3 + Math.sin(time * 2) * 0.1);
    }
  });

  const getModelGeometry = (type: string) => {
    switch (type) {
      case 'Language Model':
        return <Box args={[1.2, 1.2, 1.2]} />;
      case 'Computer Vision':
        return <Sphere args={[0.9]} />;
      case 'Audio Processing':
        return <cylinderGeometry args={[0.7, 0.7, 1.4, 8]} />;
      case 'Code Generation':
        return <octahedronGeometry args={[0.9]} />;
      default:
        return <Box args={[1, 1, 1]} />;
    }
  };

  const getModelColor = (type: string, trendingScore: number) => {
    const intensity = Math.min(1, trendingScore / 100);
    switch (type) {
      case 'Language Model':
        return new THREE.Color().setHSL(0.6, 0.8, 0.4 + intensity * 0.3); // Blue spectrum
      case 'Computer Vision':
        return new THREE.Color().setHSL(0.3, 0.9, 0.4 + intensity * 0.3); // Green spectrum
      case 'Audio Processing':
        return new THREE.Color().setHSL(0.5, 0.8, 0.4 + intensity * 0.3); // Cyan spectrum
      case 'Code Generation':
        return new THREE.Color().setHSL(0.0, 0.8, 0.4 + intensity * 0.3); // Red spectrum
      default:
        return new THREE.Color().setHSL(0.7, 0.6, 0.5);
    }
  };

  const modelColor = getModelColor(model.type, model.trendingScore);

  return (
    <>
      <Float speed={1 + index * 0.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <group ref={meshRef} position={position}>
          {/* Main model geometry */}
          <mesh>
            {getModelGeometry(model.type)}
            <meshStandardMaterial 
              color={modelColor}
              transparent
              opacity={0.9}
              emissive={modelColor}
              emissiveIntensity={0.3}
              metalness={0.1}
              roughness={0.2}
            />
          </mesh>
          
          {/* Trending score indicator */}
          {model.trendingScore > 90 && (
            <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial 
                color="#cfff04"
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
          
          {/* Framework indicator */}
          <mesh position={[0, -1.2, 0]} scale={[0.3, 0.1, 0.3]}>
            <boxGeometry />
            <meshBasicMaterial 
              color={model.framework === 'PyTorch' ? '#ee4c2c' : 
                    model.framework === 'TensorFlow' ? '#ff6f00' : 
                    model.framework === 'JAX' ? '#00d4aa' : '#888888'}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      </Float>
      
      {/* Glow effect */}
      <mesh ref={glowRef} position={position}>
        {getModelGeometry(model.type)}
        <meshBasicMaterial 
          color={modelColor}
          transparent
          opacity={0.2}
        />
      </mesh>
    </>
  );
}

function DataConnections({ models, scrollProgress }: {
  models: any[];
  scrollProgress: MotionValue<number>;
}) {
  const connectionsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (connectionsRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      connectionsRef.current.children.forEach((child, index) => {
        const line = child as THREE.Line;
        const material = line.material as THREE.LineBasicMaterial;
        
        // Animate connection opacity based on data flow
        const flowPhase = (time * 2 + index * 0.5) % (Math.PI * 2);
        material.opacity = (Math.sin(flowPhase) * 0.3 + 0.4) * progress;
      });
    }
  });

  const connectionLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < models.length; i++) {
      for (let j = i + 1; j < models.length; j++) {
        if (Math.random() > 0.7) { // Only some connections
          const points = [];
          const radius1 = 6 + i * 1.5;
          const radius2 = 6 + j * 1.5;
          const angle1 = i * (Math.PI / 2);
          const angle2 = j * (Math.PI / 2);
          
          points.push(new THREE.Vector3(
            Math.cos(angle1) * radius1,
            0,
            Math.sin(angle1) * radius1
          ));
          points.push(new THREE.Vector3(
            Math.cos(angle2) * radius2,
            0,
            Math.sin(angle2) * radius2
          ));
          
          lines.push(points);
        }
      }
    }
    return lines;
  }, [models]);

  return (
    <group ref={connectionsRef}>
      {connectionLines.map((points, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00f5ff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
}

function CentralHub({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const hubRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (hubRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Gentle rotation
      hubRef.current.rotation.y = time * 0.1;
      
      // Pulsing based on scroll
      const pulse = 1 + Math.sin(time * 3) * 0.1 + progress * 0.2;
      hubRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={hubRef}>
        {/* Central core */}
        <mesh>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial 
            color="#ffffff"
            transparent
            opacity={0.1}
            wireframe
            emissive="#0057ff"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Inner energy sphere */}
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial 
            color="#cfff04"
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function CarouselScene({ models, scrollProgress }: ModelCarouselProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Slow rotation of entire carousel
      groupRef.current.rotation.y = time * 0.02;
      
      // Vertical movement based on scroll
      groupRef.current.position.y = -progress * 3;
      
      // Camera movement for dynamic viewing
      state.camera.position.y = 2 + Math.sin(time * 0.1) * 0.5;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <CentralHub scrollProgress={scrollProgress} />
      
      {models.map((model, index) => (
        <FloatingModel
          key={index}
          position={[0, index * 2 - 3, 0]}
          model={model}
          index={index}
          scrollProgress={scrollProgress}
        />
      ))}
      
      <DataConnections models={models} scrollProgress={scrollProgress} />
      
      {/* Ambient particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ModelCarousel({ models, scrollProgress }: ModelCarouselProps) {
  return (
    <Canvas
      camera={{ 
        position: [0, 3, 12], 
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
        position={[0, 20, 0]} 
        intensity={0.5} 
        angle={Math.PI / 4}
        penumbra={0.5}
        color="#00f5ff"
      />
      
      <CarouselScene models={models} scrollProgress={scrollProgress} />
    </Canvas>
  );
}