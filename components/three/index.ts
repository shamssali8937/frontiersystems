"use client";

/**
 * Three.js / WebGL component barrel export.
 *
 * ALL files in this directory include "use client" at the top.
 * 3D content must be dynamically imported from page files with ssr: false
 * to prevent server-side rendering of WebGL contexts and maintain optimal FCP/LCP.
 */

export { HeroScene } from "./HeroScene";
export { HeroFallback } from "./HeroFallback";
