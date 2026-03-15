import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
// 1. Import hook dịch thuật
import { useTranslation } from "react-i18next";

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    
    // 2. Khởi tạo hàm t()
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            alert(t('auth.fill_all_fields'));
            return;
        }

        if (password !== confirmPassword) {
            alert(t('auth.password_mismatch'));
            return;
        }

        try {
            const data = await authService.register({
                name,
                email,
                password,
            });
            if (data) {
                navigate("/login");
            }
        } catch (error: any) {
            let message = t('auth.generic_reg_error');
            if (error?.response?.data?.message) {
                message = error.response.data.message;
            }
            alert(`${t('auth.reg_failed')}: ${message}`);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col bg-white border border-gray-100 p-8 rounded-2xl items-center space-y-5 shadow-lg max-w-sm w-full mx-auto"
        >
            <h1 className="text-3xl text-pink-600 font-bold mb-2">{t('auth.register_title')}</h1>
            
            <div className="w-full flex flex-col space-y-1">
                <label htmlFor="name" className="font-semibold text-gray-800">
                    {t('auth.name')}
                </label>
                <input
                    className="border border-gray-300 p-2 rounded-md focus:border-pink-500 focus:outline-none transition"
                    type="text"
                    id="name"
                    placeholder={t('auth.name_placeholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                />
            </div>

            <div className="w-full flex flex-col space-y-1">
                <label htmlFor="email" className="font-semibold text-gray-800">
                    {t('auth.email')}
                </label>
                <input
                    className="border border-gray-300 p-2 rounded-md focus:border-pink-500 focus:outline-none transition"
                    type="email"
                    id="email"
                    placeholder={t('auth.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />
            </div>

            <div className="w-full flex flex-col space-y-1">
                <label htmlFor="password" title="password" className="font-semibold text-gray-800">
                    {t('auth.password')}
                </label>
                <input
                    className="border border-gray-300 p-2 rounded-md focus:border-pink-500 focus:outline-none transition"
                    type="password"
                    id="password"
                    placeholder={t('auth.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                />
            </div>

            <div className="w-full flex flex-col space-y-1">
                <label htmlFor="confirmPassword" object-title="confirmPassword" className="font-semibold text-gray-800">
                    {t('auth.confirm_password')}
                </label>
                <input
                    className="border border-gray-300 p-2 rounded-md focus:border-pink-500 focus:outline-none transition"
                    type="password"
                    id="confirmPassword"
                    placeholder={t('auth.confirm_password_placeholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                />
            </div>

            <button
                className="bg-pink-500 py-2 w-full rounded-lg text-white font-semibold hover:bg-pink-600 transition focus:ring-2 focus:ring-pink-200 focus:outline-none"
                type="submit"
            >
                {t('auth.register_btn')}
            </button>

            <p className="text-gray-700 text-sm ">
                {t('auth.have_account')}{" "}
                <a
                    className="text-pink-600 hover:underline hover:text-pink-800 font-medium"
                    href="/login"
                >
                    {t('auth.login_now')}
                </a>
            </p>
        </form>
    );
};

export default RegisterForm;