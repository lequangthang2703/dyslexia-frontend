import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Thêm i18next

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, error, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation(); // Khởi tạo t()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert(t('auth.fill_alert')); // Dịch thông báo alert
            return;
        }
        try {
            await login(email, password);
        } catch {
            // Error handled by context
        }
    };

    useEffect(() => {
        if (isAuthenticated) navigate("/profile/select");
    }, [isAuthenticated, navigate]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col bg-white border border-gray-100 p-8 rounded-2xl items-center space-y-5 shadow-lg max-w-sm w-full mx-auto"
        >
            <h1 className="text-3xl text-pink-600 font-bold mb-2">{t('auth.login_title')}</h1>
            
            <div className="w-full flex flex-col space-y-1">
                <label htmlFor="email" className="font-semibold text-gray-800">
                    {t('auth.email')}
                </label>
                <input
                    className="border border-gray-300 p-2 rounded-md focus:border-pink-500 focus:outline-none transition"
                    autoComplete="username"
                    type="email"
                    id="email"
                    placeholder={t('auth.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="w-full flex flex-col space-y-1">
                <label htmlFor="password" className="font-semibold text-gray-800">
                    {t('auth.password')}
                </label>
                <input
                    className="border border-gray-300 p-2 rounded-md focus:border-pink-500 focus:outline-none transition"
                    autoComplete="current-password"
                    type="password"
                    id="password"
                    placeholder={t('auth.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && <div className="text-red-500 w-full">{error}</div>}

            <button
                className={
                    (loading
                        ? "bg-pink-300 cursor-not-allowed"
                        : "bg-pink-500 hover:bg-pink-600") +
                    " py-2 w-full rounded-lg text-white font-semibold transition focus:ring-2 focus:ring-pink-200 focus:outline-none"
                }
                type="submit"
                disabled={loading}
            >
                {loading ? t('auth.logging_in') : t('auth.login_btn')}
            </button>

            <p className="text-gray-700 text-sm">
                {t('auth.no_account')}{" "}
                <a
                    className="text-pink-600 hover:underline hover:text-pink-800 font-medium"
                    href="/register"
                >
                    {t('auth.create_account')}
                </a>
            </p>
            <p className="text-gray-700 text-sm">
                <a
                    className="text-pink-600 hover:underline hover:text-pink-800 font-medium"
                    href="/forgot-password"
                >
                    {t('auth.forgot_password')}
                </a>
            </p>
        </form>
    );
};

export default LoginForm;