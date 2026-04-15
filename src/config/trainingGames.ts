export type TrainingGameConfig = {
  id: number;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  path: string;
  color: string;
  compactColor: string;
  available: boolean;
};

export const trainingGameConfigs: TrainingGameConfig[] = [
  {
    id: 1,
    nameKey: "training.games.game_1_name",
    descriptionKey: "training.games.game_1_desc",
    icon: "\uD83D\uDC1D",
    path: "/test/minigame1/instruction",
    color: "from-emerald-400 to-sky-500",
    compactColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    available: true,
  },
  {
    id: 2,
    nameKey: "training.games.game_2_name",
    descriptionKey: "training.games.game_2_desc",
    icon: "\uD83E\uDD16",
    path: "/test/minigame2/instruction",
    color: "from-sky-400 to-emerald-500",
    compactColor: "bg-sky-100 text-sky-700 border-sky-200",
    available: true,
  },
  {
    id: 3,
    nameKey: "training.games.game_3_name",
    descriptionKey: "training.games.game_3_desc",
    icon: "\uD83C\uDF33",
    path: "/test/minigame3",
    color: "from-green-400 to-green-500",
    compactColor: "bg-green-100 text-green-700 border-green-200",
    available: true,
  },
  {
    id: 4,
    nameKey: "training.games.game_4_name",
    descriptionKey: "training.games.game_4_desc",
    icon: "\u2B50",
    path: "/test/minigame4/instruction",
    color: "from-sky-500 to-indigo-500",
    compactColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    available: true,
  },
  {
    id: 5,
    nameKey: "training.games.game_5_name",
    descriptionKey: "training.games.game_5_desc",
    icon: "\u2728",
    path: "/training/minigame5/instruction",
    color: "from-gray-300 to-gray-400",
    compactColor: "bg-gray-100 text-gray-500 border-gray-200",
    available: false,
  },
];
