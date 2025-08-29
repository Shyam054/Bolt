'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesExplodeProps {
  isExploding: boolean;
}

function ExplosionParticles({ isExploding }: ParticlesExplodeProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const explosionStartTime = useRef<number>(0);
  
  const { positions, velocities, colors } = useMemo(() => {
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Start all particles at center
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      // Random explosion velocities
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const speed = 2 + Math.random() * 8;
      
      velocities[i * 3] = Math.sin(theta) * Math.cos(phi) * speed;
      velocities[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * speed;
      velocities[i * 3 + 2] = Math.cos(theta) * speed;
      
      // Color gradient from blue to lime to white
      const colorType = Math.random();
      if (colorType < 0.33) {
        colors[i * 3] = 0; // Blue
        colors[i * 3 + 1] = 0.3;
        colors[i * 3 + 2] = 1;
      } else if (colorType < 0.66) {
        colors[i * 3] = 0.8; // Lime
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0;
      } else {
        colors[i * 3] = 1; // White
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
    }
    
    return { positions, velocities, colors };
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      
      if (isExploding && explosionStartTime.current === 0) {
        explosionStartTime.current = time;
      }
      
      if (!isExploding) {
        explosionStartTime.current = 0;
      }
      
      const explosionTime = explosionStartTime.current > 0 ? time - explosionStartTime.current : 0;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        if (isExploding && explosionTime > 0) {
          // Explosion animation
          positions[i] = velocities[i] * explosionTime;
          positions[i + 1] = velocities[i + 1] * explosionTime - 0.5 * 9.8 * explosionTime * explosionTime; // Gravity
          positions[i + 2] = velocities[i + 2] * explosionTime;
        } else {
          // Reset to center
          positions[i] = 0;
          positions[i + 1] = 0;
          positions[i + 2] = 0;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Fade particles over time
      const material = particlesRef.current.material as THREE.PointsMaterial;
      if (isExploding && explosionTime > 0) {
        material.opacity = Math.max(0, 1 - explosionTime / 2);
        material.size = 0.1 + explosionTime * 0.05;
      } else {
        material.opacity = 0;
        material.size = 0.1;
      }
    }
  });

  return (
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
        size={0.1}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ShockWave({ isExploding }: ParticlesExplodeProps) {
  const shockRef = useRef<THREE.Mesh>(null);
  const explosionStartTime = useRef<number>(0);
  
  useFrame((state) => {
    if (shockRef.current) {
      const time = state.clock.elapsedTime;
      
      if (isExploding && explosionStartTime.current === 0) {
        explosionStartTime.current = time;
      }
      
      if (!isExploding) {
        explosionStartTime.current = 0;
      }
      
      const explosionTime = explosionStartTime.current > 0 ? time - explosionStartTime.current : 0;
      
      if (isExploding && explosionTime > 0) {
        // Expand shockwave
        const scale = explosionTime * 5;
        shockRef.current.scale.setScalar(scale);
        
        // Fade out
        const material = shockRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = Math.max(0, 0.5 - explosionTime / 2);
      } else {
        // Reset
        shockRef.current.scale.setScalar(0);
        const material = shockRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = 0;
      }
    }
  });

  return (
    <mesh ref={shockRef}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshBasicMaterial 
        color="#cfff04"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ExplosionScene({ isExploding }: ParticlesExplodeProps) {
  return (
    <group>
      <ExplosionParticles isExploding={isExploding} />
      <ShockWave isExploding={isExploding} />
      
      {/* Central flash */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={isExploding ? 1 : 0}
        />
      </mesh>
    </group>
  );
}

export default function ParticlesExplode({ isExploding }: ParticlesExplodeProps) {
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
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />
      
      <ExplosionScene isExploding={isExploding} />
    </Canvas>
  );
}