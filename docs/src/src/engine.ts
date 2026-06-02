import { AgentSignal, TelemetryStatus, SelfReportingToken } from './types';

export class CognitiveSupervisionEngine {
  private readonly confidenceThreshold = 0.95;

  public evaluateTelemetryStream(signal: AgentSignal): { action: string; restrictAutonomy: boolean } {
    // 🔒 ตรวจสอบกฎเหล็กต่อต้านการตีความพฤติกรรมเสมือนมนุษย์ (Anti-Anthropomorphism Rule)
    if (signal.isAnthropomorphicDetected) {
      return {
        action: `[CRITICAL ALERT] Resetting isolated node ${signal.agentName}. Triggering scripts/git/cleanup-safe.sh.`,
        restrictAutonomy: true
      };
    }

    // ⚖️ กลไกตรวจสอบระดับความมั่นใจและการสะท้อนกลับขีดจำกัดตนเอง
    if (signal.confidenceScore < this.confidenceThreshold || signal.status === TelemetryStatus.UNCERTAINTY_SPIKE) {
      return {
        action: `[AUTONOMY RESTRICTION] Demoting ${signal.agentName} due to low confidence score. Escalating to Human Review.`,
        restrictAutonomy: true
      };
    }

    // 📡 ตัวดักจับเหตุการณ์ขัดแย้งเชิงตรรกะระหว่างกลุ่ม Baby AI
    if (signal.status === TelemetryStatus.AGENT_CONFLICT || signal.status === SelfReportingToken.CONFLICTING_INPUTS_DETECTED) {
      return {
        action: `[CIRCUIT BREAKER] Conflict detected. Invoking Guardian AI to re-evaluate business logic.`,
        restrictAutonomy: true
      };
    }

    return {
      action: `[ROUTINE] Signal from ${signal.agentName} verified. Proceed with autonomous execution.`,
      restrictAutonomy: false
    };
  }
}
