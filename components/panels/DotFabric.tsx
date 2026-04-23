"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Fabric() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const COLS = 25;
  const ROWS = 16;
  const COUNT = COLS * ROWS;
  const spacing = 0.5;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    // initialize color buffer
    for (let i = 0; i < COUNT; i++) {
      tmpColor.setRGB(1, 1, 1);
      meshRef.current.setColorAt(i, tmpColor);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [COUNT, tmpColor]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!meshRef.current) return;
    let i = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = (x - COLS / 2) * spacing;
        const py = (y - ROWS / 2) * spacing;
        const d = Math.sqrt(px * px + py * py);
        const z =
          Math.sin(d * 1.4 - t * 1.8) * 0.6 + Math.sin(px * 0.6 + t) * 0.2;
        dummy.position.set(px, py, z);
        const s = 0.06 + Math.max(0, z) * 0.06;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);

        const tt = (Math.sin(d - t) + 1) * 0.5;
        tmpColor.setHSL(0.7 + tt * 0.15, 0.7, 0.55 + Math.max(0, z) * 0.1);
        meshRef.current.setColorAt(i, tmpColor);
        i++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

export default function DotFabric() {
  return (
    <div className="relative h-full w-full bg-void-bg">
      <Canvas
        camera={{ position: [0, 2, 7], fov: 55 }}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#050508"]} />
        <fog attach="fog" args={["#050508", 6, 14]} />
        <Fabric />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(5,5,8,0.9) 100%)",
        }}
      />
    </div>
  );
}
