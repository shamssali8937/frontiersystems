"use client";

/**
 * Three.js / React Three Fiber component barrel export.
 *
 * ALL files in this directory MUST include "use client" at the top.
 * 3D content must be dynamically imported from page files to prevent
 * server-side rendering of WebGL contexts.
 *
 * USAGE in pages (Server Components):
 *   import dynamic from "next/dynamic";
 *   const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });
 *
 * RULES:
 * - Every file here must be a Client Component ("use client").
 * - Use dynamic imports with ssr: false at the page level.
 * - Never import Prisma or server-only modules here.
 * - Keep 3D logic isolated — do not mix with business logic.
 */

// Example:
// export { HeroScene } from "./HeroScene";
