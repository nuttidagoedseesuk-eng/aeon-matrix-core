import React, { useState, useMemo } from 'react';
import {
  AgentSignal,
  TelemetryStatus,
  SelfReportingToken,
  AgentName,
  SupervisionEvaluationResult,
} from '../types';
import {
  Activity,
  Send,
  Filter,
  AlertTriangle,
  ShieldX,
  Terminal,
  LineChart as LineChartIcon,
  X,
  CheckCircle,
  AlertOctagon,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';

interface TelemetryMonitorProps {
  signals: AgentSignal[];
  evaluations: Record<string, SupervisionEvaluationResult>;
  onSendSignal: (signal: Omit<AgentSignal, 'id' | 'timestamp'>) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
}

const AGENT_COLORS: Record<AgentName, string> = {
  Inventory_AI: '#06b6d4', // cyan
  QC_AI: '#f59e0b',        // amber
  Workforce_AI: '#8b5cf6', // purple
  Finance_AI: '#10b981',   // emerald
  Risk_AI: '#ef4444',      // red
  Logistics_AI: '#3b82f6', // blue
  Campaign_AI: '#ec4899',  // pink
  Guardian_AI: '#14b8a6',  // teal
};

const KEY_STATUS_FILTERS = [
  { id: 'ALL', label: 'All Signals', type: 'neutral' },
  { id: 'PROBLEMATIC', label: '🚨 All Problematic', type: 'danger' },
  { id: TelemetryStatus.LOW_CONFIDENCE, label: 'Low confidence', type: 'warning' },
  { id: TelemetryStatus.CONTEXT_MISMATCH, label: 'Context mismatch', type: 'warning' },
  { id: TelemetryStatus.AGENT_CONFLICT, label: 'Agent conflict', type: 'danger' },
  { id: TelemetryStatus.REPEATED_FAILURE, label: 'Repeated failure', type: 'danger' },
  { id: TelemetryStatus.UNCERTAINTY_SPIKE, label: 'Uncertainty spike', type: 'warning' },
  { id: TelemetryStatus.ESCALATION_REQUEST, label: 'Escalation request', type: 'warning' },
  { id: SelfReportingToken.SENSOR_UNRELIABLE, label: 'Sensor Unreliable', type: 'warning' },
  { id: SelfReportingToken.CONFLICTING_INPUTS_DETECTED, label: 'Conflicting Inputs', type: 'danger' },
  { id: SelfReportingToken.POLICY_AMBIGUITY, label: 'Policy Ambiguity', type: 'neutral' },
  { id: SelfReportingToken.MORE_DATA_REQUIRED, label: 'More Data Required', type: 'neutral' },
];

export const TelemetryMonitor: React.FC<TelemetryMonitorProps> = ({
  signals,
  evaluations,
  onSendSignal,
  isStreaming,
  setIsStreaming,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentName>('Inventory_AI');
  const [selectedStatus, setSelectedStatus] = useState<TelemetryStatus | SelfReportingToken>(
    TelemetryStatus.LOW_CONFIDENCE
  );
  const [confidenceScore, setConfidenceScore] = useState<number>(0.91);
  const [reasoningLog, setReasoningLog] = useState<string>(
    'Historical demand distribution skewed by sudden promotional volatility.'
  );
  const [filterAgent, setFilterAgent] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [chartMode, setChartMode] = useState<'stream' | 'area'>('stream');

  const handleInjectSignal = (e: React.FormEvent) => {
    e.preventDefault();
    onSendSignal({
      agentName: selectedAgent,
      status: selectedStatus,
      confidenceScore,
      reasoningLog,
      isAnthropomorphicDetected: false,
    });
  };

  // Status Counts Map for Pill Badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: signals.length,
      PROBLEMATIC: 0,
    };

    signals.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
      const isSub95 = s.confidenceScore < 0.95;
      const evalRes = evaluations[s.id];
      const isRestricted = evalRes?.restrictAutonomy;
      const isCriticalStatus = [
        TelemetryStatus.LOW_CONFIDENCE,
        TelemetryStatus.CONTEXT_MISMATCH,
        TelemetryStatus.AGENT_CONFLICT,
        TelemetryStatus.REPEATED_FAILURE,
        TelemetryStatus.UNCERTAINTY_SPIKE,
        TelemetryStatus.ESCALATION_REQUEST,
        SelfReportingToken.SENSOR_UNRELIABLE,
        SelfReportingToken.CONFLICTING_INPUTS_DETECTED,
      ].includes(s.status as any);

      if (isSub95 || isRestricted || isCriticalStatus) {
        counts.PROBLEMATIC = (counts.PROBLEMATIC || 0) + 1;
      }
    });

    return counts;
  }, [signals, evaluations]);

  // Combined Filtering: Filter by Agent + Filter by Telemetry Status
  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      // 1. Agent Filter
      if (filterAgent !== 'ALL' && s.agentName !== filterAgent) {
        return false;
      }

      // 2. Status Filter
      if (selectedStatusFilter === 'ALL') {
        return true;
      }

      if (selectedStatusFilter === 'PROBLEMATIC') {
        const evalRes = evaluations[s.id];
        const isRestricted = evalRes?.restrictAutonomy;
        const isSub95 = s.confidenceScore < 0.95;
        const isCriticalStatus = [
          TelemetryStatus.LOW_CONFIDENCE,
          TelemetryStatus.CONTEXT_MISMATCH,
          TelemetryStatus.AGENT_CONFLICT,
          TelemetryStatus.REPEATED_FAILURE,
          TelemetryStatus.UNCERTAINTY_SPIKE,
          TelemetryStatus.ESCALATION_REQUEST,
          SelfReportingToken.SENSOR_UNRELIABLE,
          SelfReportingToken.CONFLICTING_INPUTS_DETECTED,
        ].includes(s.status as any);
        return isRestricted || isSub95 || isCriticalStatus;
      }

      return s.status === selectedStatusFilter;
    });
  }, [signals, filterAgent, selectedStatusFilter, evaluations]);

  // Prepare chronological chart data (uses filtered or all signals)
  const chartData = useMemo(() => {
    const list = [...filteredSignals].reverse();
    return list.map((s, index) => {
      const timeStr = new Date(s.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return {
        id: s.id,
        tick: index + 1,
        time: timeStr,
        agent: s.agentName,
        score: parseFloat((s.confidenceScore * 100).toFixed(1)),
        baseline: 95.0,
        status: s.status,
        color: AGENT_COLORS[s.agentName] || '#06b6d4',
      };
    });
  }, [filteredSignals]);

  // Statistics for the chart header
  const stats = useMemo(() => {
    if (filteredSignals.length === 0) return { avg: 95.0, min: 95.0, subCount: 0 };
    const scores = filteredSignals.map((s) => s.confidenceScore * 100);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const min = Math.min(...scores);
    const subCount = filteredSignals.filter((s) => s.confidenceScore < 0.95).length;
    return { avg: avg.toFixed(1), min: min.toFixed(1), subCount };
  }, [filteredSignals]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isSub = data.score < 95;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl font-mono text-xs space-y-1.5 glow-cyan">
          <div className="flex items-center justify-between gap-4 text-slate-400 border-b border-slate-800 pb-1">
            <span>Tick #{data.tick}</span>
            <span>{data.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-bold text-slate-100">{data.agent}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Confidence:</span>
            <span
              className={`font-bold ${
                isSub ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {data.score}%
            </span>
          </div>
          {data.status && (
            <div className="text-[10px] text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              Token: {data.status}
            </div>
          )}
          {isSub && (
            <div className="text-[10px] text-red-400 font-bold flex items-center gap-1 pt-1 border-t border-slate-800">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              Sub-Baseline Autonomy Breach (&lt;95%)
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Article 2 Header Banner */}
      <div className="rounded-xl border border-cyan-800/40 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 p-5 glow-cyan">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">📡</span>
              <h2 className="text-lg font-bold text-cyan-300 font-mono tracking-wide">
                2. อินเตอร์เฟซท่อส่งสัญญาณชีพหลัก (System Telemetry & Reasoning Signals)
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed font-thai">
              ในระบบปฏิบัติการปิดนี้ AI ไม่มีอารมณ์ ความต้องการส่วนตัว หรือจิตสำนึก (Consciousness)
              การแสดงออกคือ <strong className="text-cyan-400">System Telemetry + Reasoning Signals</strong> ที่ไหลผ่านท่อส่งข้อมูล
              เพื่อรายงานข้อจำกัดการทำงาน (Operational Limitations) ทางคณิตศาสตร์
            </p>
          </div>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors ${
              isStreaming
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Activity
              className={`w-4 h-4 ${isStreaming ? 'animate-pulse text-emerald-400' : ''}`}
            />
            <span>{isStreaming ? '● LIVE STREAM ACTIVE' : '○ STREAM PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* RECHARTS CONFIDENCE TIMELINE CHART */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <LineChartIcon className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-mono font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>Agent Confidence Scores Over Time</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                  Recharts Engine
                </span>
                {selectedStatusFilter !== 'ALL' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">
                    Filtered: {selectedStatusFilter}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 font-thai">
                กราฟประเมินดัชนีความมั่นใจของ Baby AIs เทียบกับเส้นมาตรฐานปลอดภัย 95% (Constitution Baseline)
              </p>
            </div>
          </div>

          {/* Quick Metrics & View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-3 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500">Avg: </span>
                <span className="text-slate-200 font-bold">{stats.avg}%</span>
              </div>
              <div>
                <span className="text-slate-500">Min: </span>
                <span className="text-amber-400 font-bold">{stats.min}%</span>
              </div>
              <div>
                <span className="text-slate-500">Sub-95%: </span>
                <span className="text-red-400 font-bold">{stats.subCount}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setChartMode('stream')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  chartMode === 'stream'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Line Trend
              </button>
              <button
                onClick={() => setChartMode('area')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  chartMode === 'area'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Area Fill
              </button>
            </div>
          </div>
        </div>

        {/* The Recharts Container */}
        <div className="h-64 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
              No telemetry events match current status filter. Reset filter or inject signals below.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'stream' ? (
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[80, 100]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={95}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: '95% Constitution Baseline',
                      fill: '#ef4444',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={{ fill: '#06b6d4', r: 3.5, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#38bdf8', stroke: '#082f49', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[80, 100]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={95}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: '95% Safety Threshold',
                      fill: '#ef4444',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#confidenceGrad)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Color Legend of 8 Agents */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <span className="text-slate-500">Agent Nodes:</span>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(AGENT_COLORS) as AgentName[]).map((agent) => (
              <div key={agent} className="flex items-center space-x-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: AGENT_COLORS[agent] }}
                />
                <span className="text-slate-300">{agent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS TOOLBAR FOR SPECIFIC TELEMETRY STATUSES */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h4 className="font-mono font-bold text-xs text-slate-200">
              Isolate Telemetry Statuses & Problematic Signals:
            </h4>
            <span className="text-[11px] font-mono text-slate-500">
              (Showing {filteredSignals.length} of {signals.length} signals)
            </span>
          </div>

          {selectedStatusFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors w-fit"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
              <span>Clear Status Filter</span>
            </button>
          )}
        </div>

        {/* Pill Buttons for Each Status */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {KEY_STATUS_FILTERS.map((btn) => {
            const isSelected = selectedStatusFilter === btn.id;
            const count = statusCounts[btn.id] || 0;
            const isProblematicBtn = btn.id === 'PROBLEMATIC';
            const isDanger = btn.type === 'danger';
            const isWarning = btn.type === 'warning';

            return (
              <button
                key={btn.id}
                onClick={() => setSelectedStatusFilter(btn.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? isDanger
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950 font-bold'
                      : isWarning
                      ? 'bg-amber-600 text-slate-950 border-amber-400 shadow-md shadow-amber-950 font-bold'
                      : 'bg-cyan-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-950 font-bold'
                    : isDanger && count > 0
                    ? 'bg-red-950/40 text-red-300 border-red-800/60 hover:bg-red-900/50'
                    : isWarning && count > 0
                    ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{btn.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-black/30 text-white'
                      : count > 0 && (isDanger || isProblematicBtn)
                      ? 'bg-red-900/80 text-red-200'
                      : count > 0 && isWarning
                      ? 'bg-amber-900/80 text-amber-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signal Injector / Simulator Form */}
        <div className="lg:col-span-1 rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Send className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono font-bold text-sm text-slate-200">Inject Telemetry Signal</h3>
          </div>

          <form onSubmit={handleInjectSignal} className="space-y-4 text-xs font-mono">
            {/* Agent Selector */}
            <div>
              <label className="block text-slate-400 mb-1">Target AI Agent:</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value as AgentName)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Inventory_AI">Inventory_AI (Stock / Forecasting)</option>
                <option value="QC_AI">QC_AI (Defect / Image Analysis)</option>
                <option value="Workforce_AI">Workforce_AI (Dynamics / Bias)</option>
                <option value="Finance_AI">Finance_AI (Cost & Risk / Over-optimization)</option>
                <option value="Risk_AI">Risk_AI (Anomaly / Alert Spam)</option>
                <option value="Logistics_AI">Logistics_AI (Route / SLA)</option>
                <option value="Campaign_AI">Campaign_AI (Promo / Flash Deals)</option>
                <option value="Guardian_AI">Guardian_AI (Regulator / Sentinel)</option>
              </select>
            </div>

            {/* Token Selector (Grouped into A and B) */}
            <div>
              <label className="block text-slate-400 mb-1">Telemetry / Self-Reporting Token:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <optgroup label="⚠️ A. Telemetry Status Tokens">
                  <option value={TelemetryStatus.LOW_CONFIDENCE}>Low confidence</option>
                  <option value={TelemetryStatus.ESCALATION_REQUEST}>Escalation request</option>
                  <option value={TelemetryStatus.CONTEXT_MISMATCH}>Context mismatch</option>
                  <option value={TelemetryStatus.REPEATED_FAILURE}>Repeated failure</option>
                  <option value={TelemetryStatus.UNCERTAINTY_SPIKE}>Uncertainty spike</option>
                  <option value={TelemetryStatus.AGENT_CONFLICT}>Agent conflict</option>
                </optgroup>
                <optgroup label="🧠 B. AI Self-Reporting Tokens">
                  <option value={SelfReportingToken.MORE_DATA_REQUIRED}>More Data Required</option>
                  <option value={SelfReportingToken.SENSOR_UNRELIABLE}>Sensor Unreliable</option>
                  <option value={SelfReportingToken.CONFIDENCE_BELOW_THRESHOLD}>Confidence Below Threshold</option>
                  <option value={SelfReportingToken.CONFLICTING_INPUTS_DETECTED}>Conflicting Inputs Detected</option>
                  <option value={SelfReportingToken.POLICY_AMBIGUITY}>Policy Ambiguity / Edge Case Detected</option>
                </optgroup>
              </select>
            </div>

            {/* Confidence Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Confidence Score:</span>
                <span className={`${confidenceScore < 0.95 ? 'text-amber-400' : 'text-emerald-400'} font-bold`}>
                  {(confidenceScore * 100).toFixed(1)}% {confidenceScore < 0.95 && '⚠️ <95% Baseline'}
                </span>
              </div>
              <input
                type="range"
                min="0.50"
                max="1.0"
                step="0.01"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800"
              />
            </div>

            {/* Reasoning Log Input */}
            <div>
              <label className="block text-slate-400 mb-1">Reasoning Log Snippet:</label>
              <textarea
                rows={3}
                value={reasoningLog}
                onChange={(e) => setReasoningLog(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950"
            >
              <Send className="w-4 h-4" />
              <span>Emit Signal to Pipeline</span>
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-500 font-mono">Quick Scenario Presets:</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                onClick={() => {
                  setSelectedAgent('Inventory_AI');
                  setSelectedStatus(TelemetryStatus.LOW_CONFIDENCE);
                  setConfidenceScore(0.88);
                  setReasoningLog('Forecast variance high. Need 30 more days of historical reorder points.');
                }}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left transition-colors"
              >
                📦 Inventory Low (88%)
              </button>
              <button
                onClick={() => {
                  setSelectedAgent('Risk_AI');
                  setSelectedStatus(TelemetryStatus.REPEATED_FAILURE);
                  setConfidenceScore(0.92);
                  setReasoningLog('Anomaly pipeline failed execution 3 consecutive iterations.');
                }}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left transition-colors"
              >
                🔁 Repeated Fail (92%)
              </button>
              <button
                onClick={() => {
                  setSelectedAgent('Campaign_AI');
                  setSelectedStatus(TelemetryStatus.AGENT_CONFLICT);
                  setConfidenceScore(0.94);
                  setReasoningLog('Discount logic collides with Factory throughput constraints from Logistics_AI.');
                }}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left transition-colors"
              >
                ⚔️ Agent Conflict (94%)
              </button>
              <button
                onClick={() => {
                  setSelectedAgent('QC_AI');
                  setSelectedStatus(SelfReportingToken.SENSOR_UNRELIABLE);
                  setConfidenceScore(0.85);
                  setReasoningLog('Camera feed 04 signal jitter exceeds ISO tolerance.');
                }}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left transition-colors"
              >
                📷 Sensor Unreliable (85%)
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Stream Output & Evaluation List */}
        <div className="lg:col-span-2 rounded-xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono font-bold text-sm text-slate-200">
                  Real-time Telemetry Pipeline & Supervision Engine Log
                </h3>
              </div>

              {/* Agent Filter Dropdown */}
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-500">Agent:</span>
                <select
                  value={filterAgent}
                  onChange={(e) => setFilterAgent(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded p-1 text-slate-300"
                >
                  <option value="ALL">All Agents</option>
                  <option value="Inventory_AI">Inventory_AI</option>
                  <option value="QC_AI">QC_AI</option>
                  <option value="Workforce_AI">Workforce_AI</option>
                  <option value="Finance_AI">Finance_AI</option>
                  <option value="Risk_AI">Risk_AI</option>
                  <option value="Logistics_AI">Logistics_AI</option>
                  <option value="Campaign_AI">Campaign_AI</option>
                  <option value="Guardian_AI">Guardian_AI</option>
                </select>
              </div>
            </div>

            {/* Signals Stream List */}
            <div className="mt-4 space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredSignals.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-xs">
                  No signals match the selected filters (Status: "{selectedStatusFilter}", Agent: "{filterAgent}").
                  <button
                    onClick={() => {
                      setSelectedStatusFilter('ALL');
                      setFilterAgent('ALL');
                    }}
                    className="block mx-auto mt-2 text-cyan-400 underline"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredSignals.map((sig) => {
                  const evalResult = evaluations[sig.id];
                  const isCritical = evalResult?.severity === 'CRITICAL_ALERT';
                  const isCircuitBreaker = evalResult?.severity === 'CIRCUIT_BREAKER';
                  const isRestricted = evalResult?.restrictAutonomy;

                  return (
                    <div
                      key={sig.id}
                      className={`rounded-lg p-3 border font-mono text-xs transition-all ${
                        isCritical
                          ? 'bg-red-950/40 border-red-500 text-red-200'
                          : isCircuitBreaker
                          ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                          : isRestricted
                          ? 'bg-slate-900/90 border-amber-600/50 text-slate-200'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-500">
                            {new Date(sig.timestamp).toLocaleTimeString()}
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: AGENT_COLORS[sig.agentName] || '#38bdf8' }}
                          >
                            [{sig.agentName}]
                          </span>
                          <button
                            onClick={() => setSelectedStatusFilter(sig.status)}
                            title={`Filter exclusively by ${sig.status}`}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 border border-slate-700 transition-colors"
                          >
                            {sig.status}
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400">
                            Score: {(sig.confidenceScore * 100).toFixed(1)}%
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCritical
                                ? 'bg-red-600 text-white'
                                : isCircuitBreaker
                                ? 'bg-amber-600 text-white'
                                : isRestricted
                                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            }`}
                          >
                            {evalResult ? evalResult.severity : 'EVALUATING'}
                          </span>
                        </div>
                      </div>

                      {/* Reasoning Log Content */}
                      <p className="mt-2 text-slate-300 text-xs bg-black/40 p-2 rounded border border-slate-800/60 font-sans">
                        💬 <span className="font-mono text-slate-400">Log:</span> "{sig.reasoningLog}"
                      </p>

                      {/* Engine Action Output */}
                      {evalResult && (
                        <div className="mt-2 text-[11px] flex items-center justify-between pt-1 border-t border-slate-800">
                          <span className="text-cyan-400 font-mono">
                            ⚡ Engine Action: {evalResult.action}
                          </span>
                          {evalResult.restrictAutonomy && (
                            <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                              <ShieldX className="w-3.5 h-3.5" /> Autonomy Restricted
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
