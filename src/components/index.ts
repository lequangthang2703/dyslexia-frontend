/**
 * index.ts
 * - Export gọn tất cả module minigame4
 */

// Export SpaceRescueGame từ thư mục minigame4 mới
export { default as SpaceRescueGame } from "./tests/minigame4/uncheck";

// Export các component từ minigame4/components
export { default as MiniGame4Instruction } from "./tests/minigame4/MiniGame4Instruction";
export { default as MiniGame4 } from "./tests/minigame4/MiniGame4";

// Export các utility functions
import { speakLetter } from "./audio";
import * as animations from "./animations";
import {
  rewardCorrectAnswer,
  resetRewards,
  loadRewardState,
} from "./rewardSystem";
import { LETTERS, getRandomLetter } from "./letters";

export {
  speakLetter,
  animations,
  rewardCorrectAnswer,
  resetRewards,
  loadRewardState,
  LETTERS,
  getRandomLetter,
};
