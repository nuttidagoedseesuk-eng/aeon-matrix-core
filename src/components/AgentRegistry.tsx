import React, { useMemo } from 'react';
import { AgentProfile, AgentName, AgentSignal } from '../types';
import {
  Shield,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  AlertOctagon,
  Terminal,
  Activity,
  Flame,
  Gauge,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { AgentSparkline } from './AgentSparkline';

interface AgentRegistryProps {
  agents: AgentProfile[];
  signals?: AgentSignal[];
  onToggleAutonomy: (name: AgentName) => void;
  onTriggerTestSignal: (name: AgentName) => void;
  onSelectAgentForIncident: (name: AgentName) => void;
}

// Helper to determine exact Heatmap Color info on a Green-to-Red continuum
export const getHeatmapColorInfo = (scorePct: number) => {
  if (scorePct >= 97.0) {
    return {
      hex: '#10b981', // Emerald green
      textClass: 'text-emerald-400',
      bgClass: 'bg-emerald-950/80',
      borderClass: 'border-emerald-500/50',
      pillClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      glowClass: 'shadow-emerald-950/40',
      label: 'Optimal Sovereign Equilibrium',
      status: 'OPTIMAL',
    };
  }
  if (scorePct >= 95.0) {
    return {
      hex: '#22c55e', // Green
      textClass: 'text-green-400',
      bgClass: 'bg-green-950/80',
      borderClass: 'border-green-500/50',
      pillClass: 'bg-green-500/20 text-green-300 border-green-500/40',
      glowClass: 'shadow-green-950/40',
      label: 'Constitution Baseline Nominal',
      status: 'NOMINAL',
    };
  }
  if (scorePct >= 93.0) {
    return {
      hex: '#84cc16', // Lime / Yellow-Green
      textClass: 'text-lime-400',
      bgClass: 'bg-lime-950/80',
      borderClass: 'border-lime-500/50',
      pillClass: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
      glowClass: 'shadow-lime-950/40',
      label: 'Caution: Marginal Variance',
      status: 'MARGINAL',
    };
  }
  if (scorePct >= 90.0) {
    return {
      hex: '#f59e0b', // Amber / Orange
      textClass: 'text-amber-400',
      bgClass: 'bg-amber-950/80',
      borderClass: 'border-amber-500/50',
      pillClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glowClass: 'shadow-amber-950/40',
      label: 'Sub-Baseline: Elevated Risk',
      status: 'SUB_BASELINE',
    };
  }
  if (scorePct >= 85.0) {
    return {
      hex: '#f97316', // Orange-Red
      textClass: 'text-orange-400',
      bgClass: 'bg-orange-950/80',
      borderClass: 'border-orange-500/50',
      pillClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      glowClass: 'shadow-orange-950/40',
      label: 'Demoted: Autonomy Restricted',
      status: 'RESTRICTED',
    };
  }
  return {
    hex: '#ef4444', // Red
    textClass: 'text-red-400',
    bgClass: 'bg-red-950/80',
    borderClass: 'border-red-500/60',
    pillClass: 'bg-red-500/20 text-red-300 border-red-500/40',
    glowClass: 'shadow-red-950/60',
    label: 'Critical Alert: Node Degraded',
    status: 'CRITICAL',
  };
};

export const AgentRegistry: React.FC<AgentRegistryProps> = ({
  agents,
  signals = [],
  onToggleAutonomy,
  onTriggerTestSignal,
  onSelectAgentForIncident,
}) => {
  // Calculate real-time average confidence level across all agents
  const { avgConfidencePct, nominalCount, subBaselineCount, isolatedCount } = useMemo(() => {
    if (agents.length === 0) return { avgConfidencePct: 0, nominalCount: 0, subBaselineCount: 0, isolatedCount: 0 };
    const scores = agents.map((a) => a.confidenceScore * 100);
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    const avg = parseFloat((sum / agents.length).toFixed(1));
    const nominal = agents.filter((a) => a.confidenceScore >= 0.95 && !a.isIsolated).length;
    const sub = agents.filter((a) => a.confidenceScore < 0.95 && !a.isIsolated).length;
    const isolated = agents.filter((a) => a.isIsolated).length;
    return {
      avgConfidencePct: avg,
      nominalCount: nominal,
      subBaselineCount: sub,
      isolatedCount: isolated,
    };
  }, [agents]);

  const heatmapInfo = getHeatmapColorInfo(avgConfidencePct);

  // Position on the 80% to 100% scale for the needle cursor
  const cursorPositionPct = Math.min(
    100,
    Math.max(0, ((avgConfidencePct - 80) / (100 - 80)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEATMAP COLOR SCALE SUMMARY ROW (Real-Time Average Confidence Level)
         ========================================================================= */}
      <div
        className={`rounded-2xl border p-5 transition-all duration-300 shadow-xl ${heatmapInfo.bgClass} ${heatmapInfo.borderClass} ${heatmapInfo.glowClass} backdrop-blur-md relative overflow-hidden`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: heatmapInfo.hex }}
        />

        <div className="relative z-10 space-y-4">
          {/* Top Bar: Title & Live Heatmap Pulse Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div
                className="p-2 rounded-lg border flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: `${heatmapInfo.hex}20`,
                  borderColor: `${heatmapInfo.hex}50`,
                  color: heatmapInfo.hex,
                }}
              >
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-mono font-bold text-slate-100 tracking-wide flex items-center gap-2">
                    <span>SYSTEM VITALITY & CONFIDENCE HEATMAP</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-900 border border-slate-700 text-slate-300">
                      LIVE TELEMETRY
                    </span>
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-thai">
                  แถบประเมินดัชนีสัญญาณชีพบูรณาการและระดับความมั่นใจเฉลี่ยเรียลไทม์ของทั้ง 8 เอเจนต์เฉพาะทาง (Green-to-Red Spectrum)
                </p>
              </div>
            </div>

            {/* Overall Heatmap Status Pill */}
            <div
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center space-x-2 shadow-sm ${heatmapInfo.pillClass}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: heatmapInfo.hex }}
              />
              <span>{heatmapInfo.label}</span>
            </div>
          </div>

          {/* Main Heatmap Metric & Continuous Spectrum Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Big Heatmap Score Card (4 Cols) */}
            <div className="lg:col-span-4 rounded-xl bg-black/50 border border-slate-800/90 p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Real-Time Collective Average
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span
                    className="text-4xl font-extrabold font-mono tracking-tight transition-colors duration-300"
                    style={{ color: heatmapInfo.hex }}
                  >
                    {avgConfidencePct}%
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    / 100.0%
                  </span>
                </div>
                <div className="mt-1 flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                  <span>Constitution Baseline:</span>
                  <span className="text-cyan-400 font-bold">95.0%</span>
                  {avgConfidencePct >= 95 ? (
                    <span className="text-emerald-400 font-bold ml-1">✓ Nominal</span>
                  ) : (
                    <span className="text-amber-400 font-bold ml-1">⚠ Sub-Baseline</span>
                  )}
                </div>
              </div>

              {/* Mini Heat Gauge Visual */}
              <div
                className="w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center font-mono shrink-0 shadow-lg"
                style={{
                  borderColor: heatmapInfo.hex,
                  backgroundColor: `${heatmapInfo.hex}15`,
                  boxShadow: `0 0 20px ${heatmapInfo.hex}30`,
                }}
              >
                <Gauge className="w-5 h-5 mb-0.5" style={{ color: heatmapInfo.hex }} />
                <span className="text-[10px] font-bold" style={{ color: heatmapInfo.hex }}>
                  {heatmapInfo.status}
                </span>
              </div>
            </div>

            {/* Continuous Heatmap Color Scale Bar (5 Cols) */}
            <div className="lg:col-span-5 rounded-xl bg-black/40 border border-slate-800/80 p-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-medium">Heatmap Spectrum (Red → Green):</span>
                <span className="text-slate-400 text-[11px]">Range: 80% - 100%</span>
              </div>

              {/* The Heatmap Gradient Bar */}
              <div className="relative h-6 rounded-lg overflow-visible my-3 shadow-inner border border-slate-800/60">
                {/* Gradient Fill: Red -> Orange -> Yellow -> Lime -> Emerald Green */}
                <div
                  className="w-full h-full rounded-lg"
                  style={{
                    background:
                      'linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #10b981 100%)',
                  }}
                />

                {/* 95% Constitution Baseline Marker Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-10 pointer-events-none"
                  style={{ left: `${((95 - 80) / (100 - 80)) * 100}%` }}
                >
                  <span className="absolute -top-4 -translate-x-1/2 text-[9px] font-mono font-bold text-white bg-slate-900 px-1 rounded border border-slate-700 whitespace-nowrap">
                    95% SLA
                  </span>
                </div>

                {/* Needle Cursor Indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none"
                  style={{ left: `${cursorPositionPct}%` }}
                >
                  {/* Pin Dot */}
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xl animate-pulse"
                    style={{
                      backgroundColor: heatmapInfo.hex,
                      boxShadow: `0 0 10px ${heatmapInfo.hex}, 0 0 20px ${heatmapInfo.hex}`,
                    }}
                  />
                  {/* Tooltip Arrow Label */}
                  <span
                    className="mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-extrabold text-slate-950 bg-white shadow-lg whitespace-nowrap"
                  >
                    Avg: {avgConfidencePct}%
                  </span>
                </div>
              </div>

              {/* Scale Labels */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span className="text-red-400">80% Critical</span>
                <span className="text-amber-400">90% Warning</span>
                <span className="text-lime-400 font-bold">▲ 95% Baseline</span>
                <span className="text-emerald-400">100% Optimal</span>
              </div>
            </div>

            {/* Quick Node Breakdown Badges (3 Cols) */}
            <div className="lg:col-span-3 grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                <div className="text-emerald-400 text-lg font-bold">{nominalCount}</div>
                <div className="text-[10px] text-emerald-300/80">≥95% Nominal</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40">
                <div className="text-amber-400 text-lg font-bold">{subBaselineCount}</div>
                <div className="text-[10px] text-amber-300/80">&lt;95% Guarded</div>
              </div>
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40">
                <div className="text-red-400 text-lg font-bold">{isolatedCount}</div>
                <div className="text-[10px] text-red-300/80">Isolated</div>
              </div>
            </div>
          </div>

          {/* Per-Agent Mini Temperature Grid (8 Agents Heatmap Strip) */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Real-Time Node Thermometer Grid (Individual Agent Temperatures):</span>
              </span>
              <span className="text-[10px] text-slate-500">Color mapped from Green (Safe) to Red (Degraded)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {agents.map((ag) => {
                const agPct = ag.confidenceScore * 100;
                const agHeat = getHeatmapColorInfo(agPct);

                return (
                  <div
                    key={ag.id}
                    className={`p-2 rounded-lg border transition-all text-center flex flex-col justify-between ${
                      ag.isIsolated
                        ? 'bg-red-950/70 border-red-500 text-red-200'
                        : `${agHeat.bgClass} ${agHeat.borderClass}`
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold text-slate-200 truncate">
                      {ag.name.replace('_AI', '')}
                    </div>
                    <div className="my-1 flex items-center justify-center space-x-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ag.isIsolated ? '#ef4444' : agHeat.hex }}
                      />
                      <span
                        className="font-mono text-xs font-extrabold"
                        style={{ color: ag.isIsolated ? '#ef4444' : agHeat.hex }}
                      >
                        {agPct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 truncate">
                      {ag.isIsolated ? 'ISOLATED' : agHeat.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Principle Banner */}
      <div className="rounded-xl border border-cyan-800/40 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 p-5 glow-cyan">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚖️</span>
              <h2 className="text-lg font-bold text-cyan-300 font-mono tracking-wide">
                1. โครงสร้างธรรมาภิบาลกลุ่มเอเจนต์เฉพาะทาง (Specialized AI Agents Ecosystem)
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed font-thai">
              ป้องกันความล้มเหลวเชิงระบบจากการพึ่งพาโมเดลเดี่ยวขนาดใหญ่ (Generalist AI) ด้วยการแบ่งแยกหน้าที่การประมวลผลออกเป็น 
              <strong className="text-cyan-400"> 8 เอเจนต์ย่อยอิสระ (Baby AI) </strong>
              กำกับดูแลด้วยระดับสิทธิ์การตัดสินใจอัตโนมัติ (Autonomy Restriction)
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-xs font-mono text-cyan-300 whitespace-nowrap">
            💡 Optimize relationships before components
          </div>
        </div>
      </div>

      {/* Agents Grid (8 Specialized Agents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const isGuardian = agent.name === 'Guardian_AI';
          const isLowConfidence = agent.status === 'LOW_CONFIDENCE' || agent.confidenceScore < 0.95;
          const isIsolated = agent.isIsolated;
          const agentPct = agent.confidenceScore * 100;
          const agentHeat = getHeatmapColorInfo(agentPct);

          return (
            <div
              key={agent.id}
              className={`rounded-xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                isIsolated
                  ? 'bg-red-950/20 border-red-500/60 shadow-lg shadow-red-950/50'
                  : isGuardian
                  ? 'bg-slate-900/90 border-cyan-500/50 glow-cyan'
                  : isLowConfidence
                  ? 'bg-slate-900/80 border-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-1.5 rounded-md ${
                        isGuardian
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : isIsolated
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {agent.name}
                        {isGuardian && <span className="text-xs text-cyan-400">🔒</span>}
                      </h3>
                      <p className="text-xs text-slate-400 font-thai">{agent.thaiName}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-semibold ${
                      isIsolated
                        ? 'bg-red-900/70 text-red-200 border border-red-500'
                        : agent.status === 'OPERATIONAL'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : agent.status === 'LOW_CONFIDENCE'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                {/* Role & Domain */}
                <div className="mt-3 text-xs space-y-1.5 font-thai">
                  <div>
                    <span className="text-slate-400">🛡️ ขอบเขตความถนัด: </span>
                    <span className="text-slate-200">{agent.domain}</span>
                  </div>
                  <div>
                    <span className="text-amber-400/90">📉 จุดอ่อนและความเสี่ยง: </span>
                    <span className="text-slate-300">{agent.operationalRisk}</span>
                  </div>
                </div>

                {/* Telemetry Tokens Tags */}
                <div className="mt-3">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1.5">โทเค็นสัญญาณชีพ:</div>
                  <div className="flex flex-wrap gap-1">
                    {agent.telemetryTokens.map((token, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-cyan-300"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-slate-400">Confidence Baseline:</span>
                    <span
                      className="font-bold flex items-center gap-1"
                      style={{ color: agentHeat.hex }}
                    >
                      {agentPct.toFixed(1)}% {agent.confidenceScore < 0.95 && '(Sub-Baseline)'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, agentPct)}%`,
                        backgroundColor: agentHeat.hex,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                    <span>0%</span>
                    <span className="text-cyan-400 font-bold">▲ 95% Constitution Baseline</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* ===================================================================
                    MINI 10-TICK SPARKLINE CHART FOR THIS AGENT
                   =================================================================== */}
                <AgentSparkline
                  agentName={agent.name}
                  currentScore={agent.confidenceScore}
                  signals={signals}
                  agentColor={agentHeat.hex}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleAutonomy(agent.name)}
                  className={`flex-1 py-1 px-2 rounded text-xs font-mono font-medium transition-colors border ${
                    agent.isAutonomous
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-600/50'
                  }`}
                >
                  {agent.isAutonomous ? '🔒 Restrict Autonomy' : '🔓 Restore Autonomy'}
                </button>

                <button
                  onClick={() => onTriggerTestSignal(agent.name)}
                  title="Simulate Telemetry Signal"
                  className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectAgentForIncident(agent.name)}
                  title="Open in Mobile Incident Screen"
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
