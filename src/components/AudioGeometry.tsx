import { useRef, useState, useMemo, forwardRef } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// Custom Dolby Atmos Wave Material with spatial audio visualization
class AtmosWaveMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uColor1: { value: new THREE.Color("#1a1a2e") },
        uColor2: { value: new THREE.Color("#0f3460") },
        uColor3: { value: new THREE.Color("#e94560") },
        uColor4: { value: new THREE.Color("#16213e") },
        uAtmosIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vElevation;
        uniform float uTime;
        uniform float uHover;
        uniform float uAtmosIntensity;
        
        // Simplex noise function for organic waves
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          
          vec3 pos = position;
          
          // Multi-layer Dolby Atmos spatial waves
          float atmosLayer1 = snoise(pos * 2.0 + uTime * 0.5) * 0.15;
          float atmosLayer2 = snoise(pos * 4.0 - uTime * 0.3) * 0.08;
          float atmosLayer3 = snoise(pos * 8.0 + uTime * 0.7) * 0.04;
          
          // Spatial audio rings (Dolby Atmos signature)
          float phi = atan(pos.y, pos.x);
          float theta = acos(pos.z / length(pos));
          float spatialRing = sin(theta * 8.0 + uTime * 2.0) * 0.05;
          spatialRing += sin(phi * 6.0 - uTime * 1.5) * 0.03;
          
          // Height channels simulation (Atmos overhead effect)
          float heightChannel = sin(pos.z * 5.0 + uTime * 1.8) * 0.06;
          
          // Combine all spatial audio layers
          float totalWave = (atmosLayer1 + atmosLayer2 + atmosLayer3 + spatialRing + heightChannel) * uAtmosIntensity;
          totalWave *= (1.0 + uHover * 0.8);
          
          pos += normal * totalWave;
          vElevation = totalWave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vElevation;
        uniform float uTime;
        uniform float uHover;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        
        void main() {
          // Dolby Atmos spatial frequency bands
          float lowFreq = sin(vUv.x * 4.0 + uTime * 1.0) * 0.5 + 0.5;
          float midFreq = sin(vUv.y * 8.0 - uTime * 1.5) * 0.5 + 0.5;
          float highFreq = sin((vUv.x + vUv.y) * 16.0 + uTime * 2.0) * 0.5 + 0.5;
          float ultraFreq = sin(length(vUv - 0.5) * 32.0 - uTime * 3.0) * 0.5 + 0.5;
          
          // Atmos surround pattern
          float surroundPattern = sin(atan(vPosition.y, vPosition.x) * 8.0 + uTime) * 0.5 + 0.5;
          
          // Height layer visualization
          float heightLayer = smoothstep(-1.0, 1.0, vPosition.z) * 0.5 + 0.5;
          
          // Combine frequency bands with spatial awareness
          float pattern = lowFreq * 0.3 + midFreq * 0.25 + highFreq * 0.25 + ultraFreq * 0.2;
          pattern = mix(pattern, surroundPattern, 0.3);
          
          // Dynamic color based on spatial position and elevation
          vec3 color = mix(uColor1, uColor2, pattern);
          color = mix(color, uColor3, vElevation * 5.0 + 0.3);
          color = mix(color, uColor4, heightLayer * 0.2);
          
          // Atmos signature glow pulses
          float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
          float glowIntensity = ultraFreq * pulse * 0.3;
          color += uColor3 * glowIntensity * (1.0 + uHover);
          
          // Interactive shimmer
          float shimmer = sin(vUv.x * 60.0 + uTime * 6.0) * sin(vUv.y * 60.0 - uTime * 5.0);
          color += shimmer * uHover * 0.15 * uColor3;
          
          // Fresnel rim lighting (spatial edge definition)
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
          color += uColor3 * fresnel * 0.5;
          
          // Add subtle ambient occlusion
          float ao = smoothstep(-0.5, 0.5, vElevation) * 0.3 + 0.7;
          color *= ao;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
  }
}

