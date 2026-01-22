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
      // --- Portrait Mode ---
      const totalW = railLenMM + 400;
      const totalH = (currentL * stringCount) + (stringCount * 500);

      return (
        <svg viewBox={`-200 -200 ${totalW} ${totalH}`} style={{ width: '100%', maxHeight: '70vh', background: '#0f172a', borderRadius: '12px' }}>
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const yOff = sIdx * (currentL + 400);
            return (
              <g key={sIdx}>
                <rect x="0" y={yOff + currentL * 0.25} width={railLenMM} height="30" fill="#64748b" rx="5" />
                <rect x="0" y={yOff + currentL * 0.75} width={railLenMM} height="30" fill="#64748b" rx="5" />
                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect key={pIdx} x={overhang + (pIdx * (currentW + midClampSpace))} y={yOff} width={currentW} height={currentL} fill="#1e293b" stroke="#38bdf8" strokeWidth="10" rx="5" />
                ))}
              </g>
            );
          })}
        </svg>
      );
    } else {
      // --- Landscape Mode (ตามรูปตัวอย่าง) ---
      const stringGap = currentW * 0.3; // ระยะห่างระหว่างสตริง
      const totalW = (currentW * stringCount) + ((stringCount - 1) * stringGap);
      const totalH = railLenMM;

      return (
        <svg viewBox={`-100 -100 ${totalW + 200} ${totalH + 200}`} style={{ width: '100%', maxHeight: '70vh', background: '#0f172a', borderRadius: '12px' }}>
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const xOff = sIdx * (currentW + stringGap);
            return (
              <g key={sIdx}>
                {/* ราง 2 เส้นขนานในแนวดิ่ง */}
                <rect x={xOff + currentW * 0.2} y="0" width="40" height={railLenMM} fill="#64748b" rx="10" />
                <rect x={xOff + currentW * 0.8} y="0" width="40" height={railLenMM} fill="#64748b" rx="10" />
                
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
    <div style={{ padding: "10px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "20px" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center", marginBottom: "20px", fontSize: "22px" }}>UD Solarmax engineering calc v5.5</h1>
        
        {/* Visualizer Container - ปรับให้ Responsive */}
        <div style={{ marginBottom: "20px", display: 'flex', justifyContent: 'center', background: '#0f172a', padding: '10px', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
             {renderVisualizer()}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {/* Settings */}
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>⚙️ ตั้งค่าการติดตั้ง</h3>
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
              <InputBlock label="ห่างระหว่างแผง (mm)" value={midClampSpace} onChange={setMidClampSpace} />
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
              alert("คัดลอกข้อมูลแล้ว!");
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
