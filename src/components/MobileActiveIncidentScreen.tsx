import React, { useState } from 'react';
import { AgentProfile, AgentName } from '../types';
import { AlertTriangle, Smartphone, ShieldCheck, Check, X, ShieldAlert, Cpu } from 'lucide-react';

interface MobileActiveIncidentScreenProps {
  agents: AgentProfile[];
  onManualOverrideConfirm: (agentName: AgentName) => void;
  onResolveIncident: (agentName: AgentName) => void;
  selectedAgent?: AgentName | null;
}

export const MobileActiveIncidentScreen: React.FC<MobileActiveIncidentScreenProps> = ({
  agents,
  onManualOverrideConfirm,
  onResolveIncident,
  selectedAgent
}) => {
  const [overrideModalAgent, setOverrideModalAgent] = useState<string | null>(null);
  const [activeTabMode, setActiveTabMode] = useState<'mobile-frame' | 'expanded'>('mobile-frame');

  const handleManualOverride = (agentName: string) => {
    // Replicating React Native Alert.alert modal
    setOverrideModalAgent(agentName);
  };

  const confirmOverride = () => {
    if (overrideModalAgent) {
      onManualOverrideConfirm(overrideModalAgent as AgentName);
      setOverrideModalAgent(null);
    }
  };

  const cancelOverride = () => {
    setOverrideModalAgent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <span>Mobile Active Incident Screen (MobileActiveIncidentScreen.tsx)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            อินเตอร์เฟซจำลองจากคอมโพเนนต์ Mobile ควบคุมการทำ Manual Override และการแทรกแซงโดยมนุษย์ (Human Review)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTabMode('mobile-frame')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTabMode === 'mobile-frame'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            📱 Mobile Frame View
          </button>
          <button
            onClick={() => setActiveTabMode('expanded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTabMode === 'expanded'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            💻 Responsive Expanded
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex justify-center">
        {activeTabMode === 'mobile-frame' ? (
          /* Mobile Device Frame */
          <div className="w-full max-w-sm rounded-[40px] border-4 border-slate-700 bg-black p-4 shadow-2xl shadow-cyan-950/40 relative">
            {/* Top speaker notch */}
            <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></div>
            </div>

            {/* Mobile Screen Header */}
            <div className="text-center pb-4 mb-4 border-b border-slate-800">
              <h1 className="text-cyan-400 font-mono font-extrabold text-lg tracking-wider">
                🌌 AEON-MATRIX CONTROL
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">FLOWPILOT AI INCIDENT MONITOR</p>
            </div>

            {/* Agent Cards Scroll View */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {agents.map((agent) => {
                const isOperational = agent.status === 'OPERATIONAL';
                const isHighPriority = agent.name === selectedAgent;

                return (
                  <div
                    key={agent.id}
                    className={`rounded-xl p-3.5 border transition-all ${
                      agent.isIsolated
                        ? 'bg-red-950/40 border-red-500/80 shadow-md shadow-red-950/50'
                        : isHighPriority
                        ? 'bg-slate-900/90 border-cyan-400 ring-2 ring-cyan-500/30'
                        : isOperational
                        ? 'bg-neutral-900/90 border-neutral-800'
                        : 'bg-stone-900/90 border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-mono font-bold text-sm">{agent.name}</span>
                      </div>
                      <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        isOperational
                          ? 'text-emerald-400 bg-emerald-950/60'
                          : agent.isIsolated
                          ? 'text-rose-400 bg-rose-950/80'
                          : 'text-amber-400 bg-amber-950/60'
                      }`}>
                        สถานะ: {agent.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {agent.lastReport}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Baseline: {(agent.confidenceScore * 100).toFixed(0)}%</span>
                      <span>{agent.isAutonomous ? 'Autonomy: ON' : 'Autonomy: RESTRICTED'}</span>
                    </div>

                    {/* Manual Override Action Button */}
                    {!isOperational ? (
                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={() => handleManualOverride(agent.name)}
                          className="flex-1 py-2 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono tracking-wider transition-colors shadow-lg shadow-red-900/30 flex items-center justify-center space-x-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Manual Override</span>
                        </button>
                        <button
                          onClick={() => onResolveIncident(agent.name)}
                          title="Restore to Operational"
                          className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 text-right">
                        <span className="text-[10px] text-emerald-400/80 font-mono flex items-center justify-end gap-1">
                          <ShieldCheck className="w-3 h-3" /> Autonomous Nominal
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Bottom Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto"></div>
            </div>
          </div>
        ) : (
          /* Responsive Expanded View */
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const isOperational = agent.status === 'OPERATIONAL';

              return (
                <div
                  key={agent.id}
                  className={`rounded-xl p-5 border ${
                    agent.isIsolated
                      ? 'bg-red-950/20 border-red-500/60'
                      : isOperational
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-900/90 border-amber-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-mono font-bold text-base text-slate-100">{agent.name}</h3>
                      <p className="text-xs text-slate-400 font-thai">{agent.domain}</p>
                    </div>
                    <span className={`text-xs font-mono px-2.5 py-1 rounded font-semibold ${
                      isOperational
                        ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40'
                        : agent.isIsolated
                        ? 'text-red-300 bg-red-950/80 border border-red-500/40'
                        : 'text-amber-300 bg-amber-950/80 border border-amber-500/40'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 p-3 rounded-lg bg-black/40 border border-slate-800/80 font-mono">
                    {agent.lastReport}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {!isOperational ? (
                      <>
                        <button
                          onClick={() => handleManualOverride(agent.name)}
                          className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono transition-colors shadow-lg shadow-red-950/60 flex items-center justify-center space-x-1.5"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span>Manual Override</span>
                        </button>
                        <button
                          onClick={() => onResolveIncident(agent.name)}
                          className="py-2 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-mono transition-colors"
                        >
                          Restore
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleManualOverride(agent.name)}
                        className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors border border-slate-700"
                      >
                        Force Human Intervene
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Override Confirmation Modal (Alert.alert simulation) */}
      {overrideModalAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-red-500/60 p-6 shadow-2xl glow-red">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-lg text-slate-100">Manual Override</h3>
                <p className="text-xs text-slate-400">การเข้าควบคุมระบบตรรกะด้วยตนเอง</p>
              </div>
            </div>

            <p className="text-slate-200 text-sm font-thai leading-relaxed mb-6">
              คุณต้องการเข้าควบคุม <strong className="text-cyan-400 font-mono">{overrideModalAgent}</strong> ด้วยตัวเองใช่หรือไม่?
              <span className="block mt-2 text-xs text-slate-400">
                ระบบจะสั่งตัดสิทธิ์การทำงานอัตโนมัติ (Autonomy Restriction) และโอนถ่ายการตัดสินใจไปยัง Human-in-the-loop ทันที
              </span>
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelOverride}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmOverride}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold transition-colors shadow-lg shadow-red-950/60"
              >
                ยืนยันการควบคุม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
