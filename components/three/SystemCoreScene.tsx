"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HeroFallback } from "@/components/three/HeroFallback";

interface SystemCoreProps {
  reducedMotion: boolean;
}

/**
 * Inner Crystalline Nucleus with wireframe facets and translucent obsidian core.
 */
function CentralCore({ reducedMotion }: { reducedMotion: boolean }) {
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const wireMeshRef = useRef<THREE.LineSegments>(null);

  // Wireframe edges geometry from icosahedron
  const { geometry, wireGeometry } = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1.6, 0);
    const wireGeom = new THREE.WireframeGeometry(geom);
    return { geometry: geom, wireGeometry: wireGeom };
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y += delta * 0.12;
      coreMeshRef.current.rotation.x += delta * 0.06;
    }
    if (wireMeshRef.current) {
      wireMeshRef.current.rotation.y += delta * 0.12;
      wireMeshRef.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <group>
      {/* Dark Translucent Obsidian Polyhedron */}
      <mesh ref={coreMeshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#0B0D0E"
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* High-Precision Cyan Wireframe Facets */}
      <lineSegments ref={wireMeshRef} geometry={wireGeometry}>
        <lineBasicMaterial
          color="#63C7D9"
          transparent
          opacity={0.65}
          linewidth={1}
        />
      </lineSegments>

      {/* Internal Luminous Quantum Anchor */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#63C7D9" />
      </mesh>
    </group>
  );
}

/**
 * Concentric Counter-Rotating Topological Coordinate Rings.
 */
function TopologicalRings({ reducedMotion }: { reducedMotion: boolean }) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  const { outerGeom, innerGeom } = useMemo(() => {
    const outer = new THREE.RingGeometry(2.4, 2.44, 64);
    const inner = new THREE.RingGeometry(3.1, 3.13, 64);
    return { outerGeom: outer, innerGeom: inner };
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.08;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.05;
    }
  });

  return (
    <group>
      {/* Primary Equatorial Ring */}
      <mesh
        ref={outerRingRef}
        geometry={outerGeom}
        rotation={[Math.PI / 3, 0, 0]}
      >
        <meshBasicMaterial
          color="#2C8799"
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Tilted Oblique Orbital Ring */}
      <mesh
        ref={innerRingRef}
        geometry={innerGeom}
        rotation={[-Math.PI / 4, Math.PI / 6, 0]}
      >
        <meshBasicMaterial
          color="#3D4347"
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

/**
 * Deterministic Distributed System Node Cluster & Network Telemetry Lines.
 */
function NodeNetwork({ reducedMotion }: { reducedMotion: boolean }) {
  const networkGroupRef = useRef<THREE.Group>(null);

  // Generate 28 deterministic coordinate points representing infrastructure nodes
  const { points, lineGeometry } = useMemo(() => {
    const count = 28;
    const pts: THREE.Vector3[] = [];
    const linePositions: number[] = [];

    // Deterministic pseudo-random generation to avoid chaotic layout shifts
    for (let i = 0; i < count; i++) {
      const u = (i * 1.6180339887) % 1;
      const v = i / count;
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const radius = 2.2 + ((i % 5) * 0.35);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
      const z = radius * Math.cos(phi);
      pts.push(new THREE.Vector3(x, y, z));
    }

    // Interconnecting telemetry lines between proximate nodes
    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i]!;
      for (let j = i + 1; j < pts.length; j++) {
        const p2 = pts[j]!;
        const dist = p1.distanceTo(p2);
        if (dist < 1.9) {
          linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        }
      }
    }

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    return { points: pts, lineGeometry: lineGeom };
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion || !networkGroupRef.current) return;
    networkGroupRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={networkGroupRef}>
      {/* Node Geometry Spheres */}
      {points.map((pt, idx) => (
        <mesh key={idx} position={pt}>
          <sphereGeometry args={[idx % 4 === 0 ? 0.05 : 0.035, 12, 12]} />
          <meshBasicMaterial
            color={idx % 4 === 0 ? "#63C7D9" : "#4EBA87"}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Mesh Telemetry Links */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#292D30"
          transparent
          opacity={0.5}
        />
      </lineSegments>
    </group>
  );
}

/**
 * Scene Root with Mouse Parallax & Scroll Reaction.
 */
function SystemCoreRoot({ reducedMotion }: SystemCoreProps) {
  const rootRef = useRef<THREE.Group>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const scrollTilt = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX.current = normX * 0.25;
      targetY.current = normY * 0.2;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      scrollTilt.current = Math.min(scrollY * 0.0003, 0.15);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [reducedMotion]);

  useFrame(() => {
    if (!rootRef.current) return;

    if (reducedMotion) {
      rootRef.current.rotation.set(0.1, 0.2, 0);
      return;
    }

    // Smooth lerp / damping for restrained mouse parallax and scroll reaction
    rootRef.current.rotation.y += (targetX.current - rootRef.current.rotation.y) * 0.05;
    rootRef.current.rotation.x +=
      (targetY.current + scrollTilt.current - rootRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={rootRef}>
      <CentralCore reducedMotion={reducedMotion} />
      <TopologicalRings reducedMotion={reducedMotion} />
      <NodeNetwork reducedMotion={reducedMotion} />
    </group>
  );
}

/**
 * SystemCoreScene — Enterprise 3D Hero Core with WebGL fail-safe and reduced motion.
 */
export function SystemCoreScene() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect WebGL capability safely
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl2") ||
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }

    // Detect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Graceful fallback if WebGL is unsupported or failed
  if (hasWebGL === false) {
    return <HeroFallback />;
  }

  // Initial SSR mount / hydration safety
  if (hasWebGL === null) {
    return <HeroFallback />;
  }

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] flex items-center justify-center overflow-hidden rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 backdrop-blur-xs select-none"
    >
      <Canvas
        aria-hidden="true"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 8.5], fov: 42 }}
        className="w-full h-full block"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-4, -4, -4]} intensity={0.8} color="#63C7D9" />

        <SystemCoreRoot reducedMotion={reducedMotion} />
      </Canvas>

      {/* Engineering HUD Telemetry Details */}
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            reducedMotion ? "bg-[#4EBA87]" : "bg-[#63C7D9] animate-pulse"
          }`}
        />
        <span className="text-[10px] font-mono tracking-widest text-[#A6AAAC] uppercase">
          {reducedMotion
            ? "SYS_CORE: DETERMINISTIC // STATIC_VIEW"
            : "SYS_CORE: DETERMINISTIC // 28 NODES"}
        </span>
      </div>

      <div className="absolute bottom-3 right-4 pointer-events-none text-right">
        <span className="text-[10px] font-mono text-[#6E7376]">
          {reducedMotion ? "REDUCED_MOTION: ON" : "R3F_CORE: 60FPS // ASSURED"}
        </span>
      </div>
    </div>
  );
}
