// rewardSystem.ts
// Quản lý phần thưởng khi bé trả lời đúng và xây thành phố
// Lưu vào localStorage để tồn tại lâu dài

export interface RewardState {
  buildings: number; // số tòa nhà đã xây
  stars: number;     // điểm thưởng
  level: number;     // cấp độ thành phố
}

const STORAGE_KEY = "minigame4_rewards";

export function loadRewardState(): RewardState {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { buildings: 0, stars: 0, level: 1 };
  }
  return JSON.parse(data);
}

export function saveRewardState(state: RewardState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Gọi khi trẻ TRẢ LỜI ĐÚNG */
export function rewardCorrectAnswer() {
  const state = loadRewardState();

  // +1 tòa nhà
  state.buildings += 1;

  // +2 điểm sao
  state.stars += 2;

  // lên cấp khi đủ 5 tòa nhà
  if (state.buildings % 5 === 0) {
    state.level += 1;
  }

  saveRewardState(state);
  return state;
}

/** Reset hoàn toàn reward (khi chơi lại) */
export function resetRewards() {
  const empty: RewardState = { buildings: 0, stars: 0, level: 1 };
  saveRewardState(empty);
  return empty;
}
