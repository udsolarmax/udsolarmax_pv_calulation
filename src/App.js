useEffect(() => {
    // 1. กำหนดขนาดด้านที่จะใช้คำนวณความยาวแถวตามทิศทางการวาง 
    // แนวตั้ง (Portrait): ใช้ความกว้างแผง | แนวนอน (Landscape): ใช้ความยาวแผง
    const dimensionForLength = panelOrientation === 'vertical' ? panelWidth : panelLength;

    // 2. คำนวณความยาวรวมของแผงใน 1 แถว (รวมระยะ Mid Clamp) 
    const panelsDim = (panelCountPerString * dimensionForLength) + ((panelCountPerString - 1) * midClampSpace);
    
    // 3. ความยาวรางรวมต่อ 1 แถว (บวกระยะ Overhang ทั้งสองด้าน) [cite: 6, 9]
    const rowLenMM = panelsDim + (2 * overhang);
    
    // 4. คำนวณอุปกรณ์ต่อ 1 แถว (String) 
    const midPerString = (panelCountPerString - 1) * 2; // Mid Clamp ใช้ 2 ตัวต่อช่องว่าง
    const railsPerString = Math.ceil((rowLenMM * 2) / railLength); // ราง 2 เส้นต่อแถว 
    const splicesPerString = Math.max(0, railsPerString - 2); // จำนวนตัวต่อราง 
    
    // คำนวณ L-Feet: หารความยาวรางด้วยระยะห่างที่กำหนด แล้วปัดขึ้นบวก 1 (สำหรับจุดเริ่มต้น) คูณ 2 เส้น 
    const lFeetPerString = (Math.ceil(rowLenMM / lFeetSpace) + 1) * 2;

    // 5. สรุปผลลัพธ์ทั้งหมดคูณด้วยจำนวนแถว (stringCount) 
    setResults({
      totalRailLength: (rowLenMM / 1000).toFixed(2),
      totalRailsNeeded: railsPerString * stringCount,
      midClamps: midPerString * stringCount,
      endClamps: 4 * stringCount, // End Clamp 4 ตัวต่อ 1 แถว [cite: 31]
      splices: splicesPerString * stringCount,
      lFeetCount: lFeetPerString * stringCount,
      panelTotalDim: (panelsDim / 1000).toFixed(2)
    });
  }, [panelWidth, panelLength, panelCountPerString, stringCount, lFeetSpace, railLength, midClampSpace, overhang, panelOrientation]);
