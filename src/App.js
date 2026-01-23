<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UD Solarmax - Rail Calculator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Sarabun', sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">

    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-yellow-500">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">คำนวณความยาวราง<br><span class="text-yellow-600 text-lg">UD Solarmax</span></h1>

        <div class="space-y-4">
            
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">รูปแบบการติดตั้ง</label>
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="setMode('portrait')" id="btn-portrait" class="border-2 border-yellow-500 bg-yellow-500 text-white py-2 rounded-lg transition">
                        แผงแนวตั้ง<br><span class="text-xs">(รางแนวนอน)</span>
                    </button>
                    <button onclick="setMode('landscape')" id="btn-landscape" class="border-2 border-gray-300 text-gray-600 py-2 rounded-lg transition hover:border-yellow-400">
                        แผงแนวนอน<br><span class="text-xs">(รางแนวตั้ง)</span>
                    </button>
                </div>
                <p id="mode-desc" class="text-xs text-gray-500 mt-2 text-center">
                    *คำนวณโดยใช้ความกว้างแผงเป็นหลัก
                </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-1">จำนวนแผง</label>
                    <input type="number" id="panels" value="10" class="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-yellow-500" oninput="calculate()">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-1">ความกว้างแผง (ม.)</label>
                    <input type="number" id="panelWidth" value="1.303" step="0.001" class="w-full border rounded px-3 py-2 text-gray-700 bg-gray-100" readonly>
                </div>
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-1">ระยะเผื่อ (Clamp + Overhang) (ม.)</label>
                <input type="number" id="allowance" value="0.38" step="0.01" class="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-yellow-500" oninput="calculate()">
            </div>

        </div>

        <div class="mt-8 bg-gray-800 text-white p-6 rounded-lg text-center">
            <p class="text-sm text-gray-400 mb-1">ความยาวรางที่ต้องใช้</p>
            <div class="text-4xl font-bold text-yellow-400">
                <span id="result">0.00</span> <span class="text-xl text-white">ม.</span>
            </div>
            <p class="text-xs text-gray-500 mt-2 border-t border-gray-700 pt-2">
                สูตร: (จำนวน x 1.303) + 0.38
            </p>
        </div>
    </div>

    <script>
        let currentMode = 'portrait';

        function setMode(mode) {
            currentMode = mode;
            
            // Update UI Buttons
            const btnPortrait = document.getElementById('btn-portrait');
            const btnLandscape = document.getElementById('btn-landscape');
            const desc = document.getElementById('mode-desc');

            if (mode === 'portrait') {
                btnPortrait.className = "border-2 border-yellow-500 bg-yellow-500 text-white py-2 rounded-lg transition shadow-md";
                btnLandscape.className = "border-2 border-gray-300 text-gray-600 py-2 rounded-lg transition hover:border-yellow-400";
                desc.innerHTML = "แผงแนวตั้ง (รางวิ่งแนวนอน) = ใช้ความกว้างแผงคูณ";
            } else {
                btnPortrait.className = "border-2 border-gray-300 text-gray-600 py-2 rounded-lg transition hover:border-yellow-400";
                btnLandscape.className = "border-2 border-yellow-500 bg-yellow-500 text-white py-2 rounded-lg transition shadow-md";
                desc.innerHTML = "แผงแนวนอน (รางวิ่งแนวตั้ง) = ใช้ความกว้างแผงคูณ";
            }

            // Recalculate (Although logic is same, trigger update)
            calculate();
        }

        function calculate() {
            // ดึงค่า Input
            const panels = parseFloat(document.getElementById('panels').value) || 0;
            const width = parseFloat(document.getElementById('panelWidth').value) || 0;
            const allowance = parseFloat(document.getElementById('allowance').value) || 0;

            // สูตรคำนวณ (เหมือนกันทั้ง 2 โหมด ตามที่ระบุ)
            // Length = (Panels * PanelWidth) + Allowance
            const totalLength = (panels * width) + allowance;

            // แสดงผล
            document.getElementById('result').innerText = totalLength.toFixed(2);
        }

        // Run on load
        calculate();
    </script>
</body>
</html>
