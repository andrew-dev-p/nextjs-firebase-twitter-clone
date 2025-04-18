export interface PatternGenerator {
  name: string;
  generate: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bgColor: string,
    fgColor: string,
    complexity: number
  ) => void;
}
