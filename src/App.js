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

  // --- วิศวกรรม Logic: กำหนดขนาดตามแนวรางจริง ---
  // แนวตั้ง (Portrait): รางวิ่งตามความกว้างแผง | แนวนอน (Landscape): รางวิ่งตามความยาวแผง
  const dimAlongRail = panelOrientation === 'vertical' ? panelWidth : panelLength;
  const dimAcrossRail = panelOrientation === 'vertical' ? panelLength : panelWidth;

  useEffect(() => {
    // คำนวณความยาวแผงรวมทั้งหมดใน 1 แถว
    const panelsTotalMM = (panelCountPerString * dimAlongRail) + ((panelCountPerString - 1) * midClampSpace);
    // ความยาวรางจริง (ต่อเส้น) = ความยาวแผงรวม + overhang สองด้าน
    const rowLenMM = panelsTotalMM + (2 * overhang);
    
    // คำนวณวัสดุต่อ 1 สตริง
    const railsPerSide = Math.ceil(rowLenMM / railLength);
    const railsPerString = railsPerSide * 2; // มีราง 2 เส้นเสมอ
    const splicesPerString = Math.max(0, (railsPerSide - 1) * 2); 
    const lFeetPerString = (Math.ceil(rowLenMM / lFeetSpace) + 1) * 2;

    setResults({
      totalRailLength: (rowLenMM / 1000).toFixed(2),
      totalRailsNeeded: railsPerString * stringCount,
      midClamps: (panelCountPerString - 1) * 2 * stringCount,
      endClamps: 4 * stringCount,
      splices: splicesPerString * stringCount,
      lFeetCount: lFeetPerString * stringCount,
      panelTotalDim: (panelsTotalMM / 1000).toFixed(2)
    });
  }, [dimAlongRail, panelCountPerString, stringCount, lFeetSpace, railLength, midClampSpace, overhang]);

  const renderVisualizer = () => {
    const panelsTotalMM = (panelCountPerString * dimAlongRail) + ((panelCountPerString - 1) * midClampSpace);
    const railLenMM = panelsTotalMM + (2 * overhang);

    if (panelOrientation === 'vertical') {
      // --- แนวตั้ง (Portrait): ต่อลงด้านล่าง ---
      const viewW = railLenMM + 400;
      const viewH = (dimAcrossRail * stringCount) + (stringCount * 400);

      return (
        <svg viewBox={`-200 -200 ${viewW} ${viewH}`} style={{ width: '100%', maxHeight: '65vh', background: '#0f172a', borderRadius: '12px' }}>
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const yOff = sIdx * (dimAcrossRail + 400);
            return (
              <g key={sIdx}>
                {/* รางหยุดที่ความยาว railLenMM พอดี */}
                <rect x="0" y={yOff + dimAcrossRail * 0.25} width={railLenMM} height="30" fill="#64748b" rx="5" />
                <rect x="0" y={yOff + dimAcrossRail * 0.75} width={railLenMM} height="30" fill="#64748b" rx="5" />
                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect 
                    key={pIdx} 
                    x={overhang + (pIdx * (dimAlongRail + midClampSpace))} 
                    y={yOff} 
                    width={dimAlongRail} 
                    height={dimAcrossRail} 
                    fill="#1e293b" 
                    stroke="#38bdf8" 
                    strokeWidth="8" 
                    rx="5" 
                  />
                ))}
              </g>
            );
          })}
        </svg>
      );
    } else {
      // --- แนวนอน (Landscape): ต่อไปด้านขวา (อ้างอิงตามรูปตัวอย่าง) ---
      const stringGap = dimAlongRail * 0.2; 
      const viewW = (dimAlongRail * stringCount) + ((stringCount - 1) * stringGap) + 400;
      const viewH = railLenMM + 400;

      return (
        <svg viewBox={`-200 -200 ${viewW} ${viewH}`} style={{ width: '100%', maxHeight: '65vh', background: '#0f172a', borderRadius: '12px' }}>
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const xOff = sIdx * (dimAlongRail + stringGap);
            return (
              <g key={sIdx}>
                {/* รางแนวดิ่ง หยุดความยาวที่ railLenMM พอดี ไม่เกิน overhang */}
                <rect x={xOff + dimAlongRail * 0.2} y="0" width="35" height={railLenMM} fill="#64748b" rx="10" />
                <rect x={xOff + dimAlongRail * 0.8} y="0" width="35" height={railLenMM} fill="#64748b" rx="10" />
                
                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect 
                    key={pIdx} 
                    x={xOff} 
                    y={overhang + (pIdx * (dimAcrossRail + midClampSpace))} 
                    width={dimAlongRail} 
                    height={dimAcrossRail} 
                    fill="#0ea5e9" 
                    stroke="#fff" 
                    strokeWidth="10" 
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
    <div style={{ padding: "10px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "20px" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center", marginBottom: "20px", fontSize: "20px" }}>UD Solarmax engineering calc v5.7</h1>
        
        <div style={{ marginBottom: "20px", display: 'flex', justifyContent: 'center', background: '#0f172a', padding: '15px', borderRadius: '12px' }}>
             {renderVisualizer()}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {/* Settings */}
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "16px", color: "#334155" }}>⚙️ ตั้งค่าการติดตั้ง</h3>
            <select value={panelOrientation} onChange={(e) => setPanelOrientation(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <option value="horizontal">แนวนอน (Landscape)</option>
              <option value="vertical">แนวตั้ง (Portrait)</option>
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <InputBlock label="แผงกว้าง (mm)" value={panelWidth} onChange={setPanelWidth} />
              <InputBlock label="แผงยาว (mm)" value={panelLength} onChange={setPanelLength} />
              <InputBlock label="แผง/สตริง" value={panelCountPerString} onChange={setPanelCountPerString} />
              <InputBlock label="จำนวนสตริง" value={stringCount} onChange={setStringCount} />
              <InputBlock label="หัว-ท้ายราง (mm)" value={overhang} onChange={setOverhang} />
              <InputBlock label="ช่องว่างแผง (mm)" value={midClampSpace} onChange={setMidClampSpace} />
              <InputBlock label="ระยะ L-Feet (mm)" value={lFeetSpace} onChange={setLFeetSpace} />
              <InputBlock label="รางมาตรฐาน (mm)" value={railLength} onChange={setRailLength} />
            </div>
          </div>

          {/* Results */}
          <div style={{ background: "#1e3a8a", color: "white", padding: "25px", borderRadius: "12px" }}>
            <h3 style={{ color: "#93c5fd", marginBottom: "20px", fontSize: "16px" }}>📦 รายการวัสดุ UD Solarmax</h3>
            <ResultRow label="ความยาวราง/แถว" value={`${results.totalRailLength} ม.`} highlight />
            <ResultRow label="จำนวนรางที่ต้องสั่ง" value={`${results.totalRailsNeeded} เส้น`} highlightColor="#fbbf24" />
            <ResultRow label="ตัวต่อราง (Splice)" value={`${results.splices} ตัว`} />
            <ResultRow label="L-Feet" value={`${results.lFeetCount} ตัว`} />
            <ResultRow label="Middle Clamp" value={`${results.midClamps} ตัว`} />
            <ResultRow label="End Clamp" value={`${results.endClamps} ตัว`} />
            <button onClick={() => {
              const text = `☀️ UD Solarmax: ${stringCount} สตริง, รางรวม ${results.totalRailsNeeded} เส้น, L-Feet ${results.lFeetCount} ตัว`;
              navigator.clipboard.writeText(text);
              alert("คัดลอกข้อมูลเรียบร้อย!");
            }} style={{ width: "100%", marginTop: "15px", padding: "12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>📋 คัดลอกส่ง Line</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputBlock = ({ label, value, onChange }) => (
  <div>
    <label style={{ display: "block", fontSize: "11px", color: "#64748b", marginBottom: "3px" }}>{label}</label>
    <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
  </div>
);

const ResultRow = ({ label, value, highlight, highlightColor = "white" }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
    <span style={{ fontSize: "14px", color: "#bfdbfe" }}>{label}</span>
    <span style={{ fontWeight: "bold", fontSize: highlight ? "18px" : "15px", color: highlight ? "#fbbf24" : highlightColor }}>{value}</span>
  </div>
);
