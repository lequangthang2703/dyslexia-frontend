import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProfileSelectItem from "../components/common/ui/ProfileSelectItem";
import type { Profile } from "../contexts/AuthProvider";

// Check if a profile has all required info filled
const isProfileComplete = (profile: Profile): boolean => {
  return !!(
    profile.name &&
    profile.year_of_birth &&
    profile.email &&
    profile.gender &&
    profile.mother_tongue &&
    profile.official_dyslexia_diagnosis
  );
};

const SelectProfile = () => {
  const navigate = useNavigate();
  const { user, selectProfile } = useAuth();
  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-gradient-pink rounded-2xl p-8 shadow-lg">
      <h1 className="text-3xl text-pink-600 font-bold mb-2">Chọn hồ sơ</h1>

      {user?.profiles && user.profiles.length > 0 ? (
        <>
          <h2 className="text-lg text-gray-700 mb-4">
            Vui lòng chọn một hồ sơ để tiếp tục.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full lg:max-w-4xl">
            {user.profiles.map((profile) => (
              <ProfileSelectItem
                key={profile.id}
                profile={profile}
                onSelect={async () => {
                  try {
                    await selectProfile(profile.id);
                    // Check if profile info is complete
                    if (isProfileComplete(profile)) {
                      // Profile info complete, go directly to auditory test
                      navigate("/");
                    } else {
                      // Profile info incomplete, go to human features form
                      navigate("/human");
                    }
                  } catch (error) {
                    console.error("Profile selection error:", error);
                    alert("Chọn hồ sơ thất bại. Vui lòng thử lại.");
                  }
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600">
          Không tìm thấy hồ sơ. Vui lòng tạo hồ sơ trước.
        </p>
      )}
    </div>
  );
};

export default SelectProfile;
