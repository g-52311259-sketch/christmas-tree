import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Sparkles } from '@react-three/drei';
import { MagicParticles } from './MagicParticles';
import { TopStar } from './TopStar';
import { Snow } from './Snow';
import { Effects } from './Effects';
import { AppState } from '../types';
import * as THREE from 'three';

interface ExperienceProps {
  appState: AppState;
  onInteraction: () => void;
}

export const Experience: React.FC<ExperienceProps> = ({ appState, onInteraction }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle rotation of the whole system
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
  });

  return (
    <>
      <color attach="background" args={['#000502']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} color="#FFD700" castShadow />
      <pointLight position={[-10, -10, -10]} intensity={5} color="#50C878" />

      {/* Camera Controls */}
      <OrbitControls 
        enablePan={false} 
        maxPolarAngle={Math.PI / 1.5} 
        minPolarAngle={Math.PI / 3}
        maxDistance={25}
        minDistance={8}
      />

      <group ref={groupRef}>
        <MagicParticles appState={appState} onInteraction={onInteraction} />
        <TopStar appState={appState} />
        <Snow />
        
        {/* Extra ambient sparkles */}
        <Sparkles 
          count={100} 
          scale={15} 
          size={4} 
          speed={0.4} 
          opacity={0.5} 
          color="#FFD700" 
        />
      </group>

      <Effects />
      
      {/* Environment for reflections on metallic surfaces */}
      <Environment preset="city" />
    </>
  );
};
