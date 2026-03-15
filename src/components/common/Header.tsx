import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
// 1. Import hook của i18next
import { useTranslation } from "react-i18next";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 2. Khởi tạo hàm dịch và quản lý ngôn ngữ
  const { t, i18n } = useTranslation();

  // 3. Hàm xử lý nút bấm đổi ngôn ngữ
  const toggleLanguage = () => {
    const newLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLang);
  };

  return (
    <header
      className="
        sticky top-0 z-10
        bg-gradient-pink-right
        shadow
        border-b-2 border-pink-200
        font-fredoka
      "
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold flex items-baseline">
          <span className="text-pink-500 drop-shadow">Dyslexia</span>
          <span className="text-yellow-500 drop-shadow">Buddy</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* NÚT ĐỔI NGÔN NGỮ (DESKTOP) - Đặt bên trái các menu cho dễ nhìn */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center w-10 h-10 font-bold text-pink-600 bg-pink-100 hover:bg-pink-200 rounded-full transition-colors shadow-sm"
            title="Đổi ngôn ngữ / Change language"
          >
            {i18n.language === "vi" ? "VN" : "EN"}
          </button>

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
                {t("nav.login", "Đăng nhập")} {/* Có fallback tạm nếu json lỗi */}
              </Link>
              <Link
                to="/register"
                className="ml-2 px-5 py-2 border-2 border-pink-400 text-pink-500 hover:bg-pink-100 rounded-full font-bold shadow transition"
              >
                {t("nav.register", "Đăng ký")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button & Mobile Language Toggle */}
        <div className="md:hidden flex items-center gap-3">
           {/* NÚT ĐỔI NGÔN NGỮ (MOBILE) */}
           <button
            onClick={toggleLanguage}
            className="w-9 h-9 font-bold text-pink-600 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center transition-colors shadow"
          >
            {i18n.language === "vi" ? "VN" : "EN"}
          </button>

          <button
            className="text-3xl text-pink-500 bg-yellow-200 rounded-full px-3 py-1 shadow hover:bg-yellow-300 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-3 space-y-2 bg-pink-100 rounded-b-3xl shadow font-fredoka">
          <Link
            to="/"
            className="block py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/about"
            className="block py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/training"
            className="block py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.practice")}
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block py-3 text-pink-600 hover:text-yellow-500 text-lg font-bold rounded-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
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
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.login", "Login")}
              </Link>
              <Link
                to="/register"
                className="block py-3 border-2 border-pink-400 text-pink-500 rounded-full text-center shadow font-bold"
                onClick={() => setIsMenuOpen(false)}
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