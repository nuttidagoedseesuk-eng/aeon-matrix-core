import React from 'react';
import { Shield, Activity, AlertTriangle, Cpu, Terminal, Smartphone, BookOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'mobile-incident' | 'telemetry' | 'circuit-breaker' | 'terminal' | 'constitution';
  setActiveTab: (tab: 'overview' | 'mobile-incident' | 'telemetry' | 'circuit-breaker' | 'terminal' | 'constitution') => void;
  isolatedCount: number;
  restrictedCount: number;
  onResetGrounding: () => void;
  isGroundingActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isolatedCount,
  restrictedCount,
  onResetGrounding,
  isGroundingActive
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-xl glow-cyan">
              🌌
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-base sm:text-lg tracking-wider text-cyan-400">
                  AEON-MATRIX
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/80 text-cyan-300 font-mono font-medium">
                  V2.0 CONSTITUTION
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                กรอบธรรมนูญสถาปัตยกรรมปิดเพื่อการกำกับดูแลและประเมินสัญญาณชีพ AI Agents
              </p>
            </div>
          </div>

          {/* System Telemetry Badges & Safe Grounding Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isolatedCount > 0 && (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-red-950/80 border border-red-500/60 text-red-300 text-xs font-mono animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>{isolatedCount} ISOLATED</span>
              </span>
            )}

            {restrictedCount > 0 && (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{restrictedCount} RESTRICTED</span>
              </span>
            )}

            <button
              onClick={onResetGrounding}
              disabled={isGroundingActive}
              title="Trigger scripts/git/cleanup-safe.sh Grounding State Reset"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isGroundingActive ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Safe Grounding</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>8 Specialized Agents</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile-incident')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'mobile-incident'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Incident Screen</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'telemetry'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Telemetry Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('circuit-breaker')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'circuit-breaker'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Anthropomorphic Circuit Breaker</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'terminal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Interactive Console (Shell)</span>
          </button>

          <button
            onClick={() => setActiveTab('constitution')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'constitution'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Constitution (ธรรมนูญ)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
