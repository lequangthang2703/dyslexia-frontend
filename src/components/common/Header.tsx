import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";

type LanguageCode = "vi" | "en";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLanguage: LanguageCode = i18n.language.startsWith("en")
    ? "en"
    : "vi";

  const languageLabels = {
    button: currentLanguage === "vi" ? "Ng\u00F4n ng\u1EEF" : "Language",
    vi: currentLanguage === "vi" ? "Ti\u1EBFng Vi\u1EC7t" : "Vietnamese",
    en: currentLanguage === "vi" ? "Ti\u1EBFng Anh" : "English",
  };

  const changeLanguage = (language: LanguageCode) => {
    if (currentLanguage !== language) {
      i18n.changeLanguage(language);
    }
    setIsLanguageOpen(false);
  };

  const LanguageSwitch = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`relative ${
        compact ? "" : "mr-1"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsLanguageOpen((open) => !open)}
        className={`flex items-center justify-center gap-2 rounded-lg border border-pink-200 bg-white/85 px-3 py-2 text-sm font-bold text-pink-600 shadow-sm transition hover:bg-pink-50 ${
          compact ? "min-w-24" : "min-w-32"
        }`}
        aria-haspopup="menu"
        aria-expanded={isLanguageOpen}
        title={languageLabels.button}
      >
        <span>{languageLabels.button}</span>
        <span className="text-xs">{"\u25BE"}</span>
      </button>

      {isLanguageOpen && (
        <div
          className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-lg border border-pink-200 bg-white shadow-lg"
          role="menu"
        >
          <button
            type="button"
            onClick={() => changeLanguage("vi")}
            className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${
              currentLanguage === "vi"
                ? "bg-pink-500 text-white"
                : "text-pink-600 hover:bg-pink-50"
            }`}
            role="menuitem"
          >
            {languageLabels.vi}
          </button>
          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${
              currentLanguage === "en"
                ? "bg-pink-500 text-white"
                : "text-pink-600 hover:bg-pink-50"
            }`}
            role="menuitem"
          >
            {languageLabels.en}
          </button>
        </div>
      )}
    </div>
  );

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 bg-gradient-pink-right shadow border-b-2 border-pink-200 font-fredoka">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-extrabold flex items-baseline">
          <span className="text-pink-500 drop-shadow">Dyslexia</span>
          <span className="text-yellow-500 drop-shadow">Buddy</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitch />

          <Link
            to="/"
            className="px-4 py-2 text-pink-600 hover:text-yellow-500 font-bold transition"
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/about"
            className="px-4 py-2 text-pink-600 hover:text-yellow-500 font-bold transition"
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/training"
            className="px-4 py-2 text-pink-600 hover:text-yellow-500 font-bold transition"
          >
            {t("nav.practice")}
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 text-pink-600 font-bold transition hover:text-yellow-400"
              >
                {t("nav.dashboard")}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 font-bold text-pink-600 bg-yellow-300 rounded-full shadow hover:bg-yellow-400 transition"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="ml-2 px-5 py-2 bg-pink-500 hover:bg-pink-400 text-white rounded-full font-bold shadow transition"
              >
                {t("nav.login", "Login")}
              </Link>
              <Link
                to="/register"
                className="ml-2 px-5 py-2 border-2 border-pink-400 text-pink-500 hover:bg-pink-100 rounded-full font-bold shadow transition"
              >
                {t("nav.register", "Register")}
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-3">
          <LanguageSwitch compact />

          <button
            type="button"
            className="text-3xl text-pink-500 bg-yellow-200 rounded-full px-3 py-1 shadow hover:bg-yellow-300 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {"\u2630"}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden px-6 pb-3 space-y-2 bg-pink-100 rounded-b-3xl shadow font-fredoka">
          <Link
            to="/"
            className="block py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
            onClick={closeMenu}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/about"
            className="block py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
            onClick={closeMenu}
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/training"
            className="block py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
            onClick={closeMenu}
          >
            {t("nav.practice")}
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
                onClick={closeMenu}
              >
                {t("nav.dashboard")}
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="block w-full text-left py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-3 bg-pink-500 text-white rounded-full text-center shadow font-bold"
                onClick={closeMenu}
              >
                {t("nav.login", "Login")}
              </Link>
              <Link
                to="/register"
                className="block py-3 border-2 border-pink-400 text-pink-500 rounded-full text-center shadow font-bold"
                onClick={closeMenu}
              >
                {t("nav.register", "Register")}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
