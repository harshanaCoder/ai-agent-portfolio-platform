"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import type { ProjectData } from "@/lib/mainData";

type ProjectSceneCanvasProps = {
  project: ProjectData;
  zoomLevel?: number;
};

function CameraZoomController({ zoomLevel }: { zoomLevel: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const direction = camera.position.clone().normalize();
    const targetDistance = THREE.MathUtils.clamp(6 / zoomLevel, 3.2, 11);
    const targetPosition = direction.multiplyScalar(targetDistance);

    camera.position.lerp(targetPosition, 0.12);
  });

  return null;
}

function GlbSceneModel({ modelPath }: { modelPath: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelPath);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = clock.getElapsedTime() * 0.28;
  });

  return (
    <group ref={groupRef} position={[0, -1.1, 0]}>
      <primitive object={model} scale={1.65} />
    </group>
  );
}

export function ProjectSceneCanvas({ project, zoomLevel = 1 }: ProjectSceneCanvasProps) {
  const hasGlbModel = Boolean(project.model3d?.glb);

  return (
    <div
      className="relative h-[24rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,222,255,0.12),transparent_42%),linear-gradient(180deg,rgba(2,6,23,0.6),rgba(15,23,42,0.9))]"
      role="region"
      aria-label={`${project.title} 3D model viewer`}
    >
      <Canvas camera={{ position: [0, 1.6, 6], fov: 46 }} dpr={[1, 1.75]}>
        <CameraZoomController zoomLevel={zoomLevel} />
        <ambientLight intensity={1.1} />
        <pointLight position={[4, 5, 5]} color="#4adeff" intensity={24} />
        <pointLight position={[-4, -2, 4]} color="#855cff" intensity={18} />
        <spotLight position={[0, 6, 0]} intensity={20} angle={0.45} penumbra={1} color="#ffffff" />
        <gridHelper args={[12, 18, "#124b65", "#102033"]} position={[0, -1.3, 0]} />
        {hasGlbModel ? (
          <Suspense fallback={null}>
            <GlbSceneModel modelPath={project.model3d!.glb} />
          </Suspense>
        ) : null}
        <OrbitControls enablePan minDistance={3.2} maxDistance={11} minPolarAngle={0.8} maxPolarAngle={2.1} enableDamping dampingFactor={0.08} />
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-cyan-300/20 bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100 backdrop-blur">
        {hasGlbModel ? "GLB model loaded" : "Rotate and inspect"}
      </div>
    </div>
  );
}
