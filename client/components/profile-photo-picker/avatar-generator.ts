import { useRef, useEffect, useState } from "react";
import { COLORS } from "./constants";
import { PATTERNS } from "./patterns";

export function useAvatarGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgColor, setBgColor] = useState(COLORS[0]);
  const [fgColor, setFgColor] = useState(COLORS[5]);
  const [pattern, setPattern] = useState(PATTERNS[0].name);
  const [complexity, setComplexity] = useState(50);
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);

  const generateRandomAvatar = () => {
    const randomBg = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomFg = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)].name;
    const randomComplexity = Math.floor(Math.random() * 100);
    setBgColor(randomBg);
    setFgColor(randomFg);
    setPattern(randomPattern);
    setComplexity(randomComplexity);
  };

  const generateAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const width = canvas.width;
    const height = canvas.height;
    const patternGenerator = PATTERNS.find((p) => p.name === pattern);
    if (!patternGenerator) return null;
    patternGenerator.generate(ctx, width, height, bgColor, fgColor, complexity);
    const dataUrl = canvas.toDataURL("image/png");
    setGeneratedAvatarUrl(dataUrl);
    return dataUrl;
  };

  useEffect(() => {
    generateAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgColor, fgColor, pattern, complexity]);

  return {
    canvasRef,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
    pattern,
    setPattern,
    complexity,
    setComplexity,
    generatedAvatarUrl,
    generateRandomAvatar,
    generateAvatar,
  };
}
