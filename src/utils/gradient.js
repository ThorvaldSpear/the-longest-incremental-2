export function mix(colorA, colorB, alpha) {
  return Array(3)
    .fill()
    .map((_, i) => colorA[i] * alpha + (1 - alpha) * colorB[i]);
}

export function generateGradient(start, end, colorCount) {
  return Array(colorCount)
    .fill()
    .map((_, i) => {
      // arrays go from 0 to x-1
      // accomadate that as we want start and end colors too
      const alpha = i / (colorCount - 1);
      return mix(start, end, alpha);
    });
}
