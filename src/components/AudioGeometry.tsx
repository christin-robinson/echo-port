import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, GradientTexture } from "@react-three/drei";
import * as THREE from "three";

interface AnimatedMeshProps {
  scrollProgress: number;
}

const AnimatedMesh = ({ scrollProgress }: AnimatedMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Infinite rotation animation
    meshRef.current.rotation.x = time * 0.2 + scrollProgress * Math.PI;
    meshRef.current.rotation.y = time * 0.3 + scrollProgress * Math.PI * 0.5;
    meshRef.current.rotation.z = time * 0.1;
    
    // Hover effect - scale up and move towards cursor
    const targetScale = hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
    
    // Follow mouse slightly when hovered
    if (hovered) {
      const targetX = (mouse.x * viewport.width) / 8;
      const targetY = (mouse.y * viewport.height) / 8;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    } else {
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.05);
    }
    
    // Scroll effect - move back and scale down
    const scrollScale = 1 - scrollProgress * 0.5;
    meshRef.current.scale.multiplyScalar(scrollScale > 0.3 ? 1 : scrollScale / 0.3);
    meshRef.current.position.z = -scrollProgress * 3;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusKnotGeometry args={[1, 0.35, 200, 32, 2, 3]} />
      <MeshDistortMaterial
        speed={2}
        distort={hovered ? 0.4 : 0.2}
        radius={1}
      >
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={["#c9a88a", "#d4b896", "#a67c52"]}
        />
      </MeshDistortMaterial>
    </mesh>
  );
};

// Floating particles around the main object
const FloatingParticles = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 50;
  
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 2.5 + Math.random() * 0.5;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c9a88a"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

interface AudioGeometryProps {
  scrollProgress?: number;
}

const AudioGeometry = ({ scrollProgress = 0 }: AudioGeometryProps) => {
  return (
    <div className="absolute inset-0 w-full h-full cursor-pointer">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#c9a88a" />
        <AnimatedMesh scrollProgress={scrollProgress} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
};

export default AudioGeometry;
