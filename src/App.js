import React, { useState } from 'react';

export default function App() {
  // --- 1. ตั้งค่าตัวแปรหลัก (Main Specs) ---
  const [mode, setMode] = useState('landscape'); 
  const [panels, setPanels] = useState(10);
  const [strings, setStrings] = useState(1); 
  
  // สเปคแผง (แก้ไขได้)
  const [panelWidth, setPanelWidth] = useState(1.303); 
  const [panelLength, setPanelLength] = useState(2.382); 

  // --- 2. Advanced Settings (หน่วยเป็น มม.) ---
  const [midClamp, setMidClamp] = useState(20);    
  const [endClamp, setEndClamp] = useState(100);   
  const [lFeetDist, setLFeetDist] = useState(1200); 

  // --- 3. สูตรคำนวณ (Calculation Logic) ---
  const panelsLength = panels * panelWidth;
  const gapLengthMm = ((panels > 0 ? panels - 1 : 0) * midClamp) + (endClamp * 2);
  const gapLengthM = gapLengthMm / 1000;
  
  const railLengthPerString = panelsLength + gapLengthM;

  // B. คำนวณ BOM (คูณจำนวนสตริง)
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
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg w-full max-w-5xl border-t-8 border-[#0ea5e9]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
            UD Solarmax <span className="block md:inline text-xs md:text-sm font-normal text-gray-500">Engineering Calc v6.1</span>
          </h1>
          <div className="mt-2 md:mt-0">
             <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
               Strings: {strings}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- ฝั่งซ้าย: Control Panel (4/12) --- */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. Mode Selection */}
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
                  แผงแนวนอน<br/><span className="text-[10px] font-normal">รางวางแนวตั้ง</span>
                </button>
                <button 
                  onClick={() => setMode('portrait')}
                  className={`px-2 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    mode === 'portrait' 
                    ? "border-[#0ea5e9] bg-blue-50 text-blue-900" 
                    : "border-gray-200 text-gray-500"
                  }`}
                >
                  แผงแนวตั้ง<br/><span className="text-[10px] font-normal">รางวางแนวนอน</span>
                </button>
              </div>
            </div>

            {/* 2. Main Inputs */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-3">
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-blue-800 uppercase font-bold">จำนวนแผง</label>
                  <input 
                    type="number" 
                    value={panels}
                    onChange={(e) => setPanels(Number(e.target.value))}
                    className="w-full mt-1 border border-blue-200 rounded px-2 py-2 text-lg font-bold text-blue-900 text-center" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-blue-800 uppercase font-bold">จำนวนสตริง</label>
                  <input 
                    type="number" 
                    value={strings}
                    onChange={(e) => setStrings(Number(e.target.value))}
                    className="w-full mt-1 border border-blue-200 rounded px-2 py-2 text-lg font-bold text-blue-900 text-center" 
                  />
                </div>
              </div>

              <div className="border-t border-blue-200 pt-2 grid grid-cols-2 gap-2">
                 <div>
                    <label className="block text-[10px] text-gray-600 uppercase font-bold">ตัวคูณกว้าง (ม.)</label>
                    <input 
                      type="number" 
                      step="0.001"
                      value={panelWidth} 
                      onChange={(e) => setPanelWidth(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-gray-300 rounded px-2 py-1 text-gray-700 text-center text-sm" 
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] text-gray-600 uppercase font-bold">ยาว (ม.) ของแผง</label>
                    <input 
                      type="number" 
                      step="0.001"
                      value={panelLength} 
                      onChange={(e) => setPanelLength(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-gray-300 rounded px-2 py-1 text-gray-700 text-center text-sm" 
                    />
                 </div>
              </div>
            </div>

            {/* 3. Advanced Settings */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase border-b pb-1 mb-1">ตั้งค่าระยะ (มม.)</h3>
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-600">Mid Clamp</label>
                <input type="number" value={midClamp} onChange={(e) => setMidClamp(Number(e.target.value))} className="w-16 border rounded px-1 py-1 text-right text-xs" />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-600">End Clamp + เผื่อ</label>
                <input type="number" value={endClamp} onChange={(e) => setEndClamp(Number(e.target.value))} className="w-16 border rounded px-1 py-1 text-right text-xs" />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-600">ระยะห่าง L-Feet</label>
                <input type="number" value={lFeetDist} onChange={(e) => setLFeetDist(Number(e.target.value))} className="w-16 border rounded px-1 py-1 text-right text-xs" />
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-gray-900 text-white p-4 rounded-lg text-center shadow-lg border-2 border-[#0ea5e9]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">ความยาวรางที่ต้องใช้ (ต่อสตริง)</p>
              <div className="text-3xl md:text-4xl font-mono font-bold text-[#38bdf8]">
                {railLengthPerString.toFixed(2)} ม.
              </div>
            </div>

          </div>

          {/* --- ฝั่งขวา: Visualization (4/12) --- */}
          <div className="lg:col-span-4 bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-start relative min-h-[300px] overflow-hidden">
             <div className="absolute top-3 left-3 text-[10px] text-white opacity-50">Preview ({strings} Strings)</div>
             
             {/* Render Loop for Strings */}
             <div className="flex flex-col gap-4 w-full items-center overflow-y-auto max-h-[500px] py-6 px-2">
                {[...Array(strings > 0 ? strings : 1)].map((_, s) => (
                  <div key={s} className="relative group flex flex-col items-center">
                    <div className="text-[9px] text-white opacity-30 mb-1 w-full text-center border-b border-white/10 pb-1">STR {s+1}</div>
                    
                    {/* --- ส่วนแสดงผลรูปภาพ (แก้ไขขนาดที่นี่) --- */}
                    <div className={`transition-all duration-300 flex gap-[2px] items-center justify-center ${
                        mode === 'landscape' ? 'flex-col' : 'flex-row flex-wrap max-w-full'
                      }`}>
                        {[...Array(panels > 0 ? panels : 0)].map((_, i) => (
                          <div 
                            key={i}
                            className={`bg-[#0ea5e9] border border-blue-400/50 shadow-sm relative shrink-0 ${
                              // *** ปรับขนาดแผงให้เล็กลงตามที่ขอ (Mobile Friendly) ***
                              mode === 'landscape' 
                              ? 'w-14 h-9'   // แนวนอน (เดิม w-24 h-16) -> เล็กลง ~40%
                              : 'w-7 h-14'   // แนวตั้ง (เดิม w-12 h-24) -> เล็กลง ~40%
                            }`}
                          >
                            <div className="absolute inset-0 grid grid-cols-1 gap-px opacity-20 bg-transparent">
                              <div className="border-t border-white h-full"></div>
                            </div>
                          </div>
                        ))}
                    </div>

                  </div>
                ))}
             </div>
          </div>

          {/* --- ฝั่งขวาสุด: BOM (4/12) --- */}
          <div className="lg:col-span-4 space-y-4">
             <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-[#1e293b] text-white px-4 py-2 text-sm font-bold flex justify-between items-center">
                   <span>รายการวัสดุ (BOM)</span>
                   <span className="text-[#38bdf8] text-[10px] bg-slate-700 px-2 py-0.5 rounded">รวม {strings} สตริง</span>
                </div>
                <table className="w-full text-xs md:text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                      <tr>
                         <th className="px-3 py-2">รายการ</th>
                         <th className="px-3 py-2 text-right">จำนวน</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      <tr>
                         <td className="px-3 py-2 text-gray-700">ความยาวราง (เส้นละ)</td>
                         <td className="px-3 py-2 text-right font-bold text-blue-600">{railLengthPerString.toFixed(2)} ม.</td>
                      </tr>
                      <tr>
                         <td className="px-3 py-2 text-gray-700">จำนวนรางรวม</td>
                         <td className="px-3 py-2 text-right">{totalRailCount} เส้น</td>
                      </tr>
                      <tr>
                         <td className="px-3 py-2 text-gray-700">L-Feet</td>
                         <td className="px-3 py-2 text-right font-bold">{totalLFeet} ตัว</td>
                      </tr>
                      <tr>
                         <td className="px-3 py-2 text-gray-700">Mid Clamp</td>
                         <td className="px-3 py-2 text-right">{totalMidClamp} ตัว</td>
                      </tr>
                      <tr>
                         <td className="px-3 py-2 text-gray-700">End Clamp</td>
                         <td className="px-3 py-2 text-right">{totalEndClamp} ตัว</td>
                      </tr>
                      <tr>
                         <td className="px-3 py-2 text-gray-700">Grounding Plate</td>
                         <td className="px-3 py-2 text-right">{totalMidClamp} แผ่น</td>
                      </tr>
                      <tr className="bg-blue-50">
                         <td className="px-3 py-2 text-blue-800 font-bold">รางรวมทั้งหมด (เมตร)</td>
                         <td className="px-3 py-2 text-right font-bold text-red-500 text-sm">{(railLengthPerString * totalRailCount).toFixed(2)} ม.</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
