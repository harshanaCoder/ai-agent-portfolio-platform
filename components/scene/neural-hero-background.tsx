"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ─────────────────────────── Shaders ─────────────────────────── */

const corePulseVertex = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  uniform float uTime;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Subtle vertex displacement for organic breathing
    float displacement = sin(position.x * 3.0 + uTime * 1.2) *
                         cos(position.y * 2.5 + uTime * 0.9) *
                         sin(position.z * 2.0 + uTime * 1.5) * 0.06;
    vDisplacement = displacement;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const corePulseFragment = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  uniform float uTime;
  uniform float uHover;

  void main() {
    // Fresnel-based edge glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, 2.2);

    // Teal core color with amber highlights
    vec3 tealCore = vec3(0.18, 0.88, 0.78);
    vec3 amberHigh = vec3(1.0, 0.72, 0.42);

    // Animate color pulse
    float pulse = sin(uTime * 0.8) * 0.5 + 0.5;
    vec3 baseColor = mix(tealCore, amberHigh, pulse * 0.25 + vDisplacement * 2.0);

    // Glow intensity
    float glowIntensity = fresnel * (1.2 + uHover * 0.6);
    vec3 finalColor = baseColor * glowIntensity;

    // Alpha based on fresnel for transparency
    float alpha = fresnel * (0.7 + pulse * 0.2) + 0.08;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/* ────────────────── Inner Glowing Core ──────────────────── */

const innerCoreFragment = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, 3.0);

    vec3 teal = vec3(0.18, 0.88, 0.78);
    float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
    float alpha = fresnel * (0.3 + pulse * 0.15);

    gl_FragColor = vec4(teal * 1.5, alpha);
  }
`;

const innerCoreVertex = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* ────────────────── Neural Core (Icosahedron) ──────────────── */

function NeuralCore({ hoverIntensity }: { hoverIntensity: React.RefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 }
    }),
    []
  );

  const innerUniforms = useMemo(
    () => ({
      uTime: { value: 0 }
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    coreUniforms.uTime.value = t;
    coreUniforms.uHover.value = THREE.MathUtils.lerp(
      coreUniforms.uHover.value,
      hoverIntensity.current ?? 0,
      0.05
    );
    innerUniforms.uTime.value = t;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12;
      meshRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.08;
      innerRef.current.rotation.z = t * 0.06;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.12;
      wireRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;
    }
  });

  const wireGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.52, 1);
    return new THREE.EdgesGeometry(geo);
  }, []);

  return (
    <group>
      {/* Main icosahedron with custom shader */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <shaderMaterial
          vertexShader={corePulseVertex}
          fragmentShader={corePulseFragment}
          uniforms={coreUniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wireframe overlay */}
      <lineSegments ref={wireRef} geometry={wireGeo}>
        <lineBasicMaterial
          color="#4de9d3"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Inner glow sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <shaderMaterial
          vertexShader={innerCoreVertex}
          fragmentShader={innerCoreFragment}
          uniforms={innerUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ────────────────── Orbiting Data Rings ──────────────── */

function DataRing({
  radius,
  speed,
  tiltX,
  tiltZ,
  color,
  particleCount
}: {
  radius: number;
  speed: number;
  tiltX: number;
  tiltZ: number;
  color: string;
  particleCount: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [radius, particleCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * speed;
    }
    // Animate individual particles along ring
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const baseAngle = (i / particleCount) * Math.PI * 2 + t * speed * 2;
        arr[i * 3] = Math.cos(baseAngle) * radius;
        arr[i * 3 + 2] = Math.sin(baseAngle) * radius;
        arr[i * 3 + 1] = Math.sin(baseAngle * 3 + t) * 0.06;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} rotation={[tiltX, 0, tiltZ]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={color}
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ────────────────── Ambient Floating Particles ──────────────── */

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap around bounds
      if (Math.abs(arr[i * 3]) > 7) velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 4) velocities[i * 3 + 1] *= -1;
      if (Math.abs(arr[i * 3 + 2]) > 3) velocities[i * 3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#4de9d3"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ────────────────── Connection Lines (Neural Network) ──────────────── */

function NeuralConnections() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const positions = useMemo(() => {
    const nodeCount = 32;
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 4
        )
      );
    }

    const edges: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 3.0 && edges.length < 300) {
          edges.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }

    return new Float32Array(edges);
  }, []);

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffb86a"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* ────────────────── Mouse Parallax Controller ──────────────── */

function SceneController({ hoverIntensity }: { hoverIntensity: React.RefObject<number> }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 7.5));

  useFrame(({ pointer }) => {
    // Mouse parallax on the camera
    targetPos.current.x = pointer.x * 0.8;
    targetPos.current.y = pointer.y * 0.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPos.current.x, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPos.current.y, 0.03);
    camera.lookAt(0, 0, 0);

    // Calculate hover intensity based on pointer proximity to center
    const dist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
    if (hoverIntensity.current !== undefined) {
      (hoverIntensity as React.MutableRefObject<number>).current = Math.max(0, 1 - dist);
    }
  });

  return null;
}

/* ────────────────── Main Exported Component ──────────────── */

export function NeuralHeroBackground() {
  const [renderCanvas, setRenderCanvas] = useState(false);
  const hoverIntensity = useRef(0);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewportQuery = window.matchMedia("(max-width: 960px)");

    const updateMode = () => {
      setRenderCanvas(!reduceMotionQuery.matches && !compactViewportQuery.matches);
    };

    updateMode();
    reduceMotionQuery.addEventListener("change", updateMode);
    compactViewportQuery.addEventListener("change", updateMode);

    return () => {
      reduceMotionQuery.removeEventListener("change", updateMode);
      compactViewportQuery.removeEventListener("change", updateMode);
    };
  }, []);

  if (!renderCanvas) {
    return (
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_84%_20%,rgba(255,184,106,0.14),transparent_30%),radial-gradient(circle_at_18%_24%,rgba(47,224,200,0.16),transparent_36%)]" />
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 52 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#0b1117"]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 4, 5]} intensity={18} color="#2fe0c8" distance={20} decay={2} />
        <pointLight position={[-4, -2, 3]} intensity={12} color="#ffb86a" distance={18} decay={2} />
        <pointLight position={[0, 0, 4]} intensity={8} color="#4de9d3" distance={12} decay={2} />

        {/* Central Neural Core */}
        <NeuralCore hoverIntensity={hoverIntensity} />

        {/* Orbiting Data Rings */}
        <DataRing radius={2.4} speed={0.3} tiltX={0.5} tiltZ={0.2} color="#4de9d3" particleCount={80} />
        <DataRing radius={3.2} speed={-0.2} tiltX={-0.3} tiltZ={0.6} color="#ffb86a" particleCount={60} />
        <DataRing radius={4.0} speed={0.15} tiltX={0.8} tiltZ={-0.3} color="#a78bfa" particleCount={50} />

        {/* Background elements */}
        <FloatingParticles />
        <NeuralConnections />

        {/* Mouse parallax */}
        <SceneController hoverIntensity={hoverIntensity} />
      </Canvas>
    </div>
  );
}