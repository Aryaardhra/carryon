import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../api/profileApi";
import { triggerLogout } from "../../services/authServices.";
import PasswordField from "../form/PasswordField";
import { useNavigate } from "react-router-dom";

const ChangePasswordCard = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const data = await changePassword({ currentPassword, newPassword, confirmPassword });

      toast.success(data.message);

      await triggerLogout();
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to change password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl outline-1 outline-primary p-8">
      <h2 className="text-xl mb-6">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <PasswordField
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <PasswordField
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="bg-primary
                text-white
                px-6
                py-3
                rounded-md"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordCard;
