// src/types.ts - AEON-MATRIX Cognitive Operations Ecosystem Types

export enum TelemetryStatus {
  LOW_CONFIDENCE = "Low confidence",
  ESCALATION_REQUEST = "Escalation request",
  CONTEXT_MISMATCH = "Context mismatch",
  REPEATED_FAILURE = "Repeated failure",
  UNCERTAINTY_SPIKE = "Uncertainty spike",
  AGENT_CONFLICT = "Agent conflict"
}

export enum SelfReportingToken {
  MORE_DATA_REQUIRED = "More Data Required",
  SENSOR_UNRELIABLE = "Sensor Unreliable",
  CONFIDENCE_BELOW_THRESHOLD = "Confidence Below Threshold",
  CONFLICTING_INPUTS_DETECTED = "Conflicting Inputs Detected",
  POLICY_AMBIGUITY = "Policy Ambiguity / Edge Case Detected"
}

export type AgentName = 
  | 'Inventory_AI' 
  | 'QC_AI' 
  | 'Workforce_AI' 
  | 'Finance_AI' 
  | 'Risk_AI' 
  | 'Logistics_AI' 
  | 'Campaign_AI' 
  | 'Guardian_AI';

export interface AgentSignal {
  id: string;
  agentName: AgentName;
  timestamp: string;
  status: TelemetryStatus | SelfReportingToken;
  confidenceScore: number;
  reasoningLog: string;
  isAnthropomorphicDetected: boolean;
}

export type AgentHealth = 'OPERATIONAL' | 'LOW_CONFIDENCE' | 'CONFLICT_DETECTED' | 'ESCALATION_REQUIRED' | 'ISOLATED';

export interface AgentProfile {
  id: string;
  name: AgentName;
  thaiName: string;
  role: string;
  domain: string;
  operationalRisk: string;
  telemetryTokens: string[];
  status: AgentHealth;
  confidenceScore: number;
  lastReport: string;
  isAutonomous: boolean;
  isIsolated: boolean;
  reasoningLogSnippet?: string;
}

export interface SupervisionEvaluationResult {
  action: string;
  restrictAutonomy: boolean;
  severity: 'ROUTINE' | 'AUTONOMY_RESTRICTION' | 'CIRCUIT_BREAKER' | 'CRITICAL_ALERT';
  agentName: AgentName;
  timestamp: string;
  signalId: string;
  reason: string;
}

export interface IncidentRecord {
  id: string;
  agentName: AgentName;
  type: 'AUTONOMY_DEMOTION' | 'ANTHROPOMORPHIC_HALLUCINATION' | 'AGENT_CONFLICT' | 'MANUAL_OVERRIDE';
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'RESOLVED' | 'UNDER_REVIEW';
  detectedAt: string;
  details: string;
  reasoningSnippet: string;
  requiresGroundingReset: boolean;
}
