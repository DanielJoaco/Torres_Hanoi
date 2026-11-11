export const MAX_PER_CUSTOMER = 150; // 100 de precisión + 50 de bonus

export function calcStars(score, total, served) {
  const ratio = score / (total * MAX_PER_CUSTOMER);
  if (ratio >= 0.8) return 3;
  if (ratio >= 0.5) return 2;
  return served > 0 ? 1 : 0;
}