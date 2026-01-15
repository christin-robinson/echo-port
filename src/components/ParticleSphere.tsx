import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  
  const count = 3000;
  const radius = 2.5;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.8 + Math.random() * 0.4);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Slow rotation
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = time * 0.02;
    
    // Mouse interaction - attract/repel particles
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    
    const positionsArray = ref.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];
      
      // Calculate distance from mouse in 2D projection
      const dx = ox - mouseX;
      const dy = oy - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Repel effect when mouse is near
      const maxDist = 1.5;
      const strength = Math.max(0, 1 - dist / maxDist);
      const repelStrength = strength * 0.5;
      
      // Add wave motion
      const wave = Math.sin(time * 2 + i * 0.01) * 0.02;
      
      positionsArray[i3] = ox + (dx * repelStrength) + wave;
      positionsArray[i3 + 1] = oy + (dy * repelStrength) + wave;
      positionsArray[i3 + 2] = oz + wave;
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#c9a88a"
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
};

const ParticleSphere = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default ParticleSphere;
