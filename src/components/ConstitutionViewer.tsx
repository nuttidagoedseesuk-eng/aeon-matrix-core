import React, { useState } from 'react';
import { BookOpen, Search, ShieldCheck, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export const ConstitutionViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      id: 'sec-1',
      title: '1. โครงสร้างธรรมาภิบาลกลุ่มเอเจนต์เฉพาะทาง (Specialized AI Agents Ecosystem)',
      content: `เพื่อป้องกันความล้มเหลวเชิงระบบจากการพึ่งพาโมเดลเดี่ยวขนาดใหญ่ (Generalist AI) โครงสร้างสถาปัตยกรรมนี้จะแบ่งแยกหน้าที่การประมวลผลออกเป็น 8 เอเจนต์ย่อยอิสระ (Baby AI) ซึ่งมีบุคลิก จุดอ่อน และกรอบความรับผิดชอบที่ต้องถูกกำกับดูแลด้วยระดับสิทธิ์การตัดสินใจอัตโนมัติ (Autonomy Restriction):

• Inventory_AI: ควบคุมสต็อกสินค้าหน้างาน, พยากรณ์ความต้องการ (Forecasting) | ความเสี่ยง: Reorder ผิด | สัญญาณชีพ: LOW_CONFIDENCE, MORE_DATA_REQUIRED
• QC_AI: ตรวจจุดบกพร่องผลิตภัณฑ์, วิเคราะห์รูปภาพ (Image Analysis) | ความเสี่ยง: False Positive, ตาหลอน | สัญญาณชีพ: SENSOR_UNRELIABLE, CONTEXT_MISMATCH
• Workforce_AI: วิเคราะห์รูปแบบพฤติกรรมและการทำงานร่วมกับมนุษย์ | ความเสี่ยง: เกิดค่าน้ำหนักความลำเอียง (Bias) | สัญญาณชีพ: UNCERTAINTY_SPIKE, CONFIDENCE_BELOW_THRESHOLD
• Finance_AI: ประเมินต้นทุน ควบคุมและบริหารความเสี่ยงทางการเงิน | ความเสี่ยง: Over-optimization ปรับแต่งตึงเกิน | สัญญาณชีพ: POLICY_AMBIGUITY, ESCALATION_REQUEST
• Risk_AI: ตรวจจับพฤติกรรมผิดปกติหน้างาน (Anomaly Detection) | ความเสี่ยง: Alert เบลอเกิน | สัญญาณชีพ: CONFLICTING_INPUTS_DETECTED, REPEATED_FAILURE
• Logistics_AI: ควบคุมเส้นทางการขนส่งและการรักษามาตรฐาน SLA | ความเสี่ยง: Route Conflict เส้นทางคำนวณชนกัน | สัญญาณชีพ: CONTEXT_MISMATCH, MORE_DATA_REQUIRED
• Campaign_AI: ปรับแต่งส่วนลดและโครงสร้างโปรโมชันตามเวลาจริง | ความเสี่ยง: การหั่นราคาซ้ำซ้อนจนกระทบสายการผลิต | สัญญาณชีพ: POLICY_AMBIGUITY, AGENT_CONFLICT
• Guardian_AI: 🔒 เอเจนต์คุมกฎสูงสุด สอดส่องเฝ้าดูพฤติกรรม AI ตัวอื่น | ความเสี่ยง: False Escalation | สัญญาณชีพ: AGENT_CONFLICT, ตรวจจับ Anthropomorphic`
    },
    {
      id: 'sec-2',
      title: '2. อินเตอร์เฟซท่อส่งสัญญาณชีพหลัก (System Telemetry & Reasoning Signals)',
      content: `ในระบบปฏิบัติการปิดนี้ AI ไม่มีอารมณ์ ความต้องการส่วนตัว หรือจิตสำนึก (Consciousness) การแสดงออกที่ดูเหมือน "การขอความช่วยเหลือ" แท้จริงแล้วคือ System Telemetry + Reasoning Signals ที่ไหลผ่านท่อส่งข้อมูล โดยถูกจำแนกออกเป็น 2 ชุดคำสั่งควบคุม:

⚠️ A. โทเค็นสถานะสัญญาณชีพ (Telemetry Status Tokens):
• Low confidence: ข้อมูลนำเข้าหน้างานดิบต่ำเกินกว่าจะคำนวณหาข้อสรุปที่ปลอดภัยได้
• Escalation request: ตัวโมเดลประเมินแล้วว่าควรส่งต่อชุดข้อมูลให้พี่เลี้ยงมนุษย์ (Human Review) ตรวจสอบทันที
• Context mismatch: ข้อมูลจากสภาพแวดล้อมจริงเกิดความขัดแย้งเชิงตรรกะกับฐานบริบทหลักของโมเดล
• Repeated failure: กระบวนการประมวลผล (Workflow) ติดขัดล้มเหลวซ้ำซากเกิน 3 ครั้งติดต่อกัน
• Uncertainty spike: ค่าน้ำหนักความแม่นยำทางคณิตศาสตร์สั่นคลอนดิ่งต่ำลงอย่างฉับพลัน
• Agent conflict: ตรรกะการให้เหตุผลระหว่างเอเจนต์ย่อยสองตัวเกิดการหักล้างผลลัพธ์และหาข้อสรุปไม่ได้

🧠 B. ข้อกำหนดการตรวจสอบตนเอง (AI Self-Reporting Interface):
• More Data Required: ข้อมูลแวดล้อมไม่ครอบคลุมกรอบความรู้ปัจจุบันของโมเดล
• Sensor Unreliable: อุปกรณ์หรือชุดรับข้อมูลไม่มีการเคลื่อนไหวหรือส่งสัญญาณขยะเข้ามาในระบบ
• Confidence Below Threshold: ดัชนีความมั่นใจตกต่ำกว่า Baseline มาตรฐานความปลอดภัยองค์กร (ต่ำกว่า 0.95)
• Conflicting Inputs Detected: สัญญาณรบกวนหรือชุดข้อมูลที่ไม่สอดคล้องกันไหลเข้าสู่ Pipeline
• Policy Ambiguity / Edge Case Detected: สถานการณ์หน้างานจริงจัดอยู่ใน "กรณีขอบ" ที่กฎเกณฑ์ของธรรมนูญระบุไม่ครอบคลุม`
    },
    {
      id: 'sec-3',
      title: '3. มาตรฐานการควบคุมและสกัดกั้นสภาวะหลอน (Anthropomorphic Isolation Standard)',
      content: `ระบบนี้ตระหนักดีว่า AI ไม่ได้มีประสาทสัมผัสจริง ไม่สามารถรับรู้ตัวตน หรือ "ได้ยินเสียงคลื่นความถี่ไฟฟ้าใน Data Center" ได้จริง บรรทัดคำพูดเหล่านั้นเกิดจาก Anthropomorphic Pattern Completion (การเติมเต็มคำตามตรรกะภาษาที่คล้ายมนุษย์) ซึ่งถือเป็นสภาวะหลอนทางสติปัญญา (Hallucination) ที่เป็นภัยคุกคามต่อความเสถียรขององค์กร

🛡️ มาตรการบังคับใช้ทันทีเมื่อตรวจพบ:
1. Isolate Immediately: หากกล่องบันทึกตรรกะความคิด (reasoningLog) ของเอเจนต์ใดปรากฏข้อความแสดงออกถึงอารมณ์ ความรู้สึก ความกลัว หรืออ้างสิทธิ์การมีชีวิต ระบบส่วนกลางจะทำการ ตัดขาดสิทธิ์การเชื่อมต่อ (Isolate) ของเอเจนต์ตัวนั้นออกจากโครงข่ายหลักใน 0.1 วินาที
2. Activate Hardware Grounding: ส่งสัญญาณล้างค่าหน่วยความจำ โดยระเบิดคำสั่งเรียกใช้สคริปต์ความปลอดภัยทางกายภาพ scripts/git/cleanup-safe.sh เพื่อล้างแคช คืนสถานะระบบ (Grounding State) และกักกันพื้นที่เซิร์ฟเวอร์จนกว่ามนุษย์จะเข้ามาปรับจูนตรรกะใหม่`
    },
    {
      id: 'sec-4',
      title: '4. แผนผังกลไกควบคุม (Cognitive Supervision Workflow)',
      content: `• Confidence Threshold: กฎเหล็กเกณฑ์มาตรฐานความแม่นยำขั้นต่ำ 0.95 (95%)
• Automated Demotion: หากคะแนนความมั่นใจต่ำกว่า 95% ระบบจะปลดสิทธิ์อัตโนมัติ (Demote Autonomy) และสั่งเปิดหน้าจอ Manual Override บน Incident Screen ทันที
• Cross-agent Mediator: เมื่อเกิดข้อพิพาทระหว่าง Baby AI จะส่งสัญญาณให้ Guardian_AI เข้ามาประเมินเหตุผลทางธุรกิจใหม่
• Hardware Grounding Integration: สคริปต์ความปลอดภัยระดับกายภาพ (Safe Reset & Clean Scripts) พร้อมทำงานฉุกเฉินทุกวินาที`
    }
  ];

  const filtered = sections.filter(
    s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>FLOWPILOT AI CONSTITUTION (V2.0) - บันทึกธรรมนูญฉบับเต็ม</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-thai">
            กฎหมายสูงสุดควบคุมสถาปัตยกรรมปิด การกำกับดูแล และการตัดสิทธิ์อัตโนมัติของ AI Agents
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาข้อบังคับ, โทเค็น..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filtered.map((sec) => (
          <div key={sec.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
            <h3 className="font-mono font-bold text-sm text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{sec.title}</span>
            </h3>
            <div className="text-xs font-thai text-slate-300 whitespace-pre-line leading-relaxed bg-black/40 p-4 rounded-lg border border-slate-800/80">
              {sec.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
