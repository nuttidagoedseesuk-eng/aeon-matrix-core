import React, { useState, useEffect } from 'react';
import {
  AgentProfile,
  AgentSignal,
  AgentName,
  TelemetryStatus,
  SelfReportingToken,
  SupervisionEvaluationResult,
} from './types';
import { INITIAL_AGENTS } from './data/agents';
import { supervisionEngine } from './engine/CognitiveSupervisionEngine';
import { Header } from './components/Header';
import { AgentRegistry } from './components/AgentRegistry';
import { MobileActiveIncidentScreen } from './components/MobileActiveIncidentScreen';
import { TelemetryMonitor } from './components/TelemetryMonitor';
import { CircuitBreakerSimulation } from './components/CircuitBreakerSimulation';
import { InteractiveConsole } from './components/InteractiveConsole';
import { ConstitutionViewer } from './components/ConstitutionViewer';

export function App() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'mobile-incident' | 'telemetry' | 'circuit-breaker' | 'terminal' | 'constitution'
  >('overview');

  const [agents, setAgents] = useState<AgentProfile[]>(INITIAL_AGENTS);
  const [signals, setSignals] = useState<AgentSignal[]>([]);
  const [evaluations, setEvaluations] = useState<Record<string, SupervisionEvaluationResult>>({});
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedMobileAgent, setSelectedMobileAgent] = useState<AgentName | null>(null);

  // Grounding state
  const [isCleaningUp, setIsCleaningUp] = useState<boolean>(false);
  const [cleanupLogs, setCleanupLogs] = useState<string[]>([
    "[SYSTEM BOOT] FlowPilot AI Constitution V2.0 initialized.",
    "[STATUS] 8 Specialized AI Agents active. Grounding baseline: 0.95.",
    "[SCRIPTS] Safe physical scripts mapped: /scripts/git/cleanup-safe.sh, /scripts/git/reset-safe.sh."
  ]);

  // Initial seed signals
  useEffect(() => {
    const seedSignals: Omit<AgentSignal, 'id' | 'timestamp'>[] = [
      {
        agentName: 'Inventory_AI',
        status: TelemetryStatus.LOW_CONFIDENCE,
        confidenceScore: 0.91,
        reasoningLog: 'Historical inventory dataset insufficient to forecast spike in region 3.',
        isAnthropomorphicDetected: false
      },
      {
        agentName: 'Logistics_AI',
        status: TelemetryStatus.CONTEXT_MISMATCH,
        confidenceScore: 0.93,
        reasoningLog: 'Ground transit real-time GPS telemetry conflicts with forecasted SLA lane.',
        isAnthropomorphicDetected: false
      },
      {
        agentName: 'Risk_AI',
        status: TelemetryStatus.REPEATED_FAILURE,
        confidenceScore: 0.89,
        reasoningLog: 'Sub-pipeline execution returned retry code 3 consecutive iterations.',
        isAnthropomorphicDetected: false
      },
      {
        agentName: 'Guardian_AI',
        status: SelfReportingToken.POLICY_AMBIGUITY,
        confidenceScore: 0.97,
        reasoningLog: 'Routine surveillance cycle passed. Monitored 7 baby agent reasoning buffers.',
        isAnthropomorphicDetected: false
      }
    ];

    seedSignals.forEach((s) => handleProcessNewSignal(s));
  }, []);

  // Periodic Telemetry Stream Simulator
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const candidates: AgentName[] = [
        'Inventory_AI',
        'QC_AI',
        'Workforce_AI',
        'Finance_AI',
        'Risk_AI',
        'Logistics_AI',
        'Campaign_AI'
      ];
      const randomAgent = candidates[Math.floor(Math.random() * candidates.length)];
      const randomScore = 0.88 + Math.random() * 0.11; // 0.88 - 0.99
      const isSubBaseline = randomScore < 0.95;

      const randomTokens = [
        TelemetryStatus.LOW_CONFIDENCE,
        TelemetryStatus.CONTEXT_MISMATCH,
        TelemetryStatus.UNCERTAINTY_SPIKE,
        SelfReportingToken.MORE_DATA_REQUIRED,
        SelfReportingToken.SENSOR_UNRELIABLE,
        SelfReportingToken.POLICY_AMBIGUITY
      ];
      const chosenToken = isSubBaseline
        ? randomTokens[Math.floor(Math.random() * randomTokens.length)]
        : SelfReportingToken.MORE_DATA_REQUIRED;

      handleProcessNewSignal({
        agentName: randomAgent,
        status: chosenToken,
        confidenceScore: parseFloat(randomScore.toFixed(3)),
        reasoningLog: `Automated telemetry tick for ${randomAgent}. Evaluated data distribution covariance.`,
        isAnthropomorphicDetected: false
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleProcessNewSignal = (signalInput: Omit<AgentSignal, 'id' | 'timestamp'>) => {
    const id = `sig-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toISOString();
    const newSignal: AgentSignal = {
      ...signalInput,
      id,
      timestamp
    };

    // Run Supervision Engine
    const evalResult = supervisionEngine.evaluateTelemetryStream(newSignal);

    setSignals((prev) => [newSignal, ...prev.slice(0, 49)]);
    setEvaluations((prev) => ({ ...prev, [id]: evalResult }));

    // Update agent telemetry and confidence score
    setAgents((prev) =>
      prev.map((a) => {
        if (a.name === newSignal.agentName) {
          if (evalResult.restrictAutonomy) {
            const nextStatus =
              evalResult.severity === 'CRITICAL_ALERT'
                ? 'ISOLATED'
                : evalResult.severity === 'CIRCUIT_BREAKER'
                ? 'CONFLICT_DETECTED'
                : 'LOW_CONFIDENCE';

            return {
              ...a,
              status: nextStatus,
              isAutonomous: false,
              isIsolated: evalResult.severity === 'CRITICAL_ALERT' ? true : a.isIsolated,
              confidenceScore: newSignal.confidenceScore,
              lastReport: newSignal.reasoningLog
            };
          } else {
            // Nominal/routine signal: update score & report; restore status if was LOW_CONFIDENCE and score >= 0.95
            const restoredStatus =
              a.status === 'LOW_CONFIDENCE' && newSignal.confidenceScore >= 0.95
                ? 'OPERATIONAL'
                : a.status;

            return {
              ...a,
              status: restoredStatus,
              confidenceScore: newSignal.confidenceScore,
              lastReport: newSignal.reasoningLog
            };
          }
        }
        return a;
      })
    );
  };

  // Toggle autonomy directly from agent card
  const handleToggleAutonomy = (agentName: AgentName) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.name === agentName) {
          const nextAuto = !a.isAutonomous;
          return {
            ...a,
            isAutonomous: nextAuto,
            status: nextAuto ? 'OPERATIONAL' : 'ESCALATION_REQUIRED',
            lastReport: nextAuto
              ? 'Autonomy restored by human supervisor.'
              : 'Autonomy manually restricted by supervisor.'
          };
        }
        return a;
      })
    );
  };

  // Trigger test signal from agent card
  const handleTriggerTestSignal = (agentName: AgentName) => {
    handleProcessNewSignal({
      agentName,
      status: TelemetryStatus.LOW_CONFIDENCE,
      confidenceScore: 0.90,
      reasoningLog: `Manual test telemetry pulse initiated for ${agentName}.`,
      isAnthropomorphicDetected: false
    });
    setActiveTab('telemetry');
  };

  const handleSelectAgentForIncident = (agentName: AgentName) => {
    setSelectedMobileAgent(agentName);
    setActiveTab('mobile-incident');
  };

  // Handle Manual Override confirmed from mobile incident screen
  const handleManualOverrideConfirm = (agentName: AgentName) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.name === agentName) {
          return {
            ...a,
            status: 'ESCALATION_REQUIRED',
            isAutonomous: false,
            lastReport: `Manual override active. Human supervisor in full control of ${agentName}.`
          };
        }
        return a;
      })
    );

    // Emit event
    handleProcessNewSignal({
      agentName,
      status: TelemetryStatus.ESCALATION_REQUEST,
      confidenceScore: 0.95,
      reasoningLog: `Human supervisor engaged Manual Override on node ${agentName}.`,
      isAnthropomorphicDetected: false
    });
  };

  // Restore incident
  const handleResolveIncident = (agentName: AgentName) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.name === agentName) {
          return {
            ...a,
            status: 'OPERATIONAL',
            isAutonomous: true,
            isIsolated: false,
            confidenceScore: 0.98,
            lastReport: 'Operational equilibrium verified. Returned to autonomous operation.'
          };
        }
        return a;
      })
    );
  };

  // Trigger Article 3 isolation
  const handleTriggerIsolation = (agentName: AgentName, reasoning: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.name === agentName) {
          return {
            ...a,
            status: 'ISOLATED',
            isAutonomous: false,
            isIsolated: true,
            confidenceScore: 0.50,
            lastReport: `[ISOLATED] Hallucination pattern detected: "${reasoning.slice(0, 60)}..."`
          };
        }
        return a;
      })
    );

    handleProcessNewSignal({
      agentName,
      status: TelemetryStatus.AGENT_CONFLICT,
      confidenceScore: 0.50,
      reasoningLog: reasoning,
      isAnthropomorphicDetected: true
    });
  };

  // Restore agent from isolation
  const handleRestoreAgent = (agentName: AgentName) => {
    handleResolveIncident(agentName);
  };

  // Run cleanup-safe.sh simulation
  const handleRunSafeCleanupScript = () => {
    setIsCleaningUp(true);
    setCleanupLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Executing /scripts/git/cleanup-safe.sh...`,
      "WARNING: This will remove untracked files (SAFE CLEAN MODE)",
      "git clean -nd previewing untracked buffers...",
      "Purging raw cache memory & resetting node boundaries...",
      "Re-establishing safe Grounding State..."
    ]);

    setTimeout(() => {
      setIsCleaningUp(false);
      setCleanupLogs((prev) => [
        ...prev,
        "Cleanup completed. Physical grounding baseline locked at 0.95. System secure.",
        "----------------------------------------------------------------------------"
      ]);
    }, 1200);
  };

  const isolatedCount = agents.filter((a) => a.isIsolated).length;
  const restrictedCount = agents.filter((a) => !a.isAutonomous).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col matrix-grid">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isolatedCount={isolatedCount}
        restrictedCount={restrictedCount}
        onResetGrounding={handleRunSafeCleanupScript}
        isGroundingActive={isCleaningUp}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <AgentRegistry
            agents={agents}
            signals={signals}
            onToggleAutonomy={handleToggleAutonomy}
            onTriggerTestSignal={handleTriggerTestSignal}
            onSelectAgentForIncident={handleSelectAgentForIncident}
          />
        )}

        {activeTab === 'mobile-incident' && (
          <MobileActiveIncidentScreen
            agents={agents}
            onManualOverrideConfirm={handleManualOverrideConfirm}
            onResolveIncident={handleResolveIncident}
            selectedAgent={selectedMobileAgent}
          />
        )}

        {activeTab === 'telemetry' && (
          <TelemetryMonitor
            signals={signals}
            evaluations={evaluations}
            onSendSignal={handleProcessNewSignal}
            isStreaming={isStreaming}
            setIsStreaming={setIsStreaming}
          />
        )}

        {activeTab === 'circuit-breaker' && (
          <CircuitBreakerSimulation
            agents={agents}
            onTriggerIsolation={handleTriggerIsolation}
            onRestoreAgent={handleRestoreAgent}
            onRunSafeCleanupScript={handleRunSafeCleanupScript}
            isCleaningUp={isCleaningUp}
            cleanupLogs={cleanupLogs}
          />
        )}

        {activeTab === 'terminal' && (
          <InteractiveConsole
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'constitution' && <ConstitutionViewer />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌌 AEON-MATRIX SYSTEM CONSTITUTION (V2.0) — FlowPilot AI Engine</span>
          <span>Repository: nuttidagoedseesuk-eng/aeon-matrix-core</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
