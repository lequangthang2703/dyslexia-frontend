/**
 * audio.ts
 * - Phát âm chữ cái dùng SpeechSynthesis
 */

/**
 * Phát âm 1 chữ cái
 */
export function speakLetter(letter: string, lang: string = 'vi-VN') {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(letter);
  utterance.lang = lang;
  utterance.rate = 0.8; // tốc độ nói chậm cho trẻ
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}