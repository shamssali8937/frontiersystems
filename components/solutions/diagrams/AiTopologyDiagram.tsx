/**
 * AiTopologyDiagram — Visualizes the deterministic multi-agent state machine
 * and schema validation pipeline for the AI & Automation pillar.
 */
export function AiTopologyDiagram() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full rounded-sm border border-[#292D30] bg-[#111416] p-6 sm:p-8 overflow-hidden select-none"
    >
      {/* Background Micro Grid */}
      <svg
        className="absolute inset-0 w-full h-full stroke-[#292D30]/40 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="ai-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ai-grid)" />
      </svg>

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#171A1C] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4EBA87] animate-pulse" />
          <span className="text-[#F5F5F3] font-semibold">AGENT_PIPELINE // STATE_MACHINE_V3</span>
        </div>
        <div className="flex items-center gap-3 text-[#6E7376]">
          <span>INFERENCE: DETERMINISTIC</span>
          <span className="text-[#63C7D9]">SCHEMA_GATE: ENFORCED</span>
        </div>
      </div>

      {/* Flow Nodes Matrix */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Node 1: Ingestion & Query */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#63C7D9] mb-1">01 // INGRESS</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Task Ingestion</div>
            <p className="text-xs text-[#A6AAAC]">
              Sanitizes raw inputs and extracts typed contextual intent.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>LATENCY</span>
            <span className="text-[#4EBA87]">&lt; 15ms</span>
          </div>
        </div>

        {/* Node 2: Grounded RAG & State */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#63C7D9] mb-1">02 // RETRIEVAL</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Vector Indexing</div>
            <p className="text-xs text-[#A6AAAC]">
              Fetches mathematically verified ground-truth context from pgvector.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>ACCURACY</span>
            <span className="text-[#63C7D9]">HNSW 99.8%</span>
          </div>
        </div>

        {/* Node 3: Validation Guard */}
        <div className="p-4 rounded-sm border border-[#63C7D9]/40 bg-[#171A1C] flex flex-col justify-between shadow-[0_0_15px_rgba(99,199,217,0.08)]">
          <div>
            <div className="text-[10px] font-mono text-[#4EBA87] mb-1">03 // VALIDATION GUARD</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Zod Schema Gate</div>
            <p className="text-xs text-[#A6AAAC]">
              Rejects any unparseable hallucination before tool dispatch.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#292D30] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>ERROR LEAK</span>
            <span className="text-[#4EBA87]">0.00%</span>
          </div>
        </div>

        {/* Node 4: Deterministic Action */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#63C7D9] mb-1">04 // EXECUTION</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Idempotent Commit</div>
            <p className="text-xs text-[#A6AAAC]">
              Executes business operations with full audit log and cryptographic sign-off.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>AUDIT TRAIL</span>
            <span className="text-[#F5F5F3]">IMMUTABLE</span>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#171A1C] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#6E7376]">
        <div className="flex items-center gap-4">
          <span>PARALLEL AGENT NODES: 8</span>
          <span>CYCLE DETECTION: ACTIVE</span>
        </div>
        <span className="text-[#63C7D9]">ZERO_HALLUCINATION_POLICY: ENFORCED</span>
      </div>
    </div>
  );
}
