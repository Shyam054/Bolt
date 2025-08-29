'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface NeuralInfinityProps {
  scrollProgress: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

function NeuralNetwork({ scrollProgress, mousePosition }: NeuralInfinityProps) {
  const ref = useRef<THREE.Points>(null);
  const connectionsRef = useRef<THREE.LineSegments>(null);
  const synapseRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  
  // Generate neural network nodes with synaptic connections
  const { positions, connections, synapses } = useMemo(() => {
    const nodeCount = 800;
    const positions = new Float32Array(nodeCount * 3);
    const connectionLines = [];
    const synapsePositions = [];
    const nodes = [];
    
    // Create nodes in 3D space with clustering
    for (let i = 0; i < nodeCount; i++) {
      const cluster = Math.floor(i / 100);
      const clusterX = (cluster % 4 - 1.5) * 8;
      const clusterY = (Math.floor(cluster / 4) - 1) * 6;
      const clusterZ = Math.sin(cluster * 0.5) * 4;
      
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = clusterX + radius * Math.sin(phi) * Math.cos(theta);
      const y = clusterY + radius * Math.sin(phi) * Math.sin(theta);
      const z = clusterZ + radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      nodes.push({ x, y, z, index: i, cluster });
    }
    
    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2) +
          Math.pow(nodes[i].z - nodes[j].z, 2)
        );
        
        // Higher connection probability within clusters
        const connectionProb = nodes[i].cluster === nodes[j].cluster ? 0.4 : 0.1;
        
        if (distance < 4 && Math.random() < connectionProb) {
          connectionLines.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
          
          // Add synapse points along connections
          const midX = (nodes[i].x + nodes[j].x) / 2;
          const midY = (nodes[i].y + nodes[j].y) / 2;
          const midZ = (nodes[i].z + nodes[j].z) / 2;
          synapsePositions.push(midX, midY, midZ);
        }
      }
    }
    
    return { 
      positions, 
      connections: new Float32Array(connectionLines),
      synapses: new Float32Array(synapsePositions)
    };
  }, []);

  useFrame((state) => {
    if (ref.current && connectionsRef.current && synapseRef.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      // Camera movement based on scroll and mouse
      camera.position.x = mousePosition.x * 2 + Math.sin(time * 0.1) * 0.5;
      camera.position.y = mousePosition.y * 2 + Math.cos(time * 0.15) * 0.3;
      camera.position.z = 8 - progress * 12; // Zoom into network on scroll
      camera.lookAt(0, 0, 0);
      
      // Neural network rotation and morphing
      ref.current.rotation.x = time * 0.02 + progress * 0.5;
      ref.current.rotation.y = time * 0.01 + mousePosition.x * 0.1;
      ref.current.rotation.z = Math.sin(time * 0.05) * 0.1;
      
      // Scale expansion based on scroll
      const expansionFactor = 1 + progress * 3;
      ref.current.scale.setScalar(expansionFactor);
      
      // Morphing effect
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = positions[i];
        const originalY = positions[i + 1];
        const originalZ = positions[i + 2];
        
        // Neural firing simulation
        const fireIntensity = Math.sin(time * 2 + originalX * 0.1 + originalY * 0.1) * 0.5 + 0.5;
        const morphFactor = progress * fireIntensity * 0.3;
        
        positions[i] = originalX + Math.sin(time + originalY * 0.3) * morphFactor;
        positions[i + 1] = originalY + Math.cos(time + originalX * 0.3) * morphFactor;
        positions[i + 2] = originalZ + Math.sin(time * 0.5 + originalX * originalY * 0.05) * morphFactor;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      
      // Animate connections
      connectionsRef.current.rotation.copy(ref.current.rotation);
      connectionsRef.current.scale.copy(ref.current.scale);
      
      const connectionMaterial = connectionsRef.current.material as THREE.LineBasicMaterial;
      connectionMaterial.opacity = 0.2 + progress * 0.6;
      
      // Animate synapses (firing neurons)
      synapseRef.current.rotation.copy(ref.current.rotation);
      synapseRef.current.scale.copy(ref.current.scale);
      
      const synapseMaterial = synapseRef.current.material as THREE.PointsMaterial;
      synapseMaterial.opacity = 0.8 + Math.sin(time * 4) * 0.2;
      synapseMaterial.size = 0.02 + Math.sin(time * 3) * 0.01;
    }
  });

  return (
    <group>
      {/* Main neural nodes */}
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#0057ff"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.9}
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
          color="#00f5ff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Synaptic firing points */}
      <Points ref={synapseRef} positions={synapses} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#cfff04"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function BackgroundParticles({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const ref = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const progress = scrollProgress.get();
      const time = state.clock.elapsedTime;
      
      ref.current.rotation.x = time * 0.01;
      ref.current.rotation.y = time * 0.005;
      
      // Particle drift
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.001) * 0.002;
        positions[i] += Math.cos(time + positions[i + 2] * 0.001) * 0.001;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      
      // Fade based on scroll
      const material = ref.current.material as THREE.PointsMaterial;
      material.opacity = 0.3 - progress * 0.2;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.001}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function NeuralInfinity({ scrollProgress, mousePosition }: NeuralInfinityProps) {
  return (
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
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#0057ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#cfff04" />
      <pointLight position={[0, 10, -10]} intensity={0.4} color="#00f5ff" />
      
      <NeuralNetwork scrollProgress={scrollProgress} mousePosition={mousePosition} />
      <BackgroundParticles scrollProgress={scrollProgress} />
      
      {/* Floating data nodes */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[8, 4, -2]}>
          <octahedronGeometry args={[0.3]} />
          <meshBasicMaterial color="#cfff04" transparent opacity={0.6} />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[-6, -3, 1]}>
          <icosahedronGeometry args={[0.2]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.7} />
        </mesh>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.7} floatIntensity={0.4}>
        <mesh position={[4, -5, -3]}>
          <tetrahedronGeometry args={[0.25]} />
          <meshBasicMaterial color="#0057ff" transparent opacity={0.5} />
        </mesh>
      </Float>
    </Canvas>
  );
}