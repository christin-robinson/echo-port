import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";

// Custom shader material for wave texture
class WaveMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uColor1: { value: new THREE.Color("#c9a88a") },
        uColor2: { value: new THREE.Color("#a67c52") },
        uColor3: { value: new THREE.Color("#d4b896") },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float uTime;
        uniform float uHover;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          
          // Wave distortion on vertices
          vec3 pos = position;
          float wave = sin(pos.x * 3.0 + uTime * 2.0) * 0.1;
          wave += sin(pos.y * 4.0 + uTime * 1.5) * 0.08;
          wave += sin(pos.z * 2.5 + uTime * 2.5) * 0.06;
          pos += normal * wave * (1.0 + uHover * 0.5);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float uTime;
        uniform float uHover;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        
        void main() {
          // Create wave pattern
          float wave1 = sin(vUv.x * 20.0 + uTime * 3.0) * 0.5 + 0.5;
          float wave2 = sin(vUv.y * 15.0 - uTime * 2.0) * 0.5 + 0.5;
          float wave3 = sin((vUv.x + vUv.y) * 10.0 + uTime * 2.5) * 0.5 + 0.5;
          
          // Combine waves
          float pattern = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3;
          
          // Add ripple effect from center
          float dist = length(vUv - 0.5);
          float ripple = sin(dist * 30.0 - uTime * 4.0) * 0.5 + 0.5;
          pattern = mix(pattern, ripple, 0.3);
          
          // Color mixing based on pattern
          vec3 color = mix(uColor1, uColor2, pattern);
          color = mix(color, uColor3, wave3 * 0.5);
          
          // Add shimmer on hover
          float shimmer = sin(vUv.x * 50.0 + uTime * 5.0) * sin(vUv.y * 50.0 + uTime * 4.0);
          color += shimmer * uHover * 0.1;
          
          // Fresnel effect for edge glow
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.0);
          color += uColor3 * fresnel * 0.3;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
  }
}

extend({ WaveMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waveMaterial: any;
    }
  }
}

interface AnimatedMeshProps {
  scrollProgress: number;
}

const AnimatedMesh = ({ scrollProgress }: AnimatedMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<WaveMaterial>(null);
  const { mouse, viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uHover.value,
      hovered ? 1 : 0,
      0.1
    );
    
    // Infinite rotation animation
    meshRef.current.rotation.x = time * 0.15 + scrollProgress * Math.PI;
    meshRef.current.rotation.y = time * 0.25 + scrollProgress * Math.PI * 0.5;
    meshRef.current.rotation.z = time * 0.08;
    
    // Hover effect - scale up
    const targetScale = hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
    
    // Follow mouse slightly when hovered
    if (hovered) {
      const targetX = (mouse.x * viewport.width) / 10;
      const targetY = (mouse.y * viewport.height) / 10;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    } else {
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.05);
    }
    
    // Scroll effect
    meshRef.current.position.z = -scrollProgress * 3;
    const scrollScale = Math.max(0.3, 1 - scrollProgress * 0.7);
    meshRef.current.scale.multiplyScalar(scrollScale);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusKnotGeometry args={[1, 0.4, 256, 64, 2, 3]} />
      <waveMaterial ref={materialRef} />
    </mesh>
  );
};

// Animated wave rings around the object
const WaveRings = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringCount = 3;
  
  const rings = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => ({
      radius: 2 + i * 0.5,
      tube: 0.02,
      offset: i * 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    groupRef.current.children.forEach((ring, i) => {
      ring.rotation.x = Math.sin(time * 0.5 + i) * 0.3;
      ring.rotation.y = time * 0.2 * (i % 2 === 0 ? 1 : -1);
      const scale = 1 + Math.sin(time * 2 + i * 0.5) * 0.1;
      ring.scale.set(scale, scale, scale);
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.radius, ring.tube, 16, 100]} />
          <meshBasicMaterial 
            color="#c9a88a" 
            transparent 
            opacity={0.3 - i * 0.08} 
          />
        </mesh>
      ))}
    </group>
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
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#c9a88a" />
        <AnimatedMesh scrollProgress={scrollProgress} />
        <WaveRings />
      </Canvas>
    </div>
  );
};

export default AudioGeometry;
