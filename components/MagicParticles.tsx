import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState } from '../types';

interface MagicParticlesProps {
  appState: AppState;
  onInteraction: () => void;
}

const COUNT = 1800; // Number of particles
// Reduced dimensions to fit screen better
const TREE_HEIGHT = 10;
const TREE_RADIUS = 4;

// Emerald and Gold palette - Lighter & More Luxurious
const COLORS = [
  '#50C878', // Emerald Green
  '#2E8B57', // Sea Green (Classic Emerald)
  '#85FFBD', // Light Emerald / Mint Neon
  '#FFD700', // Gold
  '#FDB931', // Deep Gold
  '#FFFACD', // Lemon Chiffon (Bright Highlight)
];

const tempObject = new THREE.Object3D();
const tempVec3 = new THREE.Vector3();
const tempTarget = new THREE.Vector3();

export const MagicParticles: React.FC<MagicParticlesProps> = ({ appState, onInteraction }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // --- Dual Position System Calculation ---
  const particles = useMemo(() => {
    const data: {
      scatterPos: THREE.Vector3;
      treePos: THREE.Vector3;
      scale: number;
      color: THREE.Color;
      speed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < COUNT; i++) {
      // 1. SCATTER POSITION (Random Sphere)
      const rScatter = 15 * Math.cbrt(Math.random());
      const thetaScatter = Math.random() * 2 * Math.PI;
      const phiScatter = Math.acos(2 * Math.random() - 1);
      
      const xS = rScatter * Math.sin(phiScatter) * Math.cos(thetaScatter);
      const yS = rScatter * Math.sin(phiScatter) * Math.sin(thetaScatter);
      const zS = rScatter * Math.cos(phiScatter);

      // 2. TREE POSITION (Conical Spiral)
      // Normalized height (0 to 1)
      const hNorm = Math.random(); 
      // Height from bottom (-height/2) to top (height/2)
      const yT = (hNorm * TREE_HEIGHT) - (TREE_HEIGHT / 2);
      
      // Radius at this height (Cone shape: linearly decreasing radius)
      const rT = (1 - hNorm) * TREE_RADIUS;
      
      // Spiral angle + random jitter for volume
      const spiralAngle = hNorm * 15 * Math.PI + (Math.random() * Math.PI * 2);
      
      // Push out slightly random to create volume, not a hollow shell
      const rFinal = rT * (0.8 + Math.random() * 0.4);

      const xT = rFinal * Math.cos(spiralAngle);
      const zT = rFinal * Math.sin(spiralAngle);

      // Attributes
      const scale = Math.random() * 0.4 + 0.1;
      
      // Distribution: 30% Gold/Bright, 70% Emerald shades
      const isGold = Math.random() > 0.7; 
      
      const colorHex = isGold 
        ? COLORS[3 + Math.floor(Math.random() * 3)] // Select from Golds
        : COLORS[Math.floor(Math.random() * 3)];   // Select from Greens

      data.push({
        scatterPos: new THREE.Vector3(xS, yS, zS),
        treePos: new THREE.Vector3(xT, yT, zT),
        scale: isGold ? scale * 1.8 : scale, // Ornaments are bigger
        color: new THREE.Color(colorHex),
        speed: 0.5 + Math.random(),
        phase: Math.random() * Math.PI * 2
      });
    }
    return data;
  }, []);

  // Initialize colors once
  useEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < COUNT; i++) {
        meshRef.current.setColorAt(i, particles[i].color);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [particles]);

  // Ref to store the current blend value [0...1]
  const blendRef = useRef(0); 

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const targetBlend = appState === AppState.TREE_SHAPE ? 1 : 0;
    // Smooth damp towards target blend
    blendRef.current = THREE.MathUtils.lerp(blendRef.current, targetBlend, delta * 2.5); // 2.5 speed

    const t = blendRef.current;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];

      // Interpolate between scatter and tree positions
      tempVec3.lerpVectors(p.scatterPos, p.treePos, t);

      // Add noise/movement
      const floatX = Math.cos(time * p.speed + p.phase) * (1 - t) * 0.5; // More movement when scattered
      const floatY = Math.sin(time * p.speed + p.phase) * 0.2; 
      
      tempObject.position.set(
        tempVec3.x + floatX,
        tempVec3.y + floatY,
        tempVec3.z
      );

      // Rotation: Spin when scattered, orient slightly upwards when tree
      const rotSpeed = time * p.speed * 0.5 * (1 - t * 0.8);
      tempObject.rotation.set(rotSpeed, rotSpeed, rotSpeed);
      
      // Scale: Pop in effect on start, slight pulse
      tempObject.scale.setScalar(p.scale);

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, COUNT]}
      onClick={(e) => {
        e.stopPropagation();
        onInteraction();
      }}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial
        toneMapped={false}
        color="#ffffff"
        roughness={0.1}
        metalness={0.9}
        emissive="#001a00"
        emissiveIntensity={0.1}
      />
    </instancedMesh>
  );
};