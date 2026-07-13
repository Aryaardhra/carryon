import { useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../../assets/data/assets";
import { useAuthContext } from "../../context/AuthContext";
import { updateProfile } from "../../api/profileApi";
import InputField from "../form/InputField";

const ProfileCard = () => {

  const { user, refreshProfile } = useAuthContext();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || assets.profile_img);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const data = await updateProfile(formData);
      await refreshProfile();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl outline-1 outline-primary p-8">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center">
          <img src={preview} className="w-36 h-36 rounded-full object-cover" />

          <label className="mt-5">
            <input hidden type="file" accept="image/*" onChange={handleImage} />

            <span className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md">
              Change Photo
            </span>
          </label>
        </div>

        <div className="flex-1 space-y-5">
          <div>
            <InputField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded"
            />
          </div>

          <div>
            <InputField
              label="Email"
              readOnly
              value={user?.email || ""}
              className="w-full mt-1 p-3 rounded bg-gray-200"
            />
          </div>

          <div>
            <InputField
              label="Role"
              readOnly
              value={user?.role || ""}
              className="w-full mt-1 p-3 rounded bg-gray-200"
            />
          </div>

          <button
            disabled={loading}
            onClick={handleUpdateProfile}
            className="bg-primary text-white px-8 py-3 rounded-md"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
