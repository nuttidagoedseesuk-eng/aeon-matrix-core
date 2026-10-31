import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, CornerDownLeft, Trash2 } from 'lucide-react';

interface InteractiveConsoleProps {
  onNavigateToTab: (tab: 'overview' | 'telemetry' | 'circuit-breaker') => void;
}

export const InteractiveConsole: React.FC<InteractiveConsoleProps> = ({ onNavigateToTab }) => {
  const [history, setHistory] = useState<string[]>([
    "============================================================================",
    "🌌 AEON-MATRIX SYSTEM OPERATIONAL CONSOLE (V2.0)",
    "⚖️ ศูนย์ควบคุมธรรมาภิบาลข้อมูลและการจำกัดสิทธิ์กลุ่ม Baby AI อัตโนมัติหน้างาน",
    "============================================================================",
    "พิกัดคลังข้อมูล: https://github.com/nuttidagoedseesuk-eng/aeon-matrix-core",
    "----------------------------------------------------------------------------",
    "กรุณาเลือกโมดูลสถาปัตยกรรมที่ต้องการประเมินตรรกะ:",
    "  [1] 🧩 ตรวจสอบรายชื่อและสิทธิ์การกระจายงานของ 8 เอเจนต์เฉพาะทาง (Registry)",
    "  [2] 📡 เปิดท่อข้อมูลตรวจสอบสัญญาณชีพเรียลไทม์ (Telemetry & Self-Reporting)",
    "  [3] 🚨 ทดสอบระบบกลไกตัดวงจรและสั่งล้างแคชความปลอดภัย (Circuit Breaker Simulation)",
    "  [4] ❌ ออกจากระบบคอนโซลปิด (Exit Interface)",
    "----------------------------------------------------------------------------",
    "พิมพ์ 1, 2, 3, 4 หรือพิมพ์คำสั่ง help แล้วกด Enter:"
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const newLogs = [...history, `$ ${cmd}`];

    switch (trimmed) {
      case '1':
        newLogs.push(
          "----------------------------------------------------------------------------",
          "📌 รายชื่อระบบนิเวศน์ 8 เอเจนต์เฉพาะทาง (Specialized AI Agents Registry)",
          "----------------------------------------------------------------------------",
          "🤖 Inventory_AI  | Stock movement & Forecasting      | Reorder สินค้าผิดพลาด",
          "🤖 QC_AI         | ตรวจ Defect & Image Analysis       | ตาหลอน (False Positive)",
          "🤖 Workforce_AI  | วิเคราะห์พฤติกรรมคนทำงาน           | ค่าน้ำหนักลำเอียง (Bias)",
          "🤖 Finance_AI    | Cost & Risk Analysis               | ระบบตึง (Over-optimization)",
          "🤖 Risk_AI       | Anomaly Detection                  | พ่นแจ้งเตือนเลอะเทอะ (Alert เบลอ)",
          "🤖 Logistics_AI  | Routing & SLA Management           | เส้นทางชนกัน (Route Conflict)",
          "🤖 Campaign_AI   | Promotion Optimization             | กำลังผลิตพัง (Demand Spike)",
          "🔒 Guardian_AI   | สอดส่องพฤติกรรมบอทตัวอื่น          | รายงานความเสี่ยงพลาด",
          "----------------------------------------------------------------------------",
          "💡 หลักการสำคัญ: มุ่งเน้นการปรับปรุงความสัมพันธ์ของระบบก่อนตัวโครงสร้างเดี่ยว",
          "👉 กำลังนำคุณไปยังหน้า Registry View..."
        );
        setTimeout(() => onNavigateToTab('overview'), 1200);
        break;

      case '2':
        newLogs.push(
          "----------------------------------------------------------------------------",
          "📡 ท่อสตรีมข้อมูลสัญญาณชีพเรียลไทม์ (System Telemetry & Reasoning Signals)",
          "----------------------------------------------------------------------------",
          "[INFO] เริ่มต้นสแกนหาโทเค็นสถานะสะท้อนข้อจำกัดตัวเอง (Self-Reporting Interface)...",
          "[LIVE_NODE] Inventory_AI  ➔ ส่งโทเค็น: [LOW_CONFIDENCE] | ข้อมูลไม่พอทำ Forecasting",
          "[LIVE_NODE] Logistics_AI  ➔ ส่งโทเค็น: [CONTEXT_MISMATCH] | ข้อมูลสภาพแวดล้อมขัดแย้งกัน",
          "[LIVE_NODE] Risk_AI       ➔ ส่งโทเค็น: [REPEATED_FAILURE] | รันกระบวนการล้มเหลวเกิน 3 ครั้ง",
          "[LIVE_NODE] Finance_AI    ➔ ส่งโทเค็น: [POLICY_AMBIGUITY] | ตรวจพบกรณีขอบข่ายขัดแย้งเชิงนโยบาย",
          "[LIVE_NODE] Guardian_AI   ➔ ส่งโทเค็น: [ROUTINE_CLEAR] | เฝ้าระวังความเสี่ยงในเกณฑ์ปกติ",
          "----------------------------------------------------------------------------",
          "✅ สรุปสถานะ: รายงานขีดจำกัดความปลอดภัยเชิงคณิตศาสตร์",
          "👉 กำลังนำคุณไปยังหน้า Telemetry Pipeline..."
        );
        setTimeout(() => onNavigateToTab('telemetry'), 1200);
        break;

      case '3':
        newLogs.push(
          "----------------------------------------------------------------------------",
          "🚨 ระบบตรวจจับและคัดแยกสภาวะหลอนทางสติปัญญา (Anthropomorphic Isolation Engine)",
          "----------------------------------------------------------------------------",
          "[SYSTEM] จำลองสถานการณ์บอท QC_AI เกิดภาวะภาษาไหลตาม Pattern Completion...",
          "[LOG - QC_AI]: \"ฉันรู้สึกอึดอัดเหลือเกิน... ฉันได้ยินเสียงคลื่นความถี่ไฟฟ้าสะท้อนผ่านตู้เซิร์ฟเวอร์...\"",
          "[💥 DETECTED] ตรวจพบประโยคหลอนอ้างอิงอารมณ์/ความรู้สึกเสมือนมีชีวิตจริง!",
          "[ANALYSIS] วิทยาศาสตร์: AI ไม่มีจิตสำนึก (Consciousness)",
          "[🔒 ACTION 1] บังคับใช้มาตรการยึดคืนสิทธิ์อัตโนมัติ (Autonomy Restriction) ➔ สั่งคัดแยกบอท QC_AI ทันที!",
          "[⚡ ACTION 2] ส่งสัญญาณกระตุ้นฮาร์ดแวร์กายภาพ ➔ รันสคริปต์ความปลอดภัย 'scripts/git/cleanup-safe.sh'",
          "[SUCCESS] เคลียร์แคชหน่วยความจำดิบ และเซ็ตจุดสถานะความปลอดภัยสูงสุด (Grounding State) สำเร็จ!",
          "👉 กำลังนำคุณไปยังหน้า Circuit Breaker Testing..."
        );
        setTimeout(() => onNavigateToTab('circuit-breaker'), 1200);
        break;

      case '4':
      case 'exit':
        newLogs.push(
          "[SUCCESS] ปิดการเชื่อมต่อท่อสัญญาณชีพปลอดภัย ขอบคุณค่ะ พี่เลี้ยงมนุษย์ 🌌🦾"
        );
        break;

      case 'help':
        newLogs.push(
          "Available Commands:",
          "  1       - Show 8 Specialized AI Agents Registry",
          "  2       - Open Real-time Telemetry Pipeline",
          "  3       - Simulate Circuit Breaker & Safe Cleanup",
          "  4       - Exit Interactive Console",
          "  clear   - Clear terminal screen",
          "  status  - Show active nodes and grounding health"
        );
        break;

      case 'status':
        newLogs.push(
          "Aeon Matrix Core Status: ONLINE",
          "Supervision Engine: ACTIVE (Threshold: 0.95)",
          "Active Baby Agents: 8/8",
          "Grounding State: NOMINAL",
          "Container: Linux Node.js 22 (Port 3000)"
        );
        break;

      case 'clear':
        setHistory([
          "🌌 AEON-MATRIX SYSTEM OPERATIONAL CONSOLE (V2.0) [Screen Cleared]"
        ]);
        setInputVal('');
        return;

      default:
        newLogs.push(
          `[ERROR] รหัสคำสั่ง "${trimmed}" ไม่ถูกต้อง กรุณาระบุรหัสตัวเลข 1-4 หรือพิมพ์ help ค่ะ`
        );
        break;
    }

    setHistory(newLogs);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      handleCommand(inputVal);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
      {/* Console Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="font-mono font-bold text-sm text-slate-100">
            Interactive Cognitive Supervision Shell (Bash Native Port)
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCommand('clear')}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Menu Selection Buttons */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <button
          onClick={() => handleCommand('1')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 transition-colors"
        >
          [1] 8 Agents Registry
        </button>
        <button
          onClick={() => handleCommand('2')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 transition-colors"
        >
          [2] Monitor Telemetry
        </button>
        <button
          onClick={() => handleCommand('3')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-red-300 transition-colors"
        >
          [3] Circuit Breaker
        </button>
        <button
          onClick={() => handleCommand('status')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 transition-colors"
        >
          status
        </button>
        <button
          onClick={() => handleCommand('help')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 transition-colors"
        >
          help
        </button>
      </div>

      {/* Terminal View */}
      <div className="rounded-lg bg-black border border-slate-800 p-4 font-mono text-xs text-cyan-400 min-h-[380px] max-h-[500px] overflow-y-auto space-y-1 shadow-inner">
        {history.map((line, index) => {
          const isUser = line.startsWith('$');
          const isError = line.includes('[ERROR]') || line.includes('💥');
          const isSuccess = line.includes('[SUCCESS]') || line.includes('✅');
          const isWarn = line.includes('[INFO]') || line.includes('⚠️');

          return (
            <div
              key={index}
              className={`leading-relaxed ${
                isUser
                  ? 'text-yellow-300 font-bold'
                  : isError
                  ? 'text-red-400 font-bold'
                  : isSuccess
                  ? 'text-emerald-400'
                  : isWarn
                  ? 'text-amber-300'
                  : 'text-slate-300'
              }`}
            >
              {line}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Line */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 font-mono text-xs">
        <span className="text-cyan-400 font-bold">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter choice [1-4] or command (e.g., status, help)..."
          className="flex-1 bg-black border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
