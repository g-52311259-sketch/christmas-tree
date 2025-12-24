import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 1200;

export const Snow: React.FC = () => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate a procedural snowflake texture using HTML Canvas
  const snowflakeTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 128, 128);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#ffffff';
    
    ctx.translate(64, 64);

    // Draw a symmetric 6-sided snowflake
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -50);
      
      // Outer branch
      ctx.moveTo(0, -40);
      ctx.lineTo(15, -55);
      ctx.moveTo(0, -40);
      ctx.lineTo(-15, -55);
      
      // Inner branch
      ctx.moveTo(0, -25);
      ctx.lineTo(20, -35);
      ctx.moveTo(0, -25);
      ctx.lineTo(-20, -35);
      
      ctx.stroke();
      ctx.rotate(Math.PI / 3);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const factor = 20 + Math.random() * 20; // Spread area
      const speed = 0.05 + Math.random() * 0.1;
      const xFactor = (Math.random() - 0.5) * 60;
      const yFactor = (Math.random() - 0.5) * 40;
      const zFactor = (Math.random() - 0.5) * 60;
      
      // Random rotation velocities
      const rotX = (Math.random() - 0.5) * 2;
      const rotY = (Math.random() - 0.5) * 2;
      const rotZ = (Math.random() - 0.5) * 2;

      temp.push({ 
        t: Math.random() * 100, 
        factor, 
        speed, 
        xFactor, 
        yFactor, 
        zFactor,
        rotX,
        rotY,
        rotZ,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      // Update time
      particle.t += particle.speed * delta * 5; // Adjust speed multiplier
      
      // Falling Logic
      let y = particle.yFactor - (particle.t % 60) + 30;
      if (y < -20) {
        y += 60; // Loop back up
      }

      // Horizontal drift
      const x = particle.xFactor + Math.sin(particle.t * 0.5) * 2;
      const z = particle.zFactor + Math.cos(particle.t * 0.3) * 2;

      dummy.position.set(x, y, z);

      // Tumbling rotation
      particle.rotation.x += particle.rotX * delta;
      particle.rotation.y += particle.rotY * delta;
      particle.rotation.z += particle.rotZ * delta;
      dummy.rotation.copy(particle.rotation);

      // Pulse size slightly
      const s = 1 + Math.sin(particle.t * 2) * 0.2;
      dummy.scale.setScalar(0.4 * s);

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      {/* Plane geometry to hold the snowflake texture */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={snowflakeTexture || undefined}
        color={[2.5, 3, 3]} // Cool white glow
        toneMapped={false}
        transparent
        opacity={0.9}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};
