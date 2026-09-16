/**
 * HeroFallback — High-performance, zero-blocking SVG & CSS geometric blueprint.
 * Renders instantly to guarantee immediate First Contentful Paint (FCP) and zero CLS,
 * while serving as the primary visual on reduced-motion devices or environments without WebGL.
 */
export function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] flex items-center justify-center overflow-hidden rounded-sm border border-[#292D30] bg-[#111416]/80 backdrop-blur-xs select-none"
    >
      {/* Background Matrix Grid */}
      <svg
        className="absolute inset-0 w-full h-full stroke-[#292D30]/60 opacity-70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" strokeWidth="0.75" />
          </pattern>
          <linearGradient id="blueprint-fade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#63C7D9" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#2C8799" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0B0D0E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Engineering Blueprint Geometric Nodes */}
      <div className="relative w-[85%] max-w-[440px] aspect-square flex items-center justify-center">
        {/* Outer Orbital Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#292D30] animate-[spin_60s_linear_infinite] motion-reduce:animate-none" />

        {/* Intermediate Octagonal Ring */}
        <div className="absolute inset-8 rounded-full border border-[#292D30]/80" />

        {/* Concentric Node Axis */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#63C7D9]/20 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center rotate-90">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#63C7D9]/20 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center rotate-45">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#292D30] to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center -rotate-45">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#292D30] to-transparent" />
        </div>

        {/* Central Core Lattice */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 rounded-sm border border-[#3D4347] bg-[#0B0D0E]/90 shadow-2xl shadow-[#0B0D0E]">
          <div className="w-3 h-3 rounded-xs bg-[#63C7D9] animate-pulse motion-reduce:animate-none shadow-[0_0_12px_rgba(99,199,217,0.6)] mb-3" />
          <div className="text-[11px] font-mono tracking-widest text-[#F5F5F3] uppercase font-semibold">
            SYS_TOPOLOGY // V4
          </div>
          <div className="text-[10px] font-mono text-[#63C7D9] pt-1">
            DETERMINISTIC_ACTIVE
          </div>
          <div className="text-[9px] font-mono text-[#6E7376] pt-0.5">
            NODE LATENCY: &lt; 0.8ms
          </div>
        </div>

        {/* Satellite Node Callouts */}
        <div className="absolute top-4 left-6 hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-xs bg-[#171A1C] border border-[#292D30] text-[9px] font-mono text-[#A6AAAC]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
          NODE_CLUSTER_01: 99.99%
        </div>
        <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-xs bg-[#171A1C] border border-[#292D30] text-[9px] font-mono text-[#A6AAAC]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#63C7D9]" />
          AGENT_MESH: VERIFIED
        </div>
      </div>

      {/* Subtle Bottom System Badge */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-[#6E7376] border-t border-[#171A1C] pt-2">
        <span>ARCH: DISTRIBUTED_CONSENSUS</span>
        <span className="text-[#63C7D9]">ZERO_TRUST_POSTURE</span>
      </div>
    </div>
  );
}
