import type { PatternGenerator } from "./types";

export const PATTERNS: PatternGenerator[] = [
  {
    name: "circles",
    generate: (ctx, width, height, bgColor, fgColor, complexity) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = fgColor;
      const count = Math.max(5, Math.floor(complexity / 10));
      for (let i = 0; i < count; i++) {
        const size = Math.random() * (width / 3) * (complexity / 100);
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    name: "triangles",
    generate: (ctx, width, height, bgColor, fgColor, complexity) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = fgColor;
      const count = Math.max(3, Math.floor(complexity / 10));
      for (let i = 0; i < count; i++) {
        const size = Math.random() * (width / 4) * (complexity / 100);
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
        ctx.fill();
      }
    },
  },
  {
    name: "hexagons",
    generate: (ctx, width, height, bgColor, fgColor, complexity) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = fgColor;
      const count = Math.max(2, Math.floor(complexity / 15));
      for (let i = 0; i < count; i++) {
        const size = Math.random() * (width / 5) * (complexity / 100);
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI) / 3;
          const pointX = x + size * Math.cos(angle);
          const pointY = y + size * Math.sin(angle);
          if (j === 0) {
            ctx.moveTo(pointX, pointY);
          } else {
            ctx.lineTo(pointX, pointY);
          }
        }
        ctx.closePath();
        ctx.fill();
      }
    },
  },
  {
    name: "waves",
    generate: (ctx, width, height, bgColor, fgColor, complexity) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 3;
      const waveCount = Math.max(2, Math.floor(complexity / 20));
      const amplitude = (height / 4) * (complexity / 100);
      for (let i = 0; i < waveCount; i++) {
        const y = (i + 1) * (height / (waveCount + 1));
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x += 10) {
          const frequency = 0.01 + complexity / 1000;
          const waveY = y + Math.sin(x * frequency) * amplitude;
          ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
    },
  },
  {
    name: "grid",
    generate: (ctx, width, height, bgColor, fgColor, complexity) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 2;
      const gridSize = Math.max(2, Math.floor(10 - complexity / 20));
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;
      // Draw vertical lines
      for (let i = 1; i < gridSize; i++) {
        const x = i * cellWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Draw horizontal lines
      for (let i = 1; i < gridSize; i++) {
        const y = i * cellHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // Add some random dots at intersections
      if (complexity > 50) {
        ctx.fillStyle = fgColor;
        for (let i = 0; i <= gridSize; i++) {
          for (let j = 0; j <= gridSize; j++) {
            if (Math.random() < complexity / 100) {
              const dotSize = 4 + complexity / 25;
              ctx.beginPath();
              ctx.arc(i * cellWidth, j * cellHeight, dotSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    },
  },
];
