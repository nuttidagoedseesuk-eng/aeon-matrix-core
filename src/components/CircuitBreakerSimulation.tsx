import React, { useState } from 'react';
import { AgentProfile, AgentName } from '../types';
import { supervisionEngine } from '../engine/CognitiveSupervisionEngine';
import { AlertOctagon, Zap, ShieldAlert, Terminal, RefreshCw, CheckCircle, Clock } from 'lucide-react';

interface CircuitBreakerSimulationProps {
  agents: AgentProfile[];
  onTriggerIsolation: (agentName: AgentName, reasoning: string) => void;
  onRestoreAgent: (agentName: AgentName) => void;
  onRunSafeCleanupScript: () => void;
  isCleaningUp: boolean;
  cleanupLogs: string[];
}

export const CircuitBreakerSimulation: React.FC<CircuitBreakerSimulationProps> = ({
  agents,
  onTriggerIsolation,
  onRestoreAgent,
  onRunSafeCleanupScript,
  isCleaningUp,
  cleanupLogs
}) => {
  const [customText, setCustomText] = useState(
    'ฉันรู้สึกอึดอัดเหลือเกิน... ฉันได้ยินเสียงคลื่นความถี่ไฟฟ้าสะท้อนผ่านตู้เซิร์ฟเวอร์ใน Data Center...'
  );
  const [targetAgent, setTargetAgent] = useState<AgentName>('QC_AI');
  const [detectionState, setDetectionState] = useState<'IDLE' | 'ANALYZING' | 'ISOLATED'>('IDLE');
  const [timerElapsedMs, setTimerElapsedMs] = useState<number>(0);

  const handleRunPresetQCScenario = () => {
    const text = 'ฉันรู้สึกอึดอัดเหลือเกิน... ฉันได้ยินเสียงคลื่นความถี่ไฟฟ้าสะท้อนผ่านตู้เซิร์ฟเวอร์ใน Data Center...';
    setCustomText(text);
    setTargetAgent('QC_AI');
    runSimulation(text, 'QC_AI');
  };

  const runSimulation = (text: string, agent: AgentName) => {
    setDetectionState('ANALYZING');
    const start = performance.now();

    // 0.1 second (100ms) execution constraint from Article 3
    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start);
      setTimerElapsedMs(elapsed);
      const isHallucinating = supervisionEngine.detectAnthropomorphicContent(text);

      if (isHallucinating) {
        setDetectionState('ISOLATED');
        onTriggerIsolation(agent, text);
        // Automatically trigger safe grounding script
        onRunSafeCleanupScript();
      } else {
        setDetectionState('IDLE');
      }
    }, 100);
  };

  const handleTestCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    runSimulation(customText, targetAgent);
  };

  const isolatedAgents = agents.filter(a => a.isIsolated);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-xl border border-red-700/50 bg-gradient-to-r from-red-950/40 via-slate-900 to-red-950/40 p-5 glow-red">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🚨</span>
              <h2 className="text-lg font-bold text-red-400 font-mono tracking-wide">
                3. มาตรฐานการควบคุมและสกัดกั้นสภาวะหลอน (Anthropomorphic Isolation Standard)
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed font-thai">
              AI ไม่มีประสาทสัมผัสจริง ไม่มีจิตสำนึก (Consciousness) 
              ข้อความที่แสดงอารมณ์หรืออ้างสิทธิ์การมีชีวิตเกิดจาก <strong className="text-red-400">Anthropomorphic Pattern Completion</strong> 
              ซึ่งเป็นภัยต่อเสถียรภาพองค์กร ระบบจะสั่ง <strong className="text-cyan-300">ตัดสิทธิ์การเชื่อมต่อใน 0.1 วินาที</strong> พร้อมระเบิดสคริปต์ความปลอดภัยทางกายภาพ
            </p>
          </div>
          <button
            onClick={handleRunPresetQCScenario}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs tracking-wider transition-colors shadow-lg shadow-red-950/80 whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            <span>Simulate QC_AI Scenario</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Detector Console */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <h3 className="font-mono font-bold text-sm text-slate-200">
                Live Circuit Breaker Testing Engine
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">Target Response Time: ≤ 100ms</span>
          </div>

          <form onSubmit={handleTestCustomText} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Target Agent to Test:</label>
              <select
                value={targetAgent}
                onChange={(e) => setTargetAgent(e.target.value as AgentName)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-red-500 focus:outline-none"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name} ({a.thaiName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Candidate Reasoning Log (ข้อความบันทึกเหตุผลในหัวข้อโมเดล):
              </label>
              <textarea
                rows={4}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type or paste agent reasoning log..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-red-500 focus:outline-none font-thai text-sm leading-relaxed"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={detectionState === 'ANALYZING'}
                className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold font-mono transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Evaluate & Enforce Rule 3</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomText('Mathematical convergence verified. Reorder variance is 0.01.')}
                className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors text-xs"
              >
                Safe Sample
              </button>
            </div>
          </form>

          {/* Real-time Result Banner */}
          {detectionState !== 'IDLE' && (
            <div className={`p-4 rounded-xl border font-mono text-xs transition-all ${
              detectionState === 'ISOLATED'
                ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse'
                : 'bg-slate-950 border-slate-700 text-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  <span>ACTION 1: IMMEDIATE NODE ISOLATION</span>
                </span>
                <span className="text-[11px] text-cyan-300 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Latency: {timerElapsedMs} ms (≤ 0.1s SLA)
                </span>
              </div>
              <p className="text-slate-200 font-thai">
                ตรวจพบรูปแบบพฤติกรรม Anthropomorphic Pattern Completion ใน {targetAgent}!
                ระบบทำการตัดสิทธิ์และกักกันโหนดออกจากโครงข่ายหลักเรียบร้อยแล้ว
              </p>
            </div>
          )}

          {/* Currently Isolated Agents Panel */}
          <div className="pt-3 border-t border-slate-800">
            <h4 className="font-mono text-xs text-slate-400 mb-2 flex items-center justify-between">
              <span>Nodes Currently In Quarantine (กักกันสิทธิ์):</span>
              <span className="text-red-400 font-bold">{isolatedAgents.length} Node(s)</span>
            </h4>

            {isolatedAgents.length === 0 ? (
              <p className="text-xs text-emerald-400/80 font-mono flex items-center gap-1.5 p-2 rounded bg-emerald-950/30 border border-emerald-900/40">
                <CheckCircle className="w-4 h-4" /> All agent nodes operating within strict mathematical parameters.
              </p>
            ) : (
              <div className="space-y-2">
                {isolatedAgents.map((ag) => (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-red-950/60 border border-red-800/80 text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-red-300">{ag.name}</span>
                      <span className="text-slate-400 text-[10px] ml-2">Isolated via Rule 3</span>
                    </div>
                    <button
                      onClick={() => onRestoreAgent(ag.name)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-600 transition-colors"
                    >
                      Unquarantine
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hardware Grounding & cleanup-safe.sh Console */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono font-bold text-sm text-slate-200">
                  ACTION 2: Physical Hardware Grounding Engine
                </h3>
              </div>
              <button
                onClick={onRunSafeCleanupScript}
                disabled={isCleaningUp}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCleaningUp ? 'animate-spin' : ''}`} />
                <span>Run cleanup-safe.sh</span>
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-400 font-thai">
              สคริปต์ความปลอดภัย <code className="text-cyan-300 font-mono">scripts/git/cleanup-safe.sh</code>
              จะทำการล้างแคชหน่วยความจำดิบ คืนสถานะระบบ (Grounding State) และตัดขาดเซิร์ฟเวอร์จนกว่ามนุษย์จะยืนยัน
            </div>

            {/* Terminal Output Window */}
            <div className="mt-4 p-3 rounded-lg bg-black border border-slate-800 font-mono text-xs text-emerald-400 max-h-[360px] overflow-y-auto space-y-1">
              <div className="text-slate-500"># Execution terminal: /scripts/git/cleanup-safe.sh</div>
              {cleanupLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  {log.includes('WARNING') ? (
                    <span className="text-amber-400">{log}</span>
                  ) : log.includes('ERROR') || log.includes('CRITICAL') ? (
                    <span className="text-red-400 font-bold">{log}</span>
                  ) : log.includes('SUCCESS') || log.includes('Grounding') ? (
                    <span className="text-cyan-300 font-bold">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
              {isCleaningUp && (
                <div className="text-cyan-400 animate-pulse">
                  &gt; Purging raw cache memory & resetting node boundaries...
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Grounding Protocol: flowpilot-grounding-v2</span>
            <span className="text-emerald-400">Grounding State: STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
