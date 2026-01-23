import React, { useState } from 'react';

export default function App() {
  // --- ตั้งค่าตัวแปร (State) ---
  const [mode, setMode] = useState('landscape'); // 'landscape' หรือ 'portrait'
  const [panels, setPanels] = useState(10);
  const [allowance, setAllowance] = useState(0.38);
  
  // ค่าคงที่
  const panelWidth = 1.303; 

  // --- สูตรคำนวณ (ใช้สูตรเดียวกันทั้ง 2 โหมด) ---
  const totalLength = (panels * panelWidth) + parseFloat(allowance || 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans text-gray-800">
      
      {/* Header Panel */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl border-t-8 border-[#0ea5e9]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            UD Solarmax <span className="text-sm font-normal text-gray-500">Engineering Calc v5.8 (React)</span>
          </h1>
          <div className="text-right mt-2 md:mt-0">
            <p className="text-xs text-gray-400">Rail Logic:</p>
            <p className="text-sm font-bold text-[#0ea5e9]">Fixed Width (1.303m)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- ฝั่งซ้าย: แผงควบคุม --- */}
          <div className="md:col-span-1 space-y-6">
            
            {/* ปุ่มเลือกโหมด */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">รูปแบบการวางแผง</label>
              <div className="flex flex-col gap-2">
                {/* ปุ่ม Landscape */}
                <button 
                  onClick={() => setMode('landscape')}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    mode === 'landscape' 
                    ? "border-[#0ea5e9] bg-blue-50 text-blue-900 ring-2 ring-blue-200" 
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <span className="font-bold block">แผงแนวนอน (Landscape)</span>
                    <span className="text-xs opacity-75">รางวางแนวตั้ง (Vertical Rail)</span>
                  </div>
                  <div className="h-6 w-6 bg-blue-500 rounded-sm"></div>
                </button>
                
                {/* ปุ่ม Portrait */}
                <button 
                  onClick={() => setMode('portrait')}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    mode === 'portrait' 
                    ? "border-[#0ea5e9] bg-blue-50 text-blue-900 ring-2 ring-blue-200" 
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <span className="font-bold block">แผงแนวตั้ง (Portrait)</span>
                    <span className="text-xs opacity-75">รางวางแนวนอน (Horizontal Rail)</span>
                  </div>
                  <div className="h-6 w-4 bg-gray-300 rounded-sm"></div>
                </button>
              </div>
            </div>

            {/* ช่องกรอกตัวเลข */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <div>
                <label className="block text-xs text-gray-500 uppercase font-bold">จำนวนแผง (Panels)</label>
                <input 
                  type="number" 
                  value={panels}
                  onChange={(e) => setPanels(Number(e.target.value))}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0ea5e9] font-bold text-lg" 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase font-bold">ตัวคูณความกว้าง (ม.)</label>
                <input 
                  type="number" 
                  value={panelWidth} 
                  readOnly 
                  className="w-full mt-1 border border-gray-300 bg-gray-100 text-gray-500 rounded px-3 py-2" 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase font-bold">ระยะเผื่อ (Clamp/Overhang)</label>
                <input 
                  type="number" 
                  value={allowance}
                  onChange={(e) => setAllowance(Number(e.target.value))}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0ea5e9]" 
                />
              </div>
            </div>

            {/* แสดงผลตัวเลข */}
            <div className="bg-gray-900 text-white p-5 rounded-lg text-center shadow-inner">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">ความยาวรางที่ต้องใช้</p>
              <div className="text-4xl font-mono font-bold text-[#38bdf8]">
                {totalLength.toFixed(2)} ม.
              </div>
            </div>
          </div>

          {/* --- ฝั่งขวา: ภาพจำลอง (Visualization) --- */}
          <div className="md:col-span-2 bg-slate-800 rounded-xl p-6 flex items-center justify-center overflow-auto relative min-h-[400px]">
            
            {/* Container สำหรับแผง */}
            <div className={`transition-all duration-500 flex gap-1 items-center ${
              mode === 'landscape' ? 'flex-col py-4' : 'flex-row px-4'
            }`}>
              
              {/* Loop สร้างจำนวนแผง */}
              {[...Array(panels > 0 ? panels : 0)].map((_, i) => (
                <div 
                  key={i}
                  className={`bg-[#0ea5e9] border border-blue-300 shadow-sm relative shrink-0 ${
                    mode === 'landscape' 
                      ? 'w-32 h-20' // Landscape mode = รูปทรงแนวนอน (กว้าง>สูง) แต่เรียงลงมา (flex-col)
                      : 'w-16 h-32' // Portrait mode = รูปทรงแนวตั้ง (สูง>กว้าง) แต่เรียงไปทางขวา (flex-row)
                  }`}
                >
                  {/* เส้น Grid จำลองลายแผง */}
                  <div className="absolute inset-0 grid grid-cols-1 gap-px opacity-20 bg-transparent">
                     <div className="border-t border-white h-full"></div>
                  </div>
                </div>
              ))}

            </div>

            <div className="absolute bottom-4 right-4 text-xs text-gray-500">
              *ภาพจำลองลักษณะการจัดเรียง (React Render)
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
