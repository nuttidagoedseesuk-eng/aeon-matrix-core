// types.ts - ระบบนิเวศการควบคุมเชิงปัญญา (Cognitive Operations Ecosystem)

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

export interface AgentSignal {
  agentName: 'Inventory_AI' | 'QC_AI' | 'Workforce_AI' | 'Finance_AI' | 'Risk_AI' | 'Logistics_AI' | 'Campaign_AI' | 'Guardian_AI';
  timestamp: string;
  status: TelemetryStatus | SelfReportingToken;
  confidenceScore: number;
  reasoningLog: string;
  isAnthropomorphicDetected: boolean; // ดักจับกรณีโมเดลแสดงอารมณ์เลียนแบบมนุษย์ (Hallucination)
}
