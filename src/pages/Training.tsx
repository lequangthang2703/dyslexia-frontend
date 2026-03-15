import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
// 1. Import i18next
import { useTranslation } from "react-i18next";

interface Minigame {
  id: number;
  name: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  available: boolean;
}

const Training = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasSelectedProfile } = useAuth();
  // 2. Khởi tạo hàm t
  const { t } = useTranslation();

  // 3. Đưa danh sách game vào đây để dùng t() cho đa ngôn ngữ
  const minigames: Minigame[] = [
    {
      id: 1,
      name: t("training.games.game_1_name"),
      description: t("training.games.game_1_desc"),
      icon: "🤖",
      path: "/test/minigame1/instruction",
      color: "from-rose-400 to-rose-500",
      available: true,
    },
    {
      id: 2,
      name: t("training.games.game_2_name"),
      description: t("training.games.game_2_desc"),
      icon: "📖",
      path: "/test/minigame2/instruction",
      color: "from-pink-400 to-pink-500",
      available: true,
    },
    {
      id: 3,
      name: t("training.games.game_3_name"),
      description: t("training.games.game_3_desc"),
      icon: "🌳",
      path: "/test/minigame3",
      color: "from-green-400 to-green-500",
      available: true,
    },
    {
      id: 4,
      name: t("training.games.game_4_name"),
      description: t("training.games.game_4_desc"),
      icon: "🚀",
      path: "/test/minigame4/instruction",
      color: "from-indigo-400 to-purple-500",
      available: true,
    },
    {
      id: 5,
      name: t("training.games.game_5_name"),
      description: t("training.games.game_5_desc"),
      icon: "🌟",
      path: "/training/minigame5/instruction",
      color: "from-purple-400 to-purple-500",
      available: false,
    },
  ];

  const handlePlayGame = (game: Minigame) => {
    if (!game.available) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!hasSelectedProfile) {
      navigate("/profile/select");
      return;
    }

    navigate(game.path);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100 min-h-screen py-12 px-4 sm:px-8 rounded-[1.5rem]">
      {/* Header Section */}
      <section className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-4 font-[Comic Sans MS,cursive,sans-serif] drop-shadow-md">
          {t("training.title")}
        </h1>
        <p className="text-lg text-pink-500 font-semibold max-w-2xl mx-auto">
          {t("training.subtitle")}
        </p>
      </section>

      {/* Minigames Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {minigames.map((game) => (
            <div
              key={game.id}
              className={`
                relative overflow-hidden
                bg-white rounded-3xl shadow-xl 
                border-4 border-pink-200
                transform transition-all duration-300
                ${
                  game.available
                    ? "hover:scale-105 hover:shadow-2xl cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }
              `}
              onClick={() => handlePlayGame(game)}
            >
              <div className={`bg-gradient-to-r ${game.color} p-6 text-center`}>
                <span className="text-6xl">{game.icon}</span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {game.name}
                </h3>
                <p className="text-gray-600 mb-4">{game.description}</p>

                {game.available ? (
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors">
                    {t("training.play_now")}
                  </button>
                ) : (
                  <div className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-full text-center">
                    {t("training.coming_soon")}
                  </div>
                )}
              </div>

              {!game.available && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                  {t("training.badge_soon")}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-4xl mx-auto mt-12 text-center">
        <div className="bg-white/80 rounded-3xl p-8 shadow-lg border-4 border-yellow-200">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            {t("training.info_title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🧠</span>
              <h4 className="font-bold text-pink-600 mb-1">{t("training.benefits.brain_title")}</h4>
              <p className="text-gray-600 text-sm">
                {t("training.benefits.brain_desc")}
              </p>
            </div>
            <div className="text-center">
              <span className="text-4xl mb-2 block">🎯</span>
              <h4 className="font-bold text-pink-600 mb-1">{t("training.benefits.focus_title")}</h4>
              <p className="text-gray-600 text-sm">
                {t("training.benefits.focus_desc")}
              </p>
            </div>
            <div className="text-center">
              <span className="text-4xl mb-2 block">😊</span>
              <h4 className="font-bold text-pink-600 mb-1">{t("training.benefits.fun_title")}</h4>
              <p className="text-gray-600 text-sm">
                {t("training.benefits.fun_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Training;