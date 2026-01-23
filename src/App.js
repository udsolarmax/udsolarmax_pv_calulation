import React, { useState } from 'react';

export default function App() {
  // --- 1. ตั้งค่าตัวแปรหลัก ---
  const [mode, setMode] = useState('landscape'); 
  const [panels, setPanels] = useState(10);
  const [strings, setStrings] = useState(2); 
  
  // สเปคแผง
  const [panelWidth, setPanelWidth] = useState(1.303); 
  const [panelLength, setPanelLength] = useState(2.382); 

  // --- 2. Advanced Settings ---
  const [midClamp, setMidClamp] = useState(20);    
  const [endClamp, setEndClamp] = useState(100);   
  const [lFeetDist, setLFeetDist] = useState(1200); 

  // --- 3. สูตรคำนวณ ---
  const panelsLength = panels * panelWidth;
  const gapLengthMm = ((panels > 0 ? panels - 1 : 0) * midClamp) + (endClamp * 2);
  const gapLengthM = gapLengthMm / 1000;
  
  const railLengthPerString = panelsLength + gapLengthM;

  // B. คำนวณ BOM
  const totalRailCount = 2 * strings; 
  
  const lFeetPerRail = Math.ceil((railLengthPerString * 1000) / lFeetDist) + 1;
  const totalLFeet = lFeetPerRail * 2 * strings;

  const midClampPerString = (panels > 0 ? panels - 1 : 0) * 2;
  const totalMidClamp = midClampPerString * strings;
  
  const endClampPerString = 4;
  const totalEndClamp = endClampPerString * strings;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans text-gray-800">
      
      {/* Header */}
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg w-full max-w-6xl border-t-8 border-[#0ea5e9]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            UD Solarmax <span className="block md:inline text-xs md:text-sm font-normal text-gray-500">Engineering Calc v6.2 (Auto-Fit)</span>
          </h1>
          <div className="mt-2 md:mt-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
             Strings: {strings}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- ฝั่งซ้าย: Control Panel (3/12) --- */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Mode */}
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2">รูปแบบการวางแผง</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setMode('landscape')}
                  className={`px-2 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    mode === 'landscape' 
                    ? "border-[#0ea5e9] bg-blue-50 text-blue-900" 
                    : "border-gray-200 text-gray-500"
                  }`}
                >
                  แผงแนวนอน
                </button>
                <button 
                  onClick={() => setMode('portrait')}
                  className={`px-2 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    mode === 'portrait' 
                    ? "border-[#0ea5e9] bg-blue-50 text-blue-900" 
                    : "border-gray-200 text-gray-500"
                  }`}
                >
                  แผงแนวตั้ง
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-blue-800 uppercase font-bold">จำนวนแผง</label>
                  <input type="number" value={panels} onChange={(e) => setPanels(Number(e.target.value))} className="w-full mt-1 border border-blue-200 rounded px-2 py-2 text-lg font-bold text-blue-900 text-center" />
                </div>
                <div>
                  <label className="block text-[10px] text-blue-800 uppercase font-bold">จำนวนสตริง</label>
                  <input type="number" value={strings} onChange={(e) => setStrings(Number(e.target.value))} className="w-full mt-1 border border-blue-200 rounded px-2 py-2 text-lg font-bold text-blue-900 text-center" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div>
                    <label className="block text-[10px] text-gray-600 uppercase font-bold">ตัวคูณกว้าง</label>
                    <input type="number" step="0.001" value={panelWidth} onChange={(e) => setPanelWidth(Number(e.target.value))} className="w-full mt-1 bg-white border border-gray-300 rounded px-1 py-1 text-center text-xs" />
                 </div>
                 <div>
                    <label className="block text-[10px] text-gray-600 uppercase font-bold">ยาวของแผง</label>
                    <input type="number" step="0.001" value={panelLength} onChange={(e) => setPanelLength(Number(e.target.value))} className="w-full mt-1 bg-white border border-gray-300 rounded px-1 py-1 text-center text-xs" />
                 </div>
              </div>
            </div>

             {/* Settings */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase border-b pb-1 mb-1">ตั้งค่าระยะ (มม.)</h3>
              <div className="flex justify-between items-center"><label className="text-xs text-gray-600">Mid Clamp</label><input type="number" value={midClamp} onChange={(e) => setMidClamp(Number(e.target.value))} className="w-14 border rounded px-1 py-1 text-right text-xs" /></div>
              <div className="flex justify-between items-center"><label className="text-xs text-gray-600">End Clamp</label><input type="number" value={endClamp} onChange={(e) => setEndClamp(Number(e.target.value))} className="w-14 border rounded px-1 py-1 text-right text-xs" /></div>
              <div className="flex justify-between items-center"><label className="text-xs text-gray-600">L-Feet Dist</label><input type="number" value={lFeetDist} onChange={(e) => setLFeetDist(Number(e.target.value))} className="w-14 border rounded px-1 py-1 text-right text-xs" /></div>
            </div>
            
            <div className="bg-gray-900 text-white p-4 rounded-lg text-center shadow-lg border-2 border-[#0ea5e9]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">ความยาวราง (ต่อสตริง)</p>
              <div className="text-3xl font-mono font-bold text-[#38bdf8]">{railLengthPerString.toFixed(2)} ม.</div>
            </div>
          </div>

          {/* --- ตรงกลาง: Visualization (6/12) --- */}
          <div className="lg:col-span-6 bg-slate-800 rounded-xl p-4 flex flex-col relative min-h-[400px]">
             <div className="text-xs text-white opacity-50 mb-4 text-center">Preview: {panels} Panels x {strings} Strings (Auto-Fit View)</div>
             
             {/* Container หลัก: เรียงสตริงลงแนวตั้ง (Flex-Col) */}
             <div className="flex flex-col gap-6 w-full h-full overflow-y-auto pr-2">
                {[...Array(strings > 0 ? strings : 1)].map((_, s) => (
                  <div key={s} className="w-full">
                    {/* Label ชื่อสตริง */}
                    <div className="text-[10px] text-blue-300 mb-1 ml-1 font-bold">STRING {s+1}</div>
                    
                    {/* Container แผง: เรียงแผงไปทางขวาเสมอ (Flex-Row) */}
                    <div className="flex flex-row w-full bg-slate-700/30 p-2 rounded-lg border border-slate-600/50 items-center justify-start gap-px md:gap-1">
                        {[...Array(panels > 0 ? panels : 0)].map((_, i) => (
                          <div 
                            key={i}
                            // --- Logic Auto-Resize ---
                            // 1. ความกว้าง = 100% หาร จำนวนแผง (เพื่อให้เต็มบรรทัดพอดี)
                            // 2. Max-Width = ล็อคไม่ให้ใหญ่เกินไปถ้าแผงน้อย
                            // 3. Aspect Ratio = กำหนดรูปทรง (3/2 = แนวนอน, 2/3 = แนวตั้ง)
                            style={{ 
                                width: `${100 / panels}%`, 
                                maxWidth: '100px',
                                aspectRatio: mode === 'landscape' ? '3/2' : '2/3' 
                            }}
                            className="bg-[#0ea5e9] border border-white/20 shadow-sm relative shrink-0 transition-all hover:bg-blue-400"
                          >
                            {/* Grid Line Effect */}
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
                      <tr><td className="px-3 py-2 text-gray-700">ความยาวราง/เส้น</td><td className="px-3 py-2 text-right font-bold text-blue-600">{railLengthPerString.toFixed(2)} ม.</td></tr>
                      <tr><td className="px-3 py-2 text-gray-700">จำนวนรางรวม</td><td className="px-3 py-2 text-right">{totalRailCount} เส้น</td></tr>
                      <tr><td className="px-3 py-2 text-gray-700">L-Feet</td><td className="px-3 py-2 text-right font-bold">{totalLFeet}</td></tr>
                      <tr><td className="px-3 py-2 text-gray-700">Mid Clamp</td><td className="px-3 py-2 text-right">{totalMidClamp}</td></tr>
                      <tr><td className="px-3 py-2 text-gray-700">End Clamp</td><td className="px-3 py-2 text-right">{totalEndClamp}</td></tr>
                      <tr><td className="px-3 py-2 text-gray-700">Grounding Plate</td><td className="px-3 py-2 text-right">{totalMidClamp}</td></tr>
                      <tr className="bg-blue-50"><td className="px-3 py-2 text-blue-800 font-bold">รางรวมทั้งหมด</td><td className="px-3 py-2 text-right font-bold text-red-500 text-sm">{(railLengthPerString * totalRailCount).toFixed(2)} ม.</td></tr>
                   </tbody>
                </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
