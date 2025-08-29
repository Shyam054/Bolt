'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface NeuralNetworkProps {
  scrollProgress: MotionValue<number>;
}

function NeuralNetwork({ scrollProgress }: NeuralNetworkProps) {
  const ref = useRef<THREE.Points>(null);
  const sphereRef = useRef<THREE.Group>(null);
  const connectionsRef = useRef<THREE.LineSegments>(null);
  
  // Generate neural network nodes
  const { positions, connections } = useMemo(() => {
    const nodeCount = 200;
    const positions = new Float32Array(nodeCount * 3);
    const connectionLines = [];
    const nodes = [];
    
    // Create nodes in 3D space
    for (let i = 0; i < nodeCount; i++) {
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      nodes.push({ x, y, z, index: i });
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2) +
          Math.pow(nodes[i].z - nodes[j].z, 2)
        );
        
        if (distance < 2.5 && Math.random() > 0.7) {
          connectionLines.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    
    return { 
      positions, 
      connections: new Float32Array(connectionLines) 
    };
  }, []);

  useFrame((state) => {
    if (ref.current && sphereRef.current && connectionsRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Base rotation
      ref.current.rotation.x = time * 0.05;
      ref.current.rotation.y = time * 0.02;
      
      // Scroll-based transformations
      const expansionFactor = 1 + progress * 2;
      const morphFactor = Math.sin(progress * Math.PI * 2) * 0.3;
      
      // Scale the entire network based on scroll
      ref.current.scale.setScalar(expansionFactor);
      
      // Morph the network shape
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = positions[i];
        const originalY = positions[i + 1];
        const originalZ = positions[i + 2];
        
        // Add wave-like morphing
        positions[i] = originalX + Math.sin(time + originalY * 0.5) * morphFactor;
        positions[i + 1] = originalY + Math.cos(time + originalX * 0.5) * morphFactor;
        positions[i + 2] = originalZ + Math.sin(time + originalX * originalY * 0.1) * morphFactor;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      
      // Animate connections
      if (connectionsRef.current) {
        connectionsRef.current.rotation.x = time * 0.03;
        connectionsRef.current.rotation.y = time * 0.01;
        connectionsRef.current.scale.setScalar(expansionFactor);
        
        // Fade connections based on scroll
        const material = connectionsRef.current.material as THREE.LineBasicMaterial;
        material.opacity = 0.3 + progress * 0.4;
      }
      
      // Floating spheres animation
      if (sphereRef.current) {
        sphereRef.current.rotation.x = time * 0.1;
        sphereRef.current.rotation.y = time * 0.05;
        sphereRef.current.scale.setScalar(1 + progress * 0.5);
        
        sphereRef.current.children.forEach((child, index) => {
          const sphere = child as THREE.Mesh;
          sphere.position.y = Math.sin(time + index) * (1 + progress);
          sphere.rotation.x = time + index;
          sphere.rotation.z = time * 0.5 + index;
        });
      }
    }
  });

  return (
    <group>
      {/* Main neural network points */}
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#0057ff"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Neural connections */}
      <lineSegments ref={connectionsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length / 3}
            array={connections}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#cfff04"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Floating accent spheres */}
      <group ref={sphereRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 0.8) * 6,
              Math.cos(i * 0.6) * 4,
              Math.sin(i * 0.4) * 3,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color="#cfff04" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ParticleField({ scrollProgress }: NeuralNetworkProps) {
  const ref = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      ref.current.rotation.x = time * 0.02;
      ref.current.rotation.y = time * 0.01;
      
      // Scroll-based particle movement
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.01) * 0.001;
        positions[i] += Math.cos(time + positions[i + 2] * 0.01) * 0.001;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      
      // Fade particles based on scroll
      const material = ref.current.material as THREE.PointsMaterial;
      material.opacity = 0.4 + progress * 0.3;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.002}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

interface ScrollReactiveBackgroundProps {
  scrollProgress: MotionValue<number>;
}

export default function ScrollReactiveBackground({ scrollProgress }: ScrollReactiveBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
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
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#0057ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#cfff04" />
        <pointLight position={[0, 10, -10]} intensity={0.2} color="#ffffff" />
        
        <NeuralNetwork scrollProgress={scrollProgress} />
        <ParticleField scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}