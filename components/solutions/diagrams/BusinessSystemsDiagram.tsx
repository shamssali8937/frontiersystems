/**
 * BusinessSystemsDiagram — Visualizes the transactional outbox pattern,
 * event bus, and database synchronization for the Business Systems pillar.
 */
export function BusinessSystemsDiagram() {
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
          <pattern id="bs-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bs-grid)" />
      </svg>

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#171A1C] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E5A84B] animate-pulse" />
          <span className="text-[#F5F5F3] font-semibold">TRANSACTIONAL_BUS // OUTBOX_PIPELINE</span>
        </div>
        <div className="flex items-center gap-3 text-[#6E7376]">
          <span>INTEGRITY: ACID_GUARANTEED</span>
          <span className="text-[#E5A84B]">DUAL_WRITE: ELIMINATED</span>
        </div>
      </div>

      {/* Flow Nodes Matrix */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Node 1: Ingestion Gateway */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#E5A84B] mb-1">01 // INBOUND GATEWAY</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">API / ERP Ingress</div>
            <p className="text-xs text-[#A6AAAC]">
              Validates authentication token, payload schema, and assigns idempotent UUID.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>THROUGHPUT</span>
            <span className="text-[#63C7D9]">10K+ REQ/SEC</span>
          </div>
        </div>

        {/* Node 2: Atomic Transaction & Outbox */}
        <div className="p-4 rounded-sm border border-[#E5A84B]/40 bg-[#171A1C] flex flex-col justify-between shadow-[0_0_15px_rgba(229,168,75,0.08)]">
          <div>
            <div className="text-[10px] font-mono text-[#E5A84B] mb-1">02 // ATOMIC COMMIT</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Transactional Outbox</div>
            <p className="text-xs text-[#A6AAAC]">
              Writes business mutation and outbox message in one atomic PostgreSQL transaction.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#292D30] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>DATA LOSS RISK</span>
            <span className="text-[#4EBA87]">0.00%</span>
          </div>
        </div>

        {/* Node 3: Event Bus Streaming */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#E5A84B] mb-1">03 // EVENT STREAM</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Kafka / Queue Broker</div>
            <p className="text-xs text-[#A6AAAC]">
              Asynchronous event dispatch with dead-letter queue routing and exponential backoff.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>QUEUE RECOVERY</span>
            <span className="text-[#E5A84B]">AUTOMATED</span>
          </div>
        </div>

        {/* Node 4: Idempotent Consumer Sync */}
        <div className="p-4 rounded-sm border border-[#292D30] bg-[#0B0D0E]/80 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#E5A84B] mb-1">04 // SYSTEM SYNC</div>
            <div className="text-sm font-semibold text-[#F5F5F3] mb-1">Downstream Sync</div>
            <p className="text-xs text-[#A6AAAC]">
              Reconciles CRM, billing ledgers, and inventory portals with zero duplicate execution.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#171A1C] flex items-center justify-between text-[10px] font-mono text-[#6E7376]">
            <span>STATE PARITY</span>
            <span className="text-[#F5F5F3]">100% RECONCILED</span>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#171A1C] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#6E7376]">
        <div className="flex items-center gap-4">
          <span>POSTGRESQL REPLICATION: MULTI-AZ</span>
          <span>RECOVERY POINT OBJECTIVE: &lt; 60S</span>
        </div>
        <span className="text-[#E5A84B]">TRANSACTION_ISOLATION: SERIALIZABLE_READ_COMMITTED</span>
      </div>
    </div>
  );
}
