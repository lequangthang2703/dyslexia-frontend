import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

type LanguageCode = "vi" | "en";

const GameLanguageSwitch = ({ className = "" }: { className?: string }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage: LanguageCode = i18n.language.startsWith("en") ? "en" : "vi";

  // Easily add more languages here later!
  const languageLabels = {
    button: currentLanguage === "vi" ? "Ngôn ngữ" : "Language",
    vi: "Tiếng Việt",
    en: "English",
  };

  const changeLanguage = (language: LanguageCode) => {
    if (currentLanguage !== language) {
      i18n.changeLanguage(language);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 rounded-lg border border-pink-200 bg-white/85 px-3 py-2 text-sm font-bold text-pink-600 shadow-sm transition hover:bg-pink-50 min-w-32"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span>{languageLabels.button}</span>
        <span className="text-xs">{"\u25BE"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border border-pink-200 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => changeLanguage("vi")}
            className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${
              currentLanguage === "vi"
                ? "bg-pink-500 text-white"
                : "text-pink-600 hover:bg-pink-50"
            }`}
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
          >
            {languageLabels.en}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameLanguageSwitch;