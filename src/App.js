import React, { useState, useEffect } from 'react';

export default function App() {
  const [panelWidth, setPanelWidth] = useState(1134);
  const [panelLength, setPanelLength] = useState(2382);
  const [panelOrientation, setPanelOrientation] = useState('horizontal'); 
  const [panelCountPerString, setPanelCountPerString] = useState(10);
  const [stringCount, setStringCount] = useState(1); 
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

  // ใช้ Logic การสลับค่าตามแนววางแผง
  const currentW = panelOrientation === 'vertical' ? panelWidth : panelLength;
  const currentL = panelOrientation === 'vertical' ? panelLength : panelWidth;

  useEffect(() => {
    const panelsDim = (panelCountPerString * currentW) + ((panelCountPerString - 1) * midClampSpace);
    const rowLenMM = panelsDim + (2 * overhang);
    
    const midPerString = (panelCountPerString - 1) * 2;
    const railsPerString = Math.ceil((rowLenMM * 2) / railLength);
    const splicesPerString = Math.max(0, railsPerString - 2); 
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
      // --- แนวตั้ง (Portrait) เรียงต่อลงด้านล่าง ---
      const vWidth = railLenMM + 400;
      const vHeight = (currentL * stringCount) + (stringCount * 500);

      return (
        <svg viewBox={`-200 -200 ${vWidth} ${vHeight}`} style={{ width: '100%', height: 'auto', background: '#1e293b', borderRadius: '12px' }}>
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const yOff = sIdx * (currentL + 400);
            return (
              <g key={sIdx}>
                <rect x="0" y={yOff + currentL * 0.25} width={railLenMM} height="30" fill="#94a3b8" rx="5" />
                <rect x="0" y={yOff + currentL * 0.75} width={railLenMM} height="30" fill="#94a3b8" rx="5" />
                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect key={pIdx} x={overhang + (pIdx * (currentW + midClampSpace))} y={yOff} width={currentW} height={currentL} fill="#334155" stroke="#475569" strokeWidth="5" rx="5" />
                ))}
              </g>
            );
          })}
        </svg>
      );
    } else {
      // --- แนวนอน (Landscape) แก้ไขให้เรียงไปทางขวา ---
      const vWidth = (railLenMM * stringCount) + (stringCount * 400);
      const vHeight = currentL + 400;

      return (
        <svg viewBox={`-200 -200 ${vWidth} ${vHeight}`} style={{ width: '100%', height: 'auto', background: '#1e293b', borderRadius: '12px' }}>
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const xOff = sIdx * (railLenMM + 300); // ระยะห่างระหว่าง String ไปทางขวา
            return (
              <g key={sIdx}>
                {/* รางแนวนอน 2 เส้น */}
                <rect x={xOff} y={currentL * 0.2} width={railLenMM} height="30" fill="#94a3b8" rx="5" />
                <rect x={xOff} y={currentL * 0.8} width={railLenMM} height="30" fill="#94a3b8" rx="5" />
                
                {/* วาดแผงเรียงตามความยาวราง */}
                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect 
                    key={pIdx} 
                    x={xOff + overhang + (pIdx * (currentW + midClampSpace))} 
                    y="0" 
                    width={currentW} 
                    height={currentL} 
                    fill="#0ea5e9" 
                    stroke="#fff" 
                    strokeWidth="5" 
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
    <div style={{ padding: "10px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "20px" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center", marginBottom: "20px", fontSize: "24px" }}>UD Solarmax engineering calc v5.5</h1>
        
        <div style={{ marginBottom: "20px", overflowX: 'auto' }}>
          <div style={{ minWidth: '600px' }}>
            {renderVisualizer()}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginBottom: "15px" }}>⚙️ ตั้งค่าการติดตั้ง</h3>
            <select value={panelOrientation} onChange={(e) => setPanelOrientation(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px" }}>
              <option value="horizontal">แนวนอน (Landscape)</option>
              <option value="vertical">แนวตั้ง (Portrait)</option>
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <InputBlock label="แผงกว้าง (mm)" value={panelWidth} onChange={setPanelWidth} />
              <InputBlock label="แผงยาว (mm)" value={panelLength} onChange={setPanelLength} />
              <InputBlock label="แผง/แถว" value={panelCountPerString} onChange={setPanelCountPerString} />
              <InputBlock label="จำนวนแถว (String)" value={stringCount} onChange={setStringCount} />
              <InputBlock label="ระยะเหลือปลายราง (mm)" value={overhang} onChange={setOverhang} />
              <InputBlock label="Mid Clamp (mm)" value={midClampSpace} onChange={setMidClampSpace} />
              <InputBlock label="ระยะ L-Feet (mm)" value={lFeetSpace} onChange={setLFeetSpace} />
              <InputBlock label="รางมาตรฐาน (mm)" value={railLength} onChange={setRailLength} />
            </div>
          </div>

          <div style={{ background: "#1e3a8a", color: "white", padding: "25px", borderRadius: "12px" }}>
            <h3 style={{ color: "#93c5fd", marginBottom: "20px" }}>📦 รายการวัสดุ UD Solarmax</h3>
            <ResultRow label="ความยาวรางรวม/แถว" value={`${results.totalRailLength} ม.`} highlight />
            <ResultRow label="จำนวนรางที่ต้องสั่ง" value={`${results.totalRailsNeeded} เส้น`} highlightColor="#fbbf24" />
            <ResultRow label="ตัวต่อราง (Splice)" value={`${results.splices} ตัว`} />
            <ResultRow label="L-Feet" value={`${results.lFeetCount} ตัว`} />
            <ResultRow label="Middle Clamp" value={`${results.midClamps} ตัว`} />
            <ResultRow label="End Clamp" value={`${results.endClamps} ตัว`} />
            <button onClick={() => {
              const text = `☀️ UD Solarmax: รวม ${stringCount} แถว, ราง ${results.totalRailLength}ม. (${results.totalRailsNeeded}เส้น), L-Feet ${results.lFeetCount}ตัว`;
              navigator.clipboard.writeText(text);
              alert("คัดลอกสรุปแล้ว!");
            }} style={{ width: "100%", marginTop: "20px", padding: "15px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>📋 คัดลอกสรุปข้อมูล</button>
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
  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
    <span style={{ fontSize: "14px", color: "#bfdbfe" }}>{label}</span>
    <span style={{ fontWeight: "bold", fontSize: highlight ? "18px" : "15px", color: highlight ? "#fbbf24" : highlightColor }}>{value}</span>
  </div>
);
