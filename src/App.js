import React, { useState, useEffect } from 'react';

export default function App() {
  const [panelWidth, setPanelWidth] = useState(1134);
  const [panelLength, setPanelLength] = useState(2382);
  const [panelOrientation, setPanelOrientation] = useState('horizontal'); 
  const [panelCountPerString, setPanelCountPerString] = useState(10);
  const [stringCount, setStringCount] = useState(3); 
  const [lFeetSpace, setLFeetSpace] = useState(1200);
  const [railLength, setRailLength] = useState(4200);
  const [midClampSpace, setMidClampSpace] = useState(20);
  const [overhang, setOverhang] = useState(100);

  const [results, setResults] = useState({
    totalRailLength: 0,
    totalRailsNeeded: 0,
    midClamps: 0,
    endClamps: 0,
    splices: 0,
    lFeetCount: 0,
    panelTotalDim: 0
  });

  // กำหนดขนาดตามจริง (แนวนอน: กว้าง = panelLength, สูง = panelWidth)
  const currentW = panelOrientation === 'vertical' ? panelWidth : panelLength;
  const currentL = panelOrientation === 'vertical' ? panelLength : panelWidth;

  useEffect(() => {
    const panelsDim = (panelCountPerString * currentW) + ((panelCountPerString - 1) * midClampSpace);
    const rowLenMM = panelsDim + (2 * overhang);
    
    const midPerString = (panelCountPerString - 1) * 2;
    const railsPerSide = Math.ceil(rowLenMM / railLength);
    const railsPerString = railsPerSide * 2;
    const splicesPerString = Math.max(0, (railsPerSide - 1) * 2); 
    const lFeetPerString = (Math.ceil(rowLenMM / lFeetSpace) + 1) * 2;

    setResults({
      totalRailLength: (rowLenMM / 1000).toFixed(2),
      totalRailsNeeded: railsPerString * stringCount,
      midClamps: midPerString * stringCount,
      endClamps: 4 * stringCount,
      splices: splicesPerString * stringCount,
      lFeetCount: lFeetPerString * stringCount,
      panelTotalDim: (panelsDim / 1000).toFixed(2)
    });
  }, [currentW, currentL, panelCountPerString, stringCount, lFeetSpace, railLength, midClampSpace, overhang, panelOrientation]);

  const renderVisualizer = () => {
    const panelsDimMM = (panelCountPerString * currentW) + ((panelCountPerString - 1) * midClampSpace);
    const railLenMM = panelsDimMM + (2 * overhang);

    if (panelOrientation === 'vertical') {
      // --- แบบแนวตั้ง (Portrait) ---
      const totalW = railLenMM + 400;
      const totalH = (currentL * stringCount) + (stringCount * 500);

      return (
        <svg viewBox={`-200 -200 ${totalW} ${totalH}`} style={{ width: '100%', height: 'auto', background: '#1e293b', borderRadius: '12px' }}>
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const yOff = sIdx * (currentL + 400);
            return (
              <g key={sIdx}>
                <rect x="0" y={yOff + currentL * 0.25} width={railLenMM} height="35" fill="#94a3b8" rx="5" />
                <rect x="0" y={yOff + currentL * 0.75} width={railLenMM} height="35" fill="#94a3b8" rx="5" />
                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect key={pIdx} x={overhang + (pIdx * (currentW + midClampSpace))} y={yOff} width={currentW} height={currentL} fill="#334155" stroke="#475569" strokeWidth="10" rx="5" />
                ))}
              </g>
            );
          })}
        </svg>
      );
    } else {
      // --- แบบแนวนอน (Landscape) แก้ไขตามรูปตัวอย่าง: 3 สตริงขนานกันซ้ายไปขวา ---
      const stringWidth = currentW + 500; // ระยะห่างต่อ 1 สตริง
      const totalW = stringWidth * stringCount;
      const totalH = railLenMM + 500;

      return (
        <svg viewBox={`-300 -200 ${totalW} ${totalH}`} style={{ width: '100%', height: 'auto', background: '#1e293b', borderRadius: '12px' }}>
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const xOff = sIdx * stringWidth;
            return (
              <g key={sIdx}>
                {/* รางแนวดิ่ง 2 เส้นสำหรับยึดแผงแนวนอน (ขนานกันไปทางขวา) */}
                <rect x={xOff + currentW * 0.2} y="0" width="45" height={railLenMM} fill="#94a3b8" rx="10" />
                <rect x={xOff + currentW * 0.8} y="0" width="45" height={railLenMM} fill="#94a3b8" rx="10" />
                
                {/* วาดแผงแนวนอนเรียงจากบนลงล่างตามแนวราง */}
                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect 
                    key={pIdx} 
                    x={xOff} 
                    y={overhang + (pIdx * (currentL + midClampSpace))} 
                    width={currentW} 
                    height={currentL} 
                    fill="#0ea5e9" 
                    stroke="#fff" 
                    strokeWidth="12" 
                    rx="5" 
                  />
                ))}
              </g>
            );
          })}
        </svg>
      );
    }
  };

  return (
    <div style={{ padding: "15px", maxWidth: "1250px", margin: "0 auto", fontFamily: "sans-serif", backgroundColor: "#f8fafc" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.1)", padding: "25px" }}>
        <h2 style={{ color: "#1e3a8a", textAlign: "center", marginBottom: "25px" }}>UD Solarmax engineering calc v5.5</h2>
        
        <div style={{ marginBottom: "25px", background: '#0f172a', padding: '20px', borderRadius: '15px' }}>
          <div style={{ width: '100%', overflowX: 'auto' }}>
             {renderVisualizer()}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px" }}>
          {/* ส่วนตั้งค่า */}
          <div style={{ background: "#ffffff", padding: "25px", borderRadius: "15px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "18px", color: "#334155" }}>⚙️ ตั้งค่าการติดตั้ง</h3>
            <select value={panelOrientation} onChange={(e) => setPanelOrientation(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "16px" }}>
              <option value="horizontal">แนวนอน (Landscape)</option>
              <option value="vertical">แนวตั้ง (Portrait)</option>
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <InputBlock label="แผงกว้าง (mm)" value={panelWidth} onChange={setPanelWidth} />
              <InputBlock label="แผงยาว (mm)" value={panelLength} onChange={setPanelLength} />
              <InputBlock label="แผง/สตริง" value={panelCountPerString} onChange={setPanelCountPerString} />
              <InputBlock label="จำนวนสตริง" value={stringCount} onChange={setStringCount} />
              <InputBlock label="ระยะหัว-ท้ายราง (mm)" value={overhang} onChange={setOverhang} />
              <InputBlock label="ระยะห่างแผง (mm)" value={midClampSpace} onChange={setMidClampSpace} />
              <InputBlock label="ระยะ L-Feet (mm)" value={lFeetSpace} onChange={setLFeetSpace} />
              <InputBlock label="รางมาตรฐาน (mm)" value={railLength} onChange={setRailLength} />
            </div>
          </div>

          {/* ส่วนผลลัพธ์ */}
          <div style={{ background: "#1e3a8a", color: "white", padding: "30px", borderRadius: "15px" }}>
            <h3 style={{ color: "#93c5fd", marginBottom: "25px", fontSize: "18px" }}>📦 รายการวัสดุ UD Solarmax</h3>
            <ResultRow label="ความยาวราง/แถว" value={`${results.totalRailLength} ม.`} highlight />
            <ResultRow label="จำนวนรางที่ต้องสั่ง" value={`${results.totalRailsNeeded} เส้น`} highlightColor="#fbbf24" />
            <ResultRow label="ตัวต่อราง (Splice)" value={`${results.splices} ตัว`} />
            <ResultRow label="L-Feet" value={`${results.lFeetCount} ตัว`} />
            <ResultRow label="Middle Clamp" value={`${results.midClamps} ตัว`} />
            <ResultRow label="End Clamp" value={`${results.endClamps} ตัว`} />
            <button onClick={() => {
              const text = `☀️ UD Solarmax: รวม ${stringCount} สตริง, ใช้ราง ${results.totalRailsNeeded} เส้น, L-Feet ${results.lFeetCount} ตัว`;
              navigator.clipboard.writeText(text);
              alert("คัดลอกข้อมูลสรุปเรียบร้อย!");
            }} style={{ width: "100%", marginTop: "25px", padding: "15px", background: "#10b981", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}>📋 คัดลอกส่ง Line</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputBlock = ({ label, value, onChange }) => (
  <div>
    <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "5px" }}>{label}</label>
    <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }} />
  </div>
);

const ResultRow = ({ label, value, highlight, highlightColor = "white" }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
    <span style={{ fontSize: "15px", color: "#bfdbfe" }}>{label}</span>
    <span style={{ fontWeight: "bold", fontSize: highlight ? "20px" : "16px", color: highlight ? "#fbbf24" : highlightColor }}>{value}</span>
  </div>
);
