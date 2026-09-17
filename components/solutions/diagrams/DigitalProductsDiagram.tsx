/**
 * DigitalProductsDiagram — Visualizes edge-to-client layered rendering engine
 * and latency telemetry for the Digital Products pillar.
 */
export function DigitalProductsDiagram() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full rounded-sm border border-[#292D30] bg-[#111416] p-6 sm:p-8 overflow-hidden select-none"
    >
      {/* Background Grid */}
      <svg
        className="absolute inset-0 w-full h-full stroke-[#292D30]/40 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dp-grid)" />
      </svg>

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#171A1C] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#63C7D9] animate-pulse" />
          <span className="text-[#F5F5F3] font-semibold">STREAMING_ENGINE // APP_ROUTER_V15</span>
        </div>
        <div className="flex items-center gap-3 text-[#6E7376]">
          <span>TTFB: &lt; 90MS</span>
          <span className="text-[#4EBA87]">CORE_WEB_VITALS: PASSED</span>
        </div>
      </div>

      {/* Flow Nodes Matrix */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Layer 1: Edge CDN */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#63C7D9] mb-1">01 // GLOBAL EDGE</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Anycast CDN</div>
            <p className="text-xs text-[#A6AAAC]">
              Static asset delivery and geolocation-aware edge TLS termination.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>CACHE HIT</span>
            <span className="text-[#4EBA87]">99.4%</span>
          </div>
        </div>

        {/* Layer 2: Streaming SSR */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#63C7D9] mb-1">02 // SERVER STREAM</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">React 19 RSC</div>
            <p className="text-xs text-[#A6AAAC]">
              Parallel component streaming delivers instant initial frame without blocking data calls.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>FCP TIME</span>
            <span className="text-[#63C7D9]">&lt; 0.4s</span>
          </div>
        </div>

        {/* Layer 3: Optimistic State */}
        <div className="p-4 rounded-sm border border-[#63C7D9]/40 bg-[#171A1C] flex flex-col justify-between shadow-[0_0_15px_rgba(99,199,217,0.08)]">
          <div>
            <div className="text-[10px] font-mono text-[#63C7D9] mb-1">03 // CLIENT HYDRATION</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Optimistic State</div>
            <p className="text-xs text-[#A6AAAC]">
              Immediate user interaction feedback backed by background server action validation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#292D30] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>INTERACTION</span>
            <span className="text-[#4EBA87]">INP &lt; 50ms</span>
          </div>
        </div>

        {/* Layer 4: Multi-Device Sync */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#63C7D9] mb-1">04 // PERSISTENCE</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Offline Sync</div>
            <p className="text-xs text-[#A6AAAC]">
              Local SQLite / IndexedDB cache synchronized reliably over WebSocket channels.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>RECONNECT</span>
            <span className="text-[#F5F5F3]">CONFLICT-FREE</span>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#171A1C] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#6E7376]">
        <div className="flex items-center gap-4">
          <span>DESKTOP / MOBILE EQUIVALENCE</span>
          <span>BUNDLE SIZE: ZERO-BLOAT</span>
        </div>
        <span className="text-[#63C7D9]">ACCESSIBILITY: WCAG_2.1_AAA_COMPLIANT</span>
      </div>
    </div>
  );
}
