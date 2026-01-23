import React, { useState } from 'react';

export default function App() {
  // --- ตั้งค่าตัวแปร (State) ---
  const [mode, setMode] = useState('landscape'); // 'landscape' หรือ 'portrait'
  const [panels, setPanels] = useState(10);
  
  // Advanced Settings (หน่วยเป็น มม.)
  const [midClamp, setMidClamp] = useState(20);    // ระยะห่างระหว่างแผง (ปกติ 20mm)
  const [endClamp, setEndClamp] = useState(100);   // ระยะเผื่อปลายรางรวม End Clamp (ข้างละ 100mm)
  const [lFeetDist, setLFeetDist] = useState(1200); // ระยะห่าง L-Feet

  // ค่าคงที่
  const panelWidth = 1.303; // เมตร

  // --- สูตรคำนวณความยาวราง (Main Logic) ---
  // 1. ความยาวเนื้อแผง = จำนวน x 1.303
  const panelsLength = panels * panelWidth;
  
  // 2. ระยะเผื่อ (Gaps & Overhangs)
  //    - ช่องว่างระหว่างแผง = (จำนวนแผง - 1) x Mid Clamp
  //    - ระยะปลายราง 2 ข้าง = End Clamp x 2
  const gapLengthMm = ((panels > 0 ? panels - 1 : 0) * midClamp) + (endClamp * 2);
  const gapLengthM = gapLengthMm / 1000; // แปลงเป็นเมตร

  // 3. ความยาวรวมสุทธิ
  const totalLength = panelsLength + gapLengthM;

  // --- สูตรคำนวณวัสดุอุปกรณ์ (BOM) ---
  const railCount = 2; // รางคู่เสมอ
  const totalRailMeter = totalLength * railCount;
  
  // คำนวณ L-Feet: (ความยาวราง / ระยะห่าง) + 1 (ปัดเศษลงเพื่อความปลอดภัย หรือตามสูตรช่าง)
  // สูตรทั่วไป: ระยะทาง / ระยะห่าง -> ปัดขึ้น -> +1 ตัวเริ่มต้น
  const lFeetPerRail = Math.ceil((totalLength * 1000) / lFeetDist) + 1;
  const totalLFeet = lFeetPerRail * railCount;

  const totalMidClamp = (panels > 0 ? panels - 1 : 0) * 2; // บนล่าง
  const totalEndClamp = 4; // 4 ตัวเสมอ

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans text-gray-800">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-5xl border-t-8 border-[#0ea5e9]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            UD Solarmax <span className="text-sm font-normal text-gray-500">Engineering Calc v5.9 (Full BOM)</span>
          </h1>
          <div className="text-right mt-2 md:mt-0">
            <p className="text-xs text-gray-400">Rail Logic:</p>
            <p className="text-sm font-bold text-[#0ea5e9]">Fixed Width (1.303m)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Column 1: Control Panel (4/12) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Mode Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">รูปแบบการวางแผง</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setMode('landscape')}
                  className={`px-3 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    mode === 'landscape' 
                    ? "border-[#0ea5e9] bg-blue-50 text-blue-900" 
                    : "border-gray-200 text-gray-500"
                  }`}
                >
                  แผงแนวนอน<br/><span className="text-xs font-normal">รางวางแนวตั้ง</span>
                </button>
                <button 
                  onClick={() => setMode('portrait')}
                  className={`px-3 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    mode === 'portrait' 
                    ? "border-[#0ea5e9] bg-blue-50 text-blue-900" 
                    : "border-gray-200 text-gray-500"
                  }`}
                >
                  แผงแนวตั้ง<br/><span className="text-xs font-normal">รางวางแนวนอน</span>
                </button>
              </div>
            </div>

            {/* 2. Main Inputs */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
              <div>
                <label className="block text-xs text-blue-800 uppercase font-bold">จำนวนแผง (Panels)</label>
                <input 
                  type="number" 
                  value={panels}
                  onChange={(e) => setPanels(Number(e.target.value))}
                  className="w-full mt-1 border border-blue-200 rounded px-3 py-2 text-lg font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-xs text-gray-500 uppercase font-bold">ตัวคูณกว้าง (ม.)</label>
                    <input type="number" value={panelWidth} readOnly className="w-full mt-1 bg-gray-200 border border-gray-300 rounded px-2 py-2 text-gray-500 text-center" />
                 </div>
                 <div>
                    <label className="block text-xs text-gray-500 uppercase font-bold">Clamp รวม (ม.)</label>
                    <input type="text" value={gapLengthM.toFixed(2)} readOnly className="w-full mt-1 bg-gray-200 border border-gray-300 rounded px-2 py-2 text-gray-600 text-center font-bold" />
                 </div>
              </div>
            </div>

            {/* 3. Advanced Settings (The Missing Parts) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <h3 className="text-sm font-bold text-gray-700 border-b pb-1 mb-2">ตั้งค่าระยะ (มิลลิเมตร)</h3>
              
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-600">Mid Clamp (ช่องว่างแผง)</label>
                <input 
                  type="number" 
                  value={midClamp}
                  onChange={(e) => setMidClamp(Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1 text-right text-sm" 
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-600">End Clamp + เผื่อปลาย</label>
                <input 
                  type="number" 
                  value={endClamp}
                  onChange={(e) => setEndClamp(Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1 text-right text-sm" 
                />
              </div>
              <p className="text-[10px] text-gray-400 text-right">*ค่านี้คิดรวม 2 ฝั่งแล้วหารเฉลี่ย หรือกรอกข้างเดียว</p>

              <div className="flex justify-between items-center pt-2 border-t border-dashed">
                <label className="text-xs text-gray-600">ระยะห่าง L-Feet</label>
                <input 
                  type="number" 
                  value={lFeetDist}
                  onChange={(e) => setLFeetDist(Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1 text-right text-sm" 
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-gray-900 text-white p-5 rounded-lg text-center shadow-lg transform scale-105 border-2 border-[#0ea5e9]">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">ความยาวรางที่ต้องใช้</p>
              <div className="text-4xl font-mono font-bold text-[#38bdf8]">
                {totalLength.toFixed(2)} ม.
              </div>
            </div>

          </div>

          {/* --- Column 2: Visualization (4/12) --- */}
          <div className="lg:col-span-4 bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[400px]">
             <div className="absolute top-4 left-4 text-xs text-white opacity-50">Preview</div>
             
             {/* Dynamic Render */}
             <div className={`transition-all duration-500 flex gap-1 items-center ${
                mode === 'landscape' ? 'flex-col py-4' : 'flex-row px-4 overflow-x-auto w-full'
              }`}>
                {[...Array(panels > 0 ? panels : 0)].map((_, i) => (
                  <div 
                    key={i}
                    className={`bg-[#0ea5e9] border border-blue-300 shadow-sm relative shrink-0 transition-all ${
                      mode === 'landscape' ? 'w-32 h-20' : 'w-16 h-32'
                    }`}
                  >
                    <div className="absolute inset-0 grid grid-cols-1 gap-px opacity-20 bg-transparent">
                       <div className="border-t border-white h-full"></div>
                    </div>
                  </div>
                ))}
             </div>
             <p className="absolute bottom-2 text-[10px] text-gray-500">Render: {mode.toUpperCase()}</p>
          </div>

          {/* --- Column 3: BOM / รายการวัสดุ (4/12) --- */}
          <div className="lg:col-span-4 space-y-4">
             <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-[#1e293b] text-white px-4 py-3 text-sm font-bold flex justify-between">
                   <span>รายการวัสดุ (BOM)</span>
                   <span className="text-[#38bdf8]">UD Solarmax</span>
                </div>
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                      <tr>
                         <th className="px-4 py-2">รายการ</th>
                         <th className="px-4 py-2 text-right">จำนวน</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      <tr>
                         <td className="px-4 py-3 text-gray-700">ความยาวรางรวม (เมตร)</td>
                         <td className="px-4 py-3 text-right font-bold text-blue-600">{totalLength.toFixed(2)}</td>
                      </tr>
                      <tr>
                         <td className="px-4 py-3 text-gray-700">จำนวนราง (เส้นคู่)</td>
                         <td className="px-4 py-3 text-right">2 เส้น</td>
                      </tr>
                      <tr>
                         <td className="px-4 py-3 text-gray-700">L-Feet (ตัว)</td>
                         <td className="px-4 py-3 text-right font-bold">{totalLFeet}</td>
                      </tr>
                      <tr>
                         <td className="px-4 py-3 text-gray-700">Mid Clamp (ตัว)</td>
                         <td className="px-4 py-3 text-right">{totalMidClamp}</td>
                      </tr>
                      <tr>
                         <td className="px-4 py-3 text-gray-700">End Clamp (ตัว)</td>
                         <td className="px-4 py-3 text-right">{totalEndClamp}</td>
                      </tr>
                      <tr>
                         <td className="px-4 py-3 text-gray-700">Grounding Plate (แผ่น)</td>
                         <td className="px-4 py-3 text-right">{totalMidClamp}</td>
                      </tr>
                      <tr className="bg-blue-50">
                         <td className="px-4 py-3 text-blue-800 font-bold">ความยาวตัดราง (สุทธิ)</td>
                         <td className="px-4 py-3 text-right font-bold text-red-500 text-lg">{totalLength.toFixed(2)} ม.</td>
                      </tr>
                   </tbody>
                </table>
             </div>
             
             <div className="text-xs text-gray-400 p-2">
                *หมายเหตุ: คำนวณ L-Feet ที่ระยะห่าง {lFeetDist/1000} เมตร
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
