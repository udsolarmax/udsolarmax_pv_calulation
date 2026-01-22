import React, { useState, useEffect } from 'react';

export default function App() {
  // มาตรฐานแผง Hi-Volt ทั่วไป
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

  // กำหนดขนาดแผงตามการวางจริง (Logic วิศวกร)
  // Portrait: ด้านกว้างวางขวางราง | Landscape: ด้านยาววางขวางราง
  const dimAlongRail = panelOrientation === 'vertical' ? panelWidth : panelLength;
  const dimAcrossRail = panelOrientation === 'vertical' ? panelLength : panelWidth;

  useEffect(() => {
    // 1. คำนวณความยาวแผงรวม + ช่องว่าง Mid Clamp
    const panelsDim = (panelCountPerString * dimAlongRail) + ((panelCountPerString - 1) * midClampSpace);
    
    // 2. ความยาวรางสุทธิต่อ 1 แถว (รวม Overhang 2 ด้าน)
    const rowLenMM = panelsDim + (2 * overhang);
    
    // 3. จำนวนจุดต่อราง (Splice) - คิดจากจำนวนท่อนรางต่อแถว (มี 2 เส้นราง)
    const railsPerSide = Math.ceil(rowLenMM / railLength);
    const splicesPerString = Math.max(0, (railsPerSide - 1) * 2);

    // 4. จำนวนรางที่ต้องสั่ง (เส้น)
    const railsPerString = railsPerSide * 2;

    // 5. L-Feet (ยึดตามระยะแป Purlin)
    const lFeetPerSide = Math.ceil(rowLenMM / lFeetSpace) + 1;
    const lFeetPerString = lFeetPerSide * 2;

    setResults({
      totalRailLength: (rowLenMM / 1000).toFixed(2),
      totalRailsNeeded: railsPerString * stringCount,
      midClamps: (panelCountPerString - 1) * 2 * stringCount,
      endClamps: 4 * stringCount,
      splices: splicesPerString * stringCount,
      lFeetCount: lFeetPerString * stringCount,
      panelTotalDim: (panelsDim / 1000).toFixed(2)
    });
  }, [panelWidth, panelLength, panelCountPerString, stringCount, lFeetSpace, railLength, midClampSpace, overhang, panelOrientation, dimAlongRail]);

  const renderVisualizer = () => {
    const panelsDimMM = (panelCountPerString * dimAlongRail) + ((panelCountPerString - 1) * midClampSpace);
    const railLenMM = panelsDimMM + (2 * overhang);

    // ปรับสเกล SVG ให้พอดีกับหน้าจอ
    const viewW = panelOrientation === 'vertical' ? railLenMM + 400 : dimAcrossRail * 1.5;
    const viewH = panelOrientation === 'vertical' ? dimAcrossRail * 1.5 : railLenMM + 400;

    return (
      <svg viewBox={`-200 -200 ${railLenMM + 400} ${dimAcrossRail + 400}`} style={{ width: '100%', height: 'auto', background: '#0f172a', borderRadius: '12px' }}>
        {/* Rail 1 & 2 */}
        <rect x="0" y={dimAcrossRail * 0.2} width={railLenMM} height="30" fill="#64748b" rx="5" />
        <rect x="0" y={dimAcrossRail * 0.8} width={railLenMM} height="30" fill="#64748b" rx="5" />
        
        {/* Panels */}
        {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
          <rect 
            key={pIdx} 
            x={overhang + (pIdx * (dimAlongRail + midClampSpace))} 
            y="0" 
            width={dimAlongRail} 
            height={dimAcrossRail} 
            fill="#1e293b" 
            stroke="#38bdf8" 
            strokeWidth="5" 
            rx="4" 
          />
        ))}

        {/* Labels */}
        <text x={railLenMM / 2} y={dimAcrossRail + 150} fill="#38bdf8" fontSize="120" textAnchor="middle" fontWeight="bold">
          ความยาวแถว: {results.totalRailLength} ม.
        </text>
      </svg>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", padding: "30px" }}>
        <h2 style={{ color: "#0f172a", marginBottom: "5px" }}>UD Solarmax Engineering Tool</h2>
        <p style={{ color: "#64748b", marginBottom: "25px", fontSize: "14px" }}>เครื่องมือคำนวณวัสดุติดตั้งโซลาร์เซลล์ (V5.6 Optimized)</p>
        
        <div style={{ marginBottom: "30px" }}>
          {renderVisualizer()}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px" }}>
          {/* Input Section */}
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "20px", borderBottom: "2px solid #3b82f6", display: "inline-block" }}>ตั้งค่าการติดตั้ง</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "12px", color: "#64748b" }}>รูปแบบการวางแผง</label>
                <select value={panelOrientation} onChange={(e) => setPanelOrientation(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "5px" }}>
                  <option value="vertical">แนวตั้ง (Portrait)</option>
                  <option value="horizontal">แนวนอน (Landscape)</option>
                </select>
              </div>
              <InputBlock label="แผงกว้าง (mm)" value={panelWidth} onChange={setPanelWidth} />
              <InputBlock label="แผงยาว (mm)" value={panelLength} onChange={setPanelLength} />
              <InputBlock label="จำนวนแผง/แถว" value={panelCountPerString} onChange={setPanelCountPerString} />
              <InputBlock label="จำนวนแถว (String)" value={stringCount} onChange={setStringCount} />
              <InputBlock label="ระยะ L-Feet (mm)" value={lFeetSpace} onChange={setLFeetSpace} />
              <InputBlock label="รางมาตรฐาน (mm)" value={railLength} onChange={setRailLength} />
            </div>
          </div>

          {/* Results Section */}
          <div style={{ background: "#1e3a8a", color: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 10px 15px rgba(30, 58, 138, 0.2)" }}>
            <h3 style={{ color: "#93c5fd", marginBottom: "20px", fontSize: "16px" }}>รายการวัสดุที่ต้องใช้</h3>
            <ResultRow label="ความยาวรางต่อแถว" value={`${results.totalRailLength} ม.`} highlight />
            <ResultRow label="จำนวนรางที่ต้องสั่ง (4.2m)" value={`${results.totalRailsNeeded} เส้น`} highlightColor="#fbbf24" />
            <ResultRow label="ตัวต่อราง (Splice)" value={`${results.splices} ตัว`} />
            <ResultRow label="L-Feet / Mounting" value={`${results.lFeetCount} ตัว`} />
            <ResultRow label="Middle Clamp" value={`${results.midClamps} ตัว`} />
            <ResultRow label="End Clamp" value={`${results.endClamps} ตัว`} />
            <ResultRow label="Grounding Lug" value={`${2 * stringCount} ตัว`} />
            
            <button onClick={() => {
              const text = `☀️ *UD Solarmax Summary*\n------------------\nวางแผง: ${panelOrientation === 'vertical' ? 'แนวตั้ง' : 'แนวนอน'}\nจำนวน: ${panelCountPerString} แผง x ${stringCount} แถว\nรางรวม: ${results.totalRailLength} ม.\nต้องใช้ราง: ${results.totalRailsNeeded} เส้น\nL-Feet: ${results.lFeetCount} ตัว\nSplice: ${results.splices} ตัว`;
              navigator.clipboard.writeText(text);
              alert("สรุปรายการวัสดุถูกคัดลอกแล้ว!");
            }} style={{ width: "100%", marginTop: "25px", padding: "12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}>
              คัดลอกสรุปรายการวัสดุ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputBlock = ({ label, value, onChange }) => (
  <div>
    <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "5px" }}>{label}</label>
    <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px" }} />
  </div>
);

const ResultRow = ({ label, value, highlight, highlightColor = "white" }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
    <span style={{ fontSize: "14px", color: "#bfdbfe" }}>{label}</span>
    <span style={{ fontWeight: "bold", fontSize: highlight ? "18px" : "15px", color: highlight ? "#fbbf24" : highlightColor }}>{value}</span>
  </div>
);
