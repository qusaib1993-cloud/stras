const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function mapVideo() {
  const files = fs.readdirSync(__dirname);
  const webpFiles = files.filter(f => f.endsWith('.webp') && !f.startsWith('color-') && !f.startsWith('IMG_'));
  
  webpFiles.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

  console.log(`Mapping colors for all ${webpFiles.length} frames...`);
  
  for (const file of webpFiles) {
    const filePath = path.join(__dirname, file);
    const num = parseInt(file.match(/\d+/)[0]);
    
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();
      const width = metadata.width;
      const height = metadata.height;
      
      const left = Math.floor(width * 0.45);
      const top = Math.floor(height * 0.45);
      const regionWidth = Math.floor(width * 0.1);
      const regionHeight = Math.floor(height * 0.1);
      
      const buffer = await image
        .extract({ left, top, width: regionWidth, height: regionHeight })
        .resize(1, 1)
        .raw()
        .toBuffer();
        
      const r = buffer[0];
      const g = buffer[1];
      const b = buffer[2];
      
      // Let's classify the color based on RGB values
      let colorName = "Unknown";
      if (r < 60 && g < 60 && b < 60) {
        colorName = "Black (أسود)";
      } else if (r > 130 && g > 130 && b > 130) {
        colorName = "Light Grey/White";
      } else if (r > 100 && g > 115 && b > 115 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
        // e.g. R=123, G=132, B=127 -> Grey
        colorName = "Charcoal / Grey (رمادي)";
      } else if (g > r && g > b && g > 75) {
        colorName = "Dark Green (أخضر)";
      } else if (r > g && r > b && r > 120 && g < 110 && b < 110) {
        colorName = "Burgundy (برغندي)";
      } else if (b > r && b > g && b > 120) {
        colorName = "Sky Blue (سماوي)";
      } else if (r > g && r > b && r > 110 && g > 100) {
        colorName = "Beige (بيج)";
      } else if (r > 130 && g < 130 && b < 130) {
        colorName = "Burgundy/Red";
      } else if (Math.abs(r - g) < 15 && Math.abs(g - b) < 15) {
        colorName = "Greyish / Neutral";
      }
      
      // Print if it's a transition or color boundary
      console.log(`Frame ${num}: R=${r}, G=${g}, B=${b} -> ${colorName}`);
    } catch (err) {
      console.error(`Error analyzing ${file}:`, err);
    }
  }
}

mapVideo();
