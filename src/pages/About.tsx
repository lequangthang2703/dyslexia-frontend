import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-28 pb-12 px-6 flex flex-col items-center">
      {/* Content wrapper without the white card 'layer' */}
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-8 tracking-tight">
          {t("about.title")}
        </h1>

        <div className="space-y-6 text-gray-800 text-xl leading-relaxed">
          <p>{t("about.intro")}</p>
          <p>
            {t("about.team_prefix")} {" "}
            <strong className="text-indigo-700">{t("about.school")}</strong>.
          </p>
        </div>

        {/* Mission section styled as a light highlight rather than a separate card */}
        <div className="mt-16 py-10 px-8 bg-white/30 backdrop-blur-sm rounded-[40px] border border-white/40 shadow-sm">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">
            {t("about.mission_title")}
          </h2>
          <p className="text-indigo-950 text-lg leading-relaxed max-w-2xl mx-auto">
            {t("about.mission_desc")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
