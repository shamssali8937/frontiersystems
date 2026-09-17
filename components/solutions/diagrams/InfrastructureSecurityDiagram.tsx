/**
 * InfrastructureSecurityDiagram — Visualizes the defense-in-depth zero-trust matrix
 * and multi-AZ topology for the Infrastructure & Security pillar.
 */
export function InfrastructureSecurityDiagram() {
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
          <pattern id="sec-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sec-grid)" />
      </svg>

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#171A1C] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4EBA87] animate-pulse" />
          <span className="text-[#F5F5F3] font-semibold">SECURITY_POSTURE // ZERO_TRUST_HARDENED</span>
        </div>
        <div className="flex items-center gap-3 text-[#6E7376]">
          <span>AVAILABILITY: 99.99%_SLA</span>
          <span className="text-[#4EBA87]">MTLS_ENCRYPTION: STRICT</span>
        </div>
      </div>

      {/* Flow Nodes Matrix */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1: Ingress & WAF */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#4EBA87] mb-1">01 // EDGE PERIMETER</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Turnstile & WAF</div>
            <p className="text-xs text-[#A6AAAC]">
              Cloudflare Anycast edge filters DDoS traffic, bot probes, and malicious payloads.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>DDOS DEFENSE</span>
            <span className="text-[#4EBA87]">UNMETERED</span>
          </div>
        </div>

        {/* Tier 2: Zero-Trust Gateway */}
        <div className="p-4 rounded-sm border border-[#4EBA87]/40 bg-[#171A1C] flex flex-col justify-between shadow-[0_0_15px_rgba(78,186,135,0.08)]">
          <div>
            <div className="text-[10px] font-mono text-[#4EBA87] mb-1">02 // IDENTITY PERIMETER</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Zero-Trust Gateway</div>
            <p className="text-xs text-[#A6AAAC]">
              Every request requires mTLS certificate verification and ephemeral token claims.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#292D30] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>UNAUTHENTICATED ACCESS</span>
            <span className="text-[#4EBA87]">BLOCKED</span>
          </div>
        </div>

        {/* Tier 3: Isolated VPC */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#4EBA87] mb-1">03 // COMPUTE CLUSTER</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Private VPC & K8s</div>
            <p className="text-xs text-[#A6AAAC]">
              Hardened container nodes running in isolated subnets with zero public ingress IPs.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>POD AUTO-SCALING</span>
            <span className="text-[#63C7D9]">&lt; 30 SEC</span>
          </div>
        </div>

        {/* Tier 4: Encrypted Multi-AZ DB */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#4EBA87] mb-1">04 // DATA DURABILITY</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Multi-AZ Encrypted Storage</div>
            <p className="text-xs text-[#A6AAAC]">
              Synchronous replication across three availability zones with automated instant failover.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>FAILOVER RTO</span>
            <span className="text-[#F5F5F3]">&lt; 5 MIN</span>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#171A1C] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#6E7376]">
        <div className="flex items-center gap-4">
          <span>TERRAFORM IAC: VERSIONED & DRIFT-CHECKED</span>
          <span>SECRET ROTATION: 15-MIN LEASES</span>
        </div>
        <span className="text-[#4EBA87]">COMPLIANCE_ALIGNMENT: ISO_27001 // SOC2_TYPE_II</span>
      </div>
    </div>
  );
}
