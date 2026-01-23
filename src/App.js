<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UD Solarmax - Rail Calculator Corrected</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Sarabun', sans-serif; }
        .panel-box {
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col items-center p-6">

    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl border-t-8 border-[#0ea5e9]">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">UD Solarmax <span class="text-sm font-normal text-gray-500">Engineering Calc v5.8</span></h1>
            <div class="text-right">
                <p class="text-xs text-gray-400">Rail Logic:</p>
                <p class="text-sm font-bold text-[#0ea5e9]">Fixed Width (1.303m)</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1 space-y-6">
                
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">รูปแบบการวางแผง</label>
                    <div class="flex flex-col gap-2">
                        <button onclick="setMode('landscape')" id="btn-landscape" class="flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left">
                            <div>
                                <span class="font-bold block">แผงแนวนอน (Landscape)</span>
                                <span class="text-xs opacity-75">รางวางแนวตั้ง (Vertical Rail)</span>
                            </div>
                            <div class="h-6 w-6 bg-blue-500 rounded-sm"></div>
                        </button>
                        
                        <button onclick="setMode('portrait')" id="btn-portrait" class="flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left">
                            <div>
                                <span class="font-bold block">แผงแนวตั้ง (Portrait)</span>
                                <span class="text-xs opacity-75">รางวางแนวนอน (Horizontal Rail)</span>
                            </div>
                            <div class="h-6 w-4 bg-gray-300 rounded-sm"></div>
                        </button>
                    </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <div>
                        <label class="block text-xs text-gray-500 uppercase font-bold">จำนวนแผง (Panels)</label>
                        <input type="number" id="panels" value="10" class="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0ea5e9] font-bold text-lg" oninput="calculate()">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 uppercase font-bold">ตัวคูณความกว้าง (ม.)</label>
                        <input type="number" id="panelWidth" value="1.303" class="w-full mt-1 border border-gray-300 bg-gray-100 text-gray-500 rounded px-3 py-2" readonly>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 uppercase font-bold">ระยะเผื่อ (Clamp/Overhang)</label>
                        <input type="number" id="allowance" value="0.38" class="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#0ea5e9]" oninput="calculate()">
                    </div>
                </div>

                <div class="bg-gray-900 text-white p-5 rounded-lg text-center shadow-inner">
                    <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">ความยาวรางที่ต้องใช้</p>
                    <div class="text-4xl font-mono font-bold text-[#38bdf8]">
                        <span id="resultLength">0.00</span> ม.
                    </div>
                </div>
            </div>

            <div class="md:col-span-2 bg-slate-800 rounded-xl p-6 flex items-center justify-center overflow-auto relative min-h-[400px]">
                <div id="visual-container" class="relative transition-all duration-500">
                    </div>
                
                <div class="absolute bottom-4 right-4 text-xs text-gray-500">
                    *ภาพจำลองลักษณะการจัดเรียง
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentMode = 'landscape';

        function setMode(mode) {
            currentMode = mode;
            updateUI();
            calculate();
        }

        function updateUI() {
            const btnLand = document.getElementById('btn-landscape');
            const btnPort = document.getElementById('btn-portrait');

            // Reset Classes
            const activeClass = "border-[#0ea5e9] bg-blue-50 text-blue-900 ring-2 ring-blue-200";
            const inactiveClass = "border-gray-200 bg-white text-gray-600 hover:bg-gray-50";

            if (currentMode === 'landscape') {
                btnLand.className = `flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left ${activeClass}`;
                btnPort.className = `flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left ${inactiveClass}`;
            } else {
                btnLand.className = `flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left ${inactiveClass}`;
                btnPort.className = `flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left ${activeClass}`;
            }
        }

        function calculate() {
            const panels = parseInt(document.getElementById('panels').value) || 0;
            const width = parseFloat(document.getElementById('panelWidth').value) || 0;
            const allowance = parseFloat(document.getElementById('allowance').value) || 0;

            // 1. Calculate Length (Fixed Logic per user request)
            const totalLength = (panels * width) + allowance;
            document.getElementById('resultLength').innerText = totalLength.toFixed(2);

            // 2. Render Visualization
            renderVisuals(panels);
        }

        function renderVisuals(count) {
            const container = document.getElementById('visual-container');
            container.innerHTML = ''; // Clear

            // Create Rail Line (Gold color)
            const rail = document.createElement('div');
            
            if (currentMode === 'landscape') {
                // LANDSCAPE MODE -> Vertical Rail -> Vertical Stack
                // ตามรูปที่ 2: เรียงลงมาเป็นตึก
                container.className = "flex flex-col gap-1 items-center py-4"; // Column Layout
                
                // Draw Panels
                for(let i=0; i<count; i++) {
                    const panel = document.createElement('div');
                    // แผงแนวนอน = กว้าง > สูง
                    panel.className = "w-32 h-20 bg-[#0ea5e9] border border-blue-300 shadow-sm relative shrink-0";
                    
                    // Add grid lines specific to PV panel look
                    const grid = document.createElement('div');
                    grid.className = "absolute inset-0 grid grid-cols-1 gap-px opacity-20 bg-transparent";
                    grid.innerHTML = '<div class="border-t border-white h-full"></div>';
                    panel.appendChild(grid);
                    
                    container.appendChild(panel);
                }
                
                // Rail behind (Visual trick: using absolute positioning on container wrapper would be better, but simple flex gap works for demo)
                // Let's assume the rail runs through them.

            } else {
                // PORTRAIT MODE -> Horizontal Rail -> Horizontal Row
                container.className = "flex flex-row gap-1 items-center px-4"; // Row Layout
                
                // Draw Panels
                for(let i=0; i<count; i++) {
                    const panel = document.createElement('div');
                    // แผงแนวตั้ง = สูง > กว้าง
                    panel.className = "w-16 h-32 bg-[#0ea5e9] border border-blue-300 shadow-sm relative shrink-0";
                    
                    container.appendChild(panel);
                }
            }
        }

        // Init
        setMode('landscape'); // Default per request
    </script>
</body>
</html>
