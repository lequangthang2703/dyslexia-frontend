import mascotImage from "../assets/icons/mascot.jpg";
import benefitBook from "../assets/icons/book.jpg";
import benefitHeart from "../assets/icons/heart.png";
import benefitStar from "../assets/icons/star.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { accountService } from "../services/accountService";
import { testSessionService } from "../services/testSessionService";
import { useTestProgress } from "../hooks/useTestProgress";
// 1. Import hook dịch thuật
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasSelectedProfile, selectedProfile } = useAuth();
  const { setCurrentSessionId, resetProgress } = useTestProgress();
  
  // 2. Khởi tạo hàm t()
  const { t } = useTranslation();

  const handleStart = async () => {
    console.log("Selected Profile:", selectedProfile);
    if (!isAuthenticated) {
      navigate("/login");
    } else if (isAuthenticated && !hasSelectedProfile) {
      navigate("/profile/select");
    } else if (isAuthenticated && hasSelectedProfile) {
      const profileInfo: any = await accountService.getCurrentProfile();
      console.log("Profile Info:", profileInfo);
      const hasInfo =
        profileInfo &&
        profileInfo.name &&
        profileInfo.year_of_birth &&
        profileInfo.email &&
        profileInfo.gender &&
        profileInfo.mother_tongue &&
        profileInfo.official_dyslexia_diagnosis;
      if (hasInfo) {
        // Start new session and navigate to test
        resetProgress();
        const newSession = await testSessionService.startTestSession();
        setCurrentSessionId(newSession.id);
        navigate("/test/auditory/instruction");
      } else {
        navigate("/human");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100 min-h-screen py-12 px-4 sm:px-8 rounded-[1.5rem]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Left content */}
        <div className="text-center md:text-left md:w-1/2 space-y-6 px-4">
          <h1 className="text-5xl font-extrabold text-pink-600 leading-tight font-[Comic Sans MS,cursive,sans-serif] drop-shadow-md">
            {t("home.hero_title_1")}
            <br />
            {t("home.hero_title_2")}
            <span className="text-yellow-500">Buddy</span>
          </h1>
          <p className="text-lg text-pink-500 font-semibold drop-shadow">
            {t("home.hero_subtitle_1")}
            <br />
            {t("home.hero_subtitle_2")}
          </p>
          <br />
          <button
            onClick={handleStart}
            className="bg-yellow-300 hover:bg-yellow-400 text-pink-500 px-10 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-200 border-4 border-pink-200 animate-bounce"
          >
            {t("home.start_btn")}
          </button>
        </div>

        {/* Right mascot image */}
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <img
            src={mascotImage}
            alt="Friendly reading buddy mascot"
            className="w-72 h-72 rounded-full shadow-xl border-8 border-pink-200 bg-white object-cover"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mt-20 text-center">
        <h2 className="text-3xl font-extrabold text-green-500 mb-10 font-[Comic Sans MS,cursive,sans-serif] drop-shadow-md">
          {t("home.benefits_title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Benefit Box 1 */}
          <div className="bg-yellow-200 text-blue-800 p-8 rounded-[2em] shadow-xl border-4 border-pink-200 flex flex-col items-center">
            <img src={benefitBook} alt="Book Icon" className="w-16 h-16 mb-4" />
            <h3 className="font-bold text-xl mb-2 font-[Comic Sans MS,cursive,sans-serif]">
              {t("home.benefit_1_title")}
            </h3>
            <p className="text-base font-semibold">
              {t("home.benefit_1_desc")}
            </p>
          </div>

          {/* Benefit Box 2 */}
          <div className="bg-pink-200 text-green-700 p-8 rounded-[2em] shadow-xl border-4 border-yellow-200 flex flex-col items-center">
            <img
              src={benefitHeart}
              alt="Heart Icon"
              className="w-16 h-16 mb-4"
            />
            <h3 className="font-bold text-xl mb-2 font-[Comic Sans MS,cursive,sans-serif]">
              {t("home.benefit_2_title")}
            </h3>
            <p className="text-base font-semibold">
              {t("home.benefit_2_desc")}
            </p>
          </div>

          {/* Benefit Box 3 */}
          <div className="bg-cyan-200 text-pink-700 p-8 rounded-[2em] shadow-xl border-4 border-green-100 flex flex-col items-center">
            <img src={benefitStar} alt="Star Icon" className="w-16 h-16 mb-4" />
            <h3 className="font-bold text-xl mb-2 font-[Comic Sans MS,cursive,sans-serif]">
              {t("home.benefit_3_title")}
            </h3>
            <p className="text-base font-semibold">
              {t("home.benefit_3_desc")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;