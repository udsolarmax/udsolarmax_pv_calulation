import React, { useState, useEffect } from "react";

export default function App() {
  const [panelWidth, setPanelWidth] = useState(1134);
  const [panelLength, setPanelLength] = useState(2382);
  const [panelOrientation, setPanelOrientation] = useState("horizontal");
  const [panelCountPerString, setPanelCountPerString] = useState(10);
  const [stringCount, setStringCount] = useState(1); // จำนวนแถว
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
    panelTotalDim: 0,
  });

  const currentW = panelOrientation === "vertical" ? panelWidth : panelLength;
  const currentL = panelOrientation === "vertical" ? panelLength : panelWidth;

  useEffect(() => {
    const panelsDim =
      panelCountPerString * currentW +
      (panelCountPerString - 1) * midClampSpace;
    const rowLenMM = panelsDim + 2 * overhang;

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
      panelTotalDim: (panelsDim / 1000).toFixed(2),
    });
  }, [
    currentW,
    currentL,
    panelCountPerString,
    stringCount,
    lFeetSpace,
    railLength,
    midClampSpace,
    overhang,
    panelOrientation,
  ]);

  const renderVisualizer = () => {
    const panelsDimMM =
      panelCountPerString * currentW +
      (panelCountPerString - 1) * midClampSpace;
    const railLenMM = panelsDimMM + 2 * overhang;

    if (panelOrientation === "vertical") {
      // --- แผงแนวตั้ง (Portrait) ---
      const vWidth = railLenMM + 800;
      const vHeight = currentL * stringCount + stringCount * 800 + 400;

      return (
        <svg
          viewBox={`-300 -500 ${vWidth} ${vHeight}`}
          style={{
            width: "100%",
            height: "auto",
            background: "#1e293b",
            borderRadius: "12px",
          }}
        >
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const yOff = sIdx * (currentL + 800);
            return (
              <g key={sIdx}>
                <rect
                  x="0"
                  y={yOff + currentL * 0.25}
                  width={railLenMM}
                  height="40"
                  fill="#94a3b8"
                  rx="10"
                />
                <rect
                  x="0"
                  y={yOff + currentL * 0.75}
                  width={railLenMM}
                  height="40"
                  fill="#94a3b8"
                  rx="10"
                />
                <line
                  x1="0"
                  y1={yOff - 150}
                  x2={railLenMM}
                  y2={yOff - 150}
                  stroke="#fbbf24"
                  strokeWidth="15"
                />
                <text
                  x={railLenMM / 2}
                  y={yOff - 220}
                  fill="#fbbf24"
                  fontSize="200"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  รางรวม: {results.totalRailLength} ม.
                </text>
                <line
                  x1="0"
                  y1={yOff + currentL * 0.25 + 20}
                  x2={lFeetSpace}
                  y2={yOff + currentL * 0.25 + 20}
                  stroke="#60a5fa"
                  strokeWidth="10"
                  strokeDasharray="20,20"
                />
                <text
                  x={lFeetSpace / 2}
                  y={yOff + currentL * 0.25 - 20}
                  fill="#60a5fa"
                  fontSize="150"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  L-Feet: {lFeetSpace}mm
                </text>
                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect
                    key={pIdx}
                    x={overhang + pIdx * (currentW + midClampSpace)}
                    y={yOff}
                    width={currentW}
                    height={currentL}
                    fill="#334155"
                    stroke="#475569"
                    strokeWidth="10"
                    rx="5"
                  />
                ))}
                <line
                  x1="0"
                  y1={yOff + currentL + 120}
                  x2={overhang}
                  y2={yOff + currentL + 120}
                  stroke="#f87171"
                  strokeWidth="10"
                  strokeDasharray="30,30"
                />
                <text
                  x={overhang / 2}
                  y={yOff + currentL + 300}
                  fill="#f87171"
                  fontSize="150"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {overhang}mm
                </text>
              </g>
            );
          })}
        </svg>
      );
    } else {
      // --- แผงแนวนอน (Landscape) - แก้ไขให้แสดงผลตามจำนวนแถวที่เพิ่มขึ้น ---
      const totalPanelH =
        panelCountPerString * currentL +
        (panelCountPerString - 1) * midClampSpace;
      const railLenMM = totalPanelH + 2 * overhang;
      // ขยาย viewBox ตามจำนวน stringCount (วางเรียงต่อกันไปทางขวา)
      const vWidth = currentW * stringCount + stringCount * 800 + 400;
      const vHeight = railLenMM + 800;

      return (
        <svg
          viewBox={`-600 -400 ${vWidth} ${vHeight}`}
          style={{
            width: "100%",
            maxHeight: "80vh",
            height: "auto",
            background: "#1e293b",
            borderRadius: "12px",
          }}
        >
          {Array.from({ length: stringCount }).map((_, sIdx) => {
            const xOff = sIdx * (currentW + 800);
            return (
              <g key={sIdx}>
                {/* รางแนวตั้งของแต่ละแถว */}
                <rect
                  x={xOff + currentW * 0.25}
                  y="0"
                  width="45"
                  height={railLenMM}
                  fill="#94a3b8"
                  rx="10"
                />
                <rect
                  x={xOff + currentW * 0.75}
                  y="0"
                  width="45"
                  height={railLenMM}
                  fill="#94a3b8"
                  rx="10"
                />

                {/* เส้นบอกระยะรางรวม */}
                <line
                  x1={xOff - 250}
                  y1="0"
                  x2={xOff - 250}
                  y2={railLenMM}
                  stroke="#fbbf24"
                  strokeWidth="20"
                />
                <text
                  x={xOff - 380}
                  y={railLenMM / 2}
                  fill="#fbbf24"
                  fontSize="220"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform={`rotate(-90, ${xOff - 380}, ${railLenMM / 2})`}
                >
                  รางรวม: {results.totalRailLength} ม.
                </text>

                {/* ระยะ L-Feet */}
                <line
                  x1={xOff + currentW * 0.25 + 60}
                  y1="0"
                  x2={xOff + currentW * 0.25 + 60}
                  y2={lFeetSpace}
                  stroke="#60a5fa"
                  strokeWidth="12"
                  strokeDasharray="30,30"
                />
                <text
                  x={xOff + currentW * 0.25 + 200}
                  y={lFeetSpace / 2}
                  fill="#60a5fa"
                  fontSize="180"
                  fontWeight="bold"
                  textAnchor="start"
                >
                  L-Feet: {lFeetSpace}mm
                </text>

                {Array.from({ length: panelCountPerString }).map((_, pIdx) => (
                  <rect
                    key={pIdx}
                    x={xOff}
                    y={overhang + pIdx * (currentL + midClampSpace)}
                    width={currentW}
                    height={currentL}
                    fill="#00ffff"
                    stroke="#fff"
                    strokeWidth="12"
                    rx="5"
                  />
                ))}

                {/* ระยะ Overhang */}
                <line
                  x1={xOff + currentW + 80}
                  y1="0"
                  x2={xOff + currentW + 80}
                  y2={overhang}
                  stroke="#f87171"
                  strokeWidth="12"
                  strokeDasharray="40,40"
                />
                <text
                  x={xOff + currentW + 220}
                  y={overhang / 2}
                  fill="#f87171"
                  fontSize="180"
                  fontWeight="bold"
                  textAnchor="start"
                >
                  {overhang}mm
                </text>
              </g>
            );
          })}
        </svg>
      );
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        <h1
          style={{
            color: "#1e3a8a",
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "24px",
          }}
        >
          UD Solarmax engineering calc v5.5
        </h1>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "950px" }}>
            {renderVisualizer()}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>
              ⚙️ ตั้งค่าการติดตั้ง
            </h3>
            <select
              value={panelOrientation}
              onChange={(e) => setPanelOrientation(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
              }}
            >
              <option value="horizontal">แนวนอน (Landscape)</option>
              <option value="vertical">แนวตั้ง (Portrait)</option>
            </select>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <InputBlock
                label="แผงกว้าง (mm)"
                value={panelWidth}
                onChange={setPanelWidth}
              />
              <InputBlock
                label="แผงยาว (mm)"
                value={panelLength}
                onChange={setPanelLength}
              />
              <InputBlock
                label="แผง/แถว"
                value={panelCountPerString}
                onChange={setPanelCountPerString}
              />
              <InputBlock
                label="จำนวนแถว (String)"
                value={stringCount}
                onChange={setStringCount}
              />
              <InputBlock
                label="Overhang (mm)"
                value={overhang}
                onChange={setOverhang}
              />
              <InputBlock
                label="Mid Clamp (mm)"
                value={midClampSpace}
                onChange={setMidClampSpace}
              />
              <InputBlock
                label="ระยะ L-Feet (mm)"
                value={lFeetSpace}
                onChange={setLFeetSpace}
              />
              <InputBlock
                label="รางมาตรฐาน (mm)"
                value={railLength}
                onChange={setRailLength}
              />
            </div>
          </div>

          <div
            style={{
              background: "#1e3a8a",
              color: "white",
              padding: "25px",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                color: "#93c5fd",
                marginBottom: "20px",
                fontSize: "16px",
              }}
            >
              📦 รายการวัสดุ UD Solarmax
            </h3>
            <ResultRow
              label="รางรวมต่อชุด"
              value={`${results.totalRailLength} ม.`}
              highlight
            />
            <ResultRow
              label="จำนวนรางที่ต้องสั่ง"
              value={`${results.totalRailsNeeded} เส้น`}
              highlightColor="#fbbf24"
            />
            <ResultRow
              label="ตัวต่อราง (Splice)"
              value={`${results.splices} ตัว`}
            />
            <ResultRow label="L-Feet" value={`${results.lFeetCount} ตัว`} />
            <ResultRow
              label="Middle Clamp"
              value={`${results.midClamps} ตัว`}
            />
            <ResultRow label="End Clamp" value={`${results.endClamps} ตัว`} />
            <ResultRow
              label="Grounding Plate"
              value={`${results.midClamps} ตัว`}
            />
            <ResultRow label="Grounding Lug" value={`${2 * stringCount} ตัว`} />
            <button
              onClick={() => {
                const text = `☀️ UD Solarmax: รวม ${stringCount} แถว, ราง ${results.totalRailLength}ม. (${results.totalRailsNeeded}เส้น), L-Feet ${results.lFeetCount}ตัว`;
                navigator.clipboard.writeText(text);
                alert("คัดลอกข้อมูลเรียบร้อย!");
              }}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "15px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              📋 ส่งสรุปเข้า Line
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputBlock = ({ label, value, onChange }) => (
  <div>
    <label
      style={{
        display: "block",
        fontSize: "11px",
        color: "#64748b",
        marginBottom: "3px",
      }}
    >
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
      }}
    />
  </div>
);

const ResultRow = ({ label, value, highlight, highlightColor = "white" }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <span style={{ fontSize: "14px", color: "#bfdbfe" }}>{label}</span>
    <span
      style={{
        fontWeight: "bold",
        fontSize: highlight ? "18px" : "15px",
        color: highlight ? "#fbbf24" : highlightColor,
      }}
    >
      {value}
    </span>
  </div>
);


