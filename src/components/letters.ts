/**
 * letters.ts
 * - Dữ liệu chữ cái và helper random
 */

export const LETTERS = ['b', 'd', 'p', 'q', 'm', 'n', 'a', 'e', 'o', 'u'];

/**
 * Lấy chữ cái ngẫu nhiên từ danh sách
 */
export function getRandomLetter(): string {
  const index = Math.floor(Math.random() * LETTERS.length);
  return LETTERS[index];
}
