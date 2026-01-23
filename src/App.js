import React, { useState } from 'react';

export default function App() {
  // --- 1. Main Specs ---
  const [mode, setMode] = useState('landscape');
  const [panels, setPanels] = useState(10);
  const [strings, setStrings] = useState(2);

  // สเปคแผง
  const [panelWidth, setPanelWidth] = useState(1.303);
  const [panelLength, setPanelLength] = useState(2.382);

  // --- 2. Advanced Settings ---
  const [railUnitLen, setRailUnitLen] = useState(4.80);
  const [midClamp, setMidClamp] = useState(20);    // มม.
  const [overhang, setOverhang] = useState(150);   // มม. (ระยะเผื่อปลายราง)
  const [lFeetDist, setLFeetDist] = useState(1200); // มม.

  // --- 3. สูตรคำนวณ (Calculation Logic) ---
  // A. ความยาวเชิงเรขาคณิต (Total Geometry Length)
  const totalPanelWidth = panels * panelWidth;
  const totalMidGaps = (panels > 0 ? panels - 1 : 0) * (midClamp / 1000);
  const totalOverhangs = 2 * (overhang / 1000);

  const railLengthPerString = totalPanelWidth + totalMidGaps + totalOverhangs;

  // B. คำนวณวัสดุ (BOM)
  const totalRailLines = 2 * strings;

  // B1. จำนวนรางที่ต้องสั่ง (เส้น)
  const barsPerLine = Math.ceil(railLengthPerString / railUnitLen);
  const totalBars = barsPerLine * totalRailLines;

  // B2. ตัวต่อราง (Splice)
  const splicePerLine = barsPerLine > 1 ? barsPerLine - 1 : 0;
  const totalSplices = splicePerLine * totalRailLines;

  // B3. อุปกรณ์อื่นๆ
  const lFeetPerLine = Math.ceil((railLengthPerString * 1000) / lFeetDist) + 1;
  const totalLFeet = lFeetPerLine * totalRailLines;

  const midClampPerString = (panels > 0 ? panels - 1 : 0) * 2;
  const totalMidClamp = midClampPerString * strings;

  const endClampPerString = 4;
  const totalEndClamp = endClampPerString * strings;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans text-gray-800">

      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg w-full max-w-7xl border-t-8 border-[#0ea5e9]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            UD Solarmax <span className="block md:inline text-xs md:text-sm font-normal text-gray-500">Engineering Calc v6.5</span>
          </h1>
          <div className="mt-2 md:mt-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
             Strings: {strings}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* --- ฝั่งซ้าย: Control Panel (3/12) --- */}
          <div className="lg:col-span-3 space-y-4">

            {/* Mode */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMode('landscape')} className={`px-2 py-2 rounded border-2 text-xs font-bold ${mode==='landscape' ? "border-blue-500 bg-blue-50 text-blue-900" : "border-gray-200 text-gray-500"}`}>
                แผงแนวนอน
              </button>
              <button onClick={() => setMode('portrait')} className={`px-2 py-2 rounded border-2 text-xs font-bold ${mode==='portrait' ? "border-blue-500 bg-blue-50 text-blue-900" : "border-gray-200 text-gray-500"}`}>
                แผงแนวตั้ง
              </button>
            </div>

            {/* Inputs Group 1: Panels */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] text-blue-800 uppercase font-bold">จำนวนแผง</label>
                  <input type="number" value={panels} onChange={(e) => setPanels(Number(e.target.value))} className="w-full border border-blue-200 rounded px-1 py-1 text-base font-bold text-blue-900 text-center" />
                </div>
                <div>
                  <label className="block text-[9px] text-blue-800 uppercase font-bold">จำนวนสตริง</label>
                  <input type="number" value={strings} onChange={(e) => setStrings(Number(e.target.value))} className="w-full border border-blue-200 rounded px-1 py-1 text-base font-bold text-blue-900 text-center" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-200">
                 <div><label className="block text-[9px] text-gray-500 font-bold">ตัวคูณกว้าง (ม.)</label><input type="number" step="0.001" value={panelWidth} onChange={(e) => setPanelWidth(Number(e.target.value))} className="w-full bg-white border border-gray-300 rounded px-1 py-1 text-center text-xs" /></div>
                 <div><label className="block text-[9px] text-gray-500 font-bold">ยาวแผง (ม.)</label><input type="number" step="0.001" value={panelLength} onChange={(e) => setPanelLength(Number(e.target.value))} className="w-full bg-white border border-gray-300 rounded px-1 py-1 text-center text-xs" /></div>
              </div>
            </div>

             {/* Inputs Group 2: Rail Specs */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 space-y-2">
               <h3 className="text-[10px] font-bold text-yellow-700 uppercase border-b border-yellow-200 pb-1 mb-1">สเปคราง (Rail Spec)</h3>
               <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-700 font-bold">ยาวต่อเส้น (ม.)</label>
                  <input type="number" step="0.1" value={railUnitLen} onChange={(e) => setRailUnitLen(Number(e.target.value))} className="w-16 border border-yellow-400 rounded px-1 py-1 text-right text-sm font-bold bg-white" />
               </div>
            </div>

             {/* Inputs Group 3: Distances */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase border-b pb-1 mb-1">ตั้งค่าระยะ (มม.)</h3>
              <div className="flex justify-between items-center"><label className="text-xs text-gray-600">Mid Clamp</label><input type="number" value={midClamp} onChange={(e) => setMidClamp(Number(e.target.value))} className="w-14 border rounded px-1 py-1 text-right text-xs" /></div>
              <div className="flex justify-between items-center bg-green-50 px-1 -mx-1 rounded"><label className="text-xs text-green-700 font-bold">เผื่อปลายราง</label><input type="number" value={overhang} onChange={(e) => setOverhang(Number(e.target.value))} className="w-14 border border-green-300 rounded px-1 py-1 text-right text-xs font-bold text-green-700" /></div>
              <div className="flex justify-between items-center"><label className="text-xs text-gray-600">ระยะ L-Feet</label><input type="number" value={lFeetDist} onChange={(e) => setLFeetDist(Number(e.target.value))} className="w-14 border rounded px-1 py-1 text-right text-xs" /></div>
            </div>

            <div className="bg-gray-900 text-white p-4 rounded-lg text-center shadow-lg border-2 border-[#0ea5e9]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">ความยาวสุทธิ (ต่อสตริง)</p>
              <div className="text-3xl font-mono font-bold text-[#38bdf8]">{railLengthPerString.toFixed(2)} ม.</div>
            </div>
          </div>

          {/* --- ตรงกลาง: Visualization (6/12) --- */}
          {/* แก้ไข Layout หลัก: ให้เป็น Flex-Row เพื่อเรียงสตริงไปทางขวา */}
          <div className="lg:col-span-6 bg-slate-800 rounded-xl p-4 flex flex-col relative min-h-[500px]">
             <div className="text-xs text-white opacity-50 mb-4 text-center">Preview: {panels} Panels x {strings} Strings (Side-by-Side)</div>

             {/* Container ของสตริงทั้งหมด: ใช้ flex-row + overflow-x-auto เพื่อเลื่อนไปทางขวา */}
             <div className="flex flex-row gap-6 w-full h-full overflow-x-auto p-4 items-start">
                {[...Array(strings > 0 ? strings : 1)].map((_, s) => (
                  <div key={s} className="shrink-0 flex flex-col items-center">
                    <div className="text-[10px] text-blue-300 mb-2 font-bold bg-slate-700 px-2 py-0.5 rounded-full">STR {s+1}</div>
                    
                    {/* Container ของแผงใน 1 สตริง */}
                    {/* Logic: ถ้า Landscape = เรียงลง (col), ถ้า Portrait = เรียงข้าง (row) */}
                    <div className={`flex ${mode === 'landscape' ? 'flex-col' : 'flex-row'} bg-slate-700/30 p-2 rounded-lg border border-slate-600/50 justify-start gap-px md:gap-1`}>
                        {[...Array(panels > 0 ? panels : 0)].map((_, i) => (
                          <div
                            key={i}
                            style={{
                                // ขนาดแผง (Fix size เพื่อความสวยงามในแบบ Column)
                                width: mode === 'landscape' ? '80px' : '40px',
                                height: mode === 'landscape' ? '50px' : '80px',
                                // Aspect Ratio เผื่อไว้
                                aspectRatio: mode === 'landscape' ? '3/2' : '2/3'
                            }}
                            className="bg-[#0ea5e9] border border-white/20 shadow-sm relative shrink-0 transition-all hover:bg-blue-400"
                          >
                            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%]"></div>
                            <div className="absolute inset-0 border-[0.5px] border-white/10"></div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* --- ฝั่งขวาสุด: BOM (3/12) --- */}
          <div className="lg:col-span-3 space-y-4">
             <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-[#1e293b] text-white px-4 py-2 text-sm font-bold flex justify-between items-center">
                   <span>รายการวัสดุ (BOM)</span>
                   <span className="text-[#38bdf8] text-[10px] bg-slate-700 px-2 py-0.5 rounded">รวม {strings} สตริง</span>
                </div>
                <table className="w-full text-xs text-left">
                   <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-3 py-2 text-gray-700">ความยาวสุทธิ/แนว</td><td className="px-3 py-2 text-right font-bold text-blue-600">{railLengthPerString.toFixed(2)} ม.</td></tr>

                      <tr className="bg-yellow-50">
                        <td className="px-3 py-2 text-yellow-800 font-bold">จำนวนราง ({railUnitLen.toFixed(1)}ม.)</td>
                        <td className="px-3 py-2 text-right font-bold text-red-600 text-sm">{totalBars} เส้น</td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="px-3 py-2 text-yellow-800">ตัวต่อราง (Splice)</td>
                        <td className="px-3 py-2 text-right font-bold text-yellow-900">{totalSplices} ตัว</td>
                      </tr>

                      <tr><td className="px-3 py-2 text-gray-700">L-Feet</td><td className="px-3 py-2 text-right font-bold">{totalLFeet} ตัว</td></tr>
                      <tr><td className="px-3 py-2 text-gray-700">Mid Clamp</td><td className="px-3 py-2 text-right">{totalMidClamp} ตัว</td></tr>
                      <tr><td className="px-3 py-2 text-gray-700">End Clamp</td><td className="px-3 py-2 text-right">{totalEndClamp} ตัว</td></tr>
                      <tr><td className="px-3 py-2 text-gray-700">Grounding Plate</td><td className="px-3 py-2 text-right">{totalMidClamp} แผ่น</td></tr>
                   </tbody>
                </table>
             </div>

             <div className="p-3 bg-blue-50 rounded-lg text-[10px] text-blue-800 border border-blue-100">
               <strong>สูตรคำนวณ:</strong><br/>
               ความยาว = (แผง x {panels}) + MidGap + เผื่อปลาย<br/>
               จำนวนเส้น = ปัดเศษขึ้น (ความยาว / {railUnitLen.toFixed(1)})
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
