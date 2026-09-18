"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * HeroScene — Interactive WebGL canvas component.
 *
 * Storytelling purpose:
 * Visualizes a deterministic distributed computing topology: dynamic interconnected nodes
 * communicating across high-assurance data pathways with subtle mouse responsiveness.
 *
 * Performance & Accessibility:
 * - Automatically pauses render loop when scrolled out of viewport (IntersectionObserver).
 * - Detects prefers-reduced-motion and freezes animation into a static, pristine composition.
 * - Non-intrusive: restrained color palette, subtle rotation, no harsh flashes.
 * - aria-hidden="true" ensures screen readers skip the canvas element directly.
 */
export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0d0e, 0.05);

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);
    camera.position.set(0, 0, 14);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch {
      // Fallback if WebGL creation fails
      return;
    }

    // Node & Topology Generation
    const nodeCount = 42;
    const nodePositions: THREE.Vector3[] = [];
    const geometryPoints = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    const cyanColor = new THREE.Color("#63C7D9");
    const darkCyanColor = new THREE.Color("#2C8799");
    const mutedColor = new THREE.Color("#3D4347");

    for (let i = 0; i < nodeCount; i++) {
      const radius = 3.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = (radius * Math.sin(phi) * Math.sin(theta)) * 0.7; // slightly flattened ellipsoid
      const z = radius * Math.cos(phi);

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      geometryPoints[i * 3] = x;
      geometryPoints[i * 3 + 1] = y;
      geometryPoints[i * 3 + 2] = z;

      // Color assignment: core nodes highlight cyan, outer peripheral nodes muted
      const nodeColor = i % 4 === 0 ? cyanColor : i % 3 === 0 ? darkCyanColor : mutedColor;
      colors[i * 3] = nodeColor.r;
      colors[i * 3 + 1] = nodeColor.g;
      colors[i * 3 + 2] = nodeColor.b;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(geometryPoints, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(pointCloud);

    // Dynamic Connection Lines (Inter-node mesh)
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDistance = 2.4;

    for (let i = 0; i < nodeCount; i++) {
      const p1 = nodePositions[i];
      if (!p1) continue;

      for (let j = i + 1; j < nodeCount; j++) {
        const p2 = nodePositions[j];
        if (!p2) continue;

        const dist = p1.distanceTo(p2);
        if (dist < maxDistance) {
          linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);

          const alpha = 1 - dist / maxDistance;
          const c = i % 2 === 0 ? cyanColor : darkCyanColor;
          lineColors.push(c.r * alpha, c.g * alpha, c.b * alpha, c.r * alpha, c.g * alpha, c.b * alpha);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // Inner Core Coordinate Ring
    const ringGeom = new THREE.RingGeometry(1.8, 1.84, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x63c7d9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Interaction state
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.35;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Liveness / Visibility optimization (IntersectionObserver)
    let isVisible = true;
    let animationFrameId: number;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Render loop using THREE.Timer (replaces deprecated THREE.Clock)
    const timer = new THREE.Timer();

    const render = () => {
      if (!renderer) return;

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }

      if (!isVisible) return;

      timer.update();
      const elapsedTime = timer.getElapsed();

      // Smooth damping rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      const baseRotation = prefersReducedMotion ? 0 : elapsedTime * 0.08;

      pointCloud.rotation.y = baseRotation + currentRotationY;
      pointCloud.rotation.x = currentRotationX * 0.5;

      lineMesh.rotation.y = baseRotation + currentRotationY;
      lineMesh.rotation.x = currentRotationX * 0.5;

      ringMesh.rotation.z = -baseRotation * 0.4;
      ringMesh.rotation.x = Math.PI / 3 + currentRotationX * 0.2;

      renderer.render(scene, camera);
    };

    // Initial render
    render();

    // Clean up
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      pointGeometry.dispose();
      pointMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      ringGeom.dispose();
      ringMat.dispose();

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <>
      <p className="sr-only">
        Interactive 3D mathematical visualization representing distributed system topology, autonomous cluster nodes, and real-time state telemetry.
      </p>
      <div
        ref={containerRef}
        aria-hidden="true"
        className="relative w-full h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] flex items-center justify-center overflow-hidden rounded-sm border border-[#292D30] bg-[#0B0D0E]/60 backdrop-blur-xs select-none"
      >
        <canvas ref={canvasRef} aria-hidden="true" className="w-full h-full block" />

      {/* Engineering Overlay Telemetry Details */}
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#63C7D9] animate-pulse" />
        <span className="text-[10px] font-mono tracking-widest text-[#A6AAAC] uppercase">
          TOPOLOGY_CLUSTER: ACTIVE // 42 NODES
        </span>
      </div>

      <div className="absolute bottom-3 right-4 pointer-events-none text-right">
        <span className="text-[10px] font-mono text-[#6E7376]">
          WEBGL_RENDER: 60FPS // DETERMINISTIC
        </span>
      </div>
    </div>
  </>
);
}
