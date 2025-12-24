import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState } from '../types';

interface TopStarProps {
  appState: AppState;
}

export const TopStar: React.FC<TopStarProps> = ({ appState }) => {
  const ref = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Rotate slowly
    ref.current.rotation.y += delta * 0.5;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;

    // Visibility / Position Transition
    const targetScale = appState === AppState.TREE_SHAPE ? 1.5 : 0;
    const currentScale = ref.current.scale.x;
    
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 3);
    ref.current.scale.setScalar(newScale);
    
    // Pulse emission
    if (materialRef.current) {
        materialRef.current.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 3) * 1;
    }
  });

  // Adjusted Y position to 5.1 (slightly lower to sit snug on the tip)
  return (
    <group ref={ref} position={[0, 5.1, 0]}>
      {/* Core Star - Reduced size from 1 to 0.5 */}
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      {/* Halo Glow Ring - Reduced radius from 1.5 to 0.8 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.03, 16, 100]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};