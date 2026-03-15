import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import userService from "../services/userService";
import { accountService } from "../services/accountService";
import { useAuth } from "../hooks/useAuth";

const HumanFeaturesForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    native_language: "",
    rl_dyslexia: "",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const { selectedProfile } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null); // clear error on any change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation (expand as needed)
    if (
      !form.name ||
      !form.email ||
      !form.age ||
      !form.gender ||
      !form.native_language ||
      !form.rl_dyslexia
    ) {
      setFormError("Hãy nhập đầy đủ thông tin.");
      return;
    }
    if (isNaN(Number(form.age)) || Number(form.age) < 0) {
      setFormError("Vui lòng nhập số tuổi hợp lệ.");
      return;
    }

    try {
      console.log("User before update:", selectedProfile);
      // Convert age to year of birth
      const currentYear = new Date().getFullYear();
      const yearOfBirth = currentYear - Number(form.age);

      await accountService.updateProfile(selectedProfile!.id, {
        name: form.name,
        year_of_birth: yearOfBirth,
        email: form.email,
        gender: form.gender,
        mother_tongue: form.native_language,
        official_dyslexia_diagnosis: form.rl_dyslexia.toUpperCase(),
      });

      // Navigate to home after saving info
      setFormError(null);
      console.log("Form submitted:", form);
      navigate("/");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setFormError(
        error.response?.data?.detail ||
          "Cập nhật thông tin thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="bg-gradient-cyan p-10 rounded-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white p-8 rounded-3xl items-center space-y-5 shadow-xl md:max-w-md xl:max-w-xl w-full mx-auto border-4 border-pink-200"
      >
        {/* Heading */}
        <h2 className="text-2xl text-pink-600 font-bold text-center mb-1 drop-shadow">
          Chia sẻ một chút nhé!
        </h2>
        <div className="text-pink-500 font-semibold mb-2 text-center">
          Bước 1 / 4:{" "}
          <span className="text-gray-700 font-normal">Thông tin của bạn</span>
        </div>
        <div className="w-full h-1.5 bg-pink-100 rounded-full mb-4">
          <div
            className="bg-pink-400 h-1.5 rounded-full transition-all"
            style={{ width: "25%" }}
          />
        </div>

        {/* Error Message */}
        {formError && (
          <div className="w-full bg-red-100 border border-red-300 text-red-700 px-4 py-2 mb-2 rounded text-sm text-center">
            {formError}
          </div>
        )}
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 w-full">
          {/* Name */}
          <div className="w-full flex flex-col space-y-1">
            <label className="font-semibold text-pink-600">Tên</label>
            <input
              className="border border-gray-300 rounded-lg p-2 font-medium focus:border-yellow-400 focus:outline-none transition bg-white/70 font-fredoka"
              type="text"
              name="name"
              placeholder="Nhập tên của bạn"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Age */}
          <div className="w-full flex flex-col space-y-1">
            <label className="font-semibold text-pink-600">Tuổi</label>
            <input
              className="border border-gray-300 rounded-lg p-2 font-medium focus:border-yellow-400 focus:outline-none transition bg-white/70 font-fredoka"
              type="text"
              name="age"
              placeholder="Nhập tuổi của bạn"
              value={form.age}
              onChange={handleChange}
              autoComplete="off"
              inputMode="numeric" // mobile users will see the numeric keyboard
              pattern="\d*" // hint for numeric input, doesn't enforce on its own
            />
          </div>

          {/* Email */}
          <div className="w-full flex flex-col space-y-1">
            <label className="font-semibold text-pink-600">Email</label>
            <input
              className="border border-gray-300 rounded-lg p-2 font-medium focus:border-yellow-400 focus:outline-none transition bg-white/70 font-fredoka"
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Native Language */}
          <div className="w-full flex flex-col space-y-1">
            <label className="font-semibold text-pink-600">
              Ngôn ngữ mẹ đẻ
            </label>
            <input
              className="border border-gray-300 rounded-lg p-2 font-medium focus:border-yellow-400 focus:outline-none transition bg-white/70 font-fredoka"
              type="text"
              name="native_language"
              placeholder="Nhập ngôn ngữ mẹ đẻ của bạn"
              value={form.native_language}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          {/* Gender */}
          <div className="w-full flex flex-col space-y-1">
            <label className="font-semibold text-pink-600">Giới tính</label>
            <div className="flex gap-10 mt-2">
              <label className="flex items-center font-semibold text-pink-600">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={form.gender === "MALE"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-500 bg-white w-5 h-5"
                />
                Nam
              </label>
              <label className="flex items-center font-semibold text-pink-600">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={form.gender === "FEMALE"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-500 bg-white w-5 h-5"
                />
                Nữ
              </label>
            </div>
          </div>

          {/* Diagnosed as dyslexic */}
          <div className="w-full flex flex-col space-y-1">
            <label className="font-semibold text-pink-600">
              Bạn đã từng được chẩn đoán là khó đọc chưa?
            </label>
            <div className="flex gap-6 mt-2 flex-wrap">
              <label className="flex items-center font-semibold text-pink-600">
                <input
                  type="radio"
                  name="rl_dyslexia"
                  value="yes"
                  checked={form.rl_dyslexia === "yes"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-500 bg-white w-5 h-5"
                />
                Có
              </label>
              <label className="flex items-center font-semibold text-pink-600">
                <input
                  type="radio"
                  name="rl_dyslexia"
                  value="no"
                  checked={form.rl_dyslexia === "no"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-500 bg-white w-5 h-5"
                />
                Không
              </label>
              <label className="flex items-center font-semibold text-pink-600">
                <input
                  type="radio"
                  name="rl_dyslexia"
                  value="unknown"
                  checked={form.rl_dyslexia === "unknown"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-500 bg-white w-5 h-5"
                />
                Chưa từng kiểm tra / Không rõ
              </label>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="bg-pink-500 py-2.5 px-8 rounded-lg text-white font-semibold hover:bg-pink-600 transition focus:ring-2 focus:ring-pink-200 text-lg"
        >
          Xác nhận thông tin
        </button>
      </form>
    </div>
  );
};

export default HumanFeaturesForm;
