import BackgroundVideo from "../components/BackgroundVideo";
import { assets } from "../assets/data/assets";

import ProfileCard from "../components/profile/ProfileCard";
import ChangePasswordCard from "../components/profile/ChangePasswordCard";
import DeleteAccountCard from "../components/profile/DeleteAccountCard";

const Profile = () => {
  return (
    <div className="relative min-h-screen mt-8">
      <BackgroundVideo videoUrl={assets.bg_login} />

      <div className="relative z-20 flex justify-center py-16">
        <div className="w-full max-w-3xl space-y-8">
          <h1 className="text-3xl text-center font-semibold text-secondary">
            My Profile
          </h1>

          <ProfileCard />

          <ChangePasswordCard />

          <DeleteAccountCard />
        </div>
      </div>
    </div>
  );
};

export default Profile;