extend({ AtmosWaveMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      atmosWaveMaterial: any;
    }
  }
}

interface AnimatedMeshProps {
  scrollProgress: number;
}

const AnimatedMesh = forwardRef<THREE.Group, AnimatedMeshProps>(({ scrollProgress }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<AtmosWaveMaterial>(null);
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
    
    // Smooth orbital rotation like Dolby Atmos visualization
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.3 + scrollProgress * Math.PI;
    meshRef.current.rotation.y = time * 0.15 + scrollProgress * Math.PI * 0.5;
    meshRef.current.rotation.z = Math.cos(time * 0.1) * 0.2;
    
    // Breathing scale effect
    const breathe = Math.sin(time * 0.8) * 0.05 + 1;
    const targetScale = hovered ? 1.2 * breathe : breathe;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );
    
    // Follow mouse slightly when hovered
    if (hovered) {
      const targetX = (mouse.x * viewport.width) / 12;
      const targetY = (mouse.y * viewport.height) / 12;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.04);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.04);
    } else {
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.04);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.04);
    }
    
    // Scroll effect
    meshRef.current.position.z = -scrollProgress * 3;
    const scrollScale = Math.max(0.3, 1 - scrollProgress * 0.7);
    materialRef.current.uniforms.uAtmosIntensity.value = scrollScale;
  });

  return (
    <group ref={ref}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[1.8, 128]} />
        <atmosWaveMaterial ref={materialRef} />
      </mesh>
    </group>
  );
});

AnimatedMesh.displayName = "AnimatedMesh";

// Dolby Atmos spatial audio rings
const AtmosRings = forwardRef<THREE.Group>((_, ref) => {
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ringsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    ringsRef.current.children.forEach((ring, i) => {
      ring.rotation.x = time * 0.2 * (i % 2 === 0 ? 1 : -1);
      ring.rotation.y = time * 0.15 * (i % 2 === 0 ? -1 : 1);
      ring.rotation.z = time * 0.1;
      
      // Pulsing scale for spatial effect
      const pulse = Math.sin(time * 1.5 + i * 0.5) * 0.1 + 1;
      ring.scale.setScalar(pulse);
    });
  });

  const rings = useMemo(() => {
    return [
      { radius: 2.5, tube: 0.008, color: "#e94560", opacity: 0.4 },
      { radius: 2.8, tube: 0.006, color: "#0f3460", opacity: 0.3 },
      { radius: 3.1, tube: 0.01, color: "#e94560", opacity: 0.25 },
      { radius: 3.4, tube: 0.005, color: "#16213e", opacity: 0.2 },
    ];
  }, []);

  return (
    <group ref={ref}>
      <group ref={ringsRef}>
        {rings.map((ring, index) => (
          <mesh key={index} rotation={[Math.PI / 2 + index * 0.3, index * 0.2, 0]}>
            <torusGeometry args={[ring.radius, ring.tube, 16, 100]} />
            <meshBasicMaterial 
              color={ring.color} 
              transparent 
              opacity={ring.opacity}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
});

AtmosRings.displayName = "AtmosRings";

// Floating audio particles
const AudioParticles = forwardRef<THREE.Group>((_, ref) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3 + Math.random() * 2;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    particlesRef.current.rotation.y = time * 0.05;
    particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <group ref={ref}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#e94560"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
});

AudioParticles.displayName = "AudioParticles";

interface AudioGeometryProps {
  scrollProgress: number;
}

const AudioGeometry = ({ scrollProgress }: AudioGeometryProps) => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#e94560" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#0f3460" />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <AnimatedMesh scrollProgress={scrollProgress} />
        </Float>
        
        <AtmosRings />
        <AudioParticles />
        
        <Stars 
          radius={50} 
          depth={50} 
          count={1000} 
          factor={2} 
          saturation={0} 
          fade 
          speed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default AudioGeometry;
