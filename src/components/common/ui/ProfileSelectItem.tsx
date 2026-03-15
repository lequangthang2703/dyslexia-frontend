import type { Profile } from "../../../contexts/AuthProvider";

interface ProfileSelectItemProps {
  profile: Profile;
  onSelect: () => void;
}

const ProfileSelectItem = ({ profile, onSelect }: ProfileSelectItemProps) => {
  return (
    <div className="w-full flex justify-center">
      <button
        onClick={onSelect}
        className="
          w-full md:w-80
          bg-white
          p-6
          rounded-lg
          shadow-md
          border-3 border-pink-400
          hover:border-yellow-400
          hover:bg-yellow-50
          transition-all
          flex flex-col items-center
        "
      >
        {/* Profile Name */}
        <div className="mb-3 text-center">
          <span className="text-2xl font-bold text-pink-500">
            {profile.name || "Default"}
          </span>
        </div>
        {/* Profile Type Pill/Tag */}
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold
            ${
              profile.profile_type === "PARENT"
                ? "bg-pink-100 text-pink-700 border border-pink-400"
                : "bg-yellow-100 text-yellow-700 border border-yellow-400"
            }
          `}
        >
          {profile.profile_type === "PARENT" ? "PHỤ HUYNH" : "TRẺ EM"}
        </span>
      </button>
    </div>
  );
};

export default ProfileSelectItem;