import { useState } from "react";
import toast from "react-hot-toast";
import { deleteAccount } from "../../api/profileApi";
import { triggerLogout } from "../../services/authServices.";
import InputField from "../form/InputField";

const DeleteAccountCard = () => {

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "This action cannot be undone.\n\nDelete your account?",
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const data = await deleteAccount(password);

      toast.success(data.message);

      triggerLogout();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl
        bg-red-100/20
        backdrop-blur-md
        border
        border-red-400/30
        shadow-xl
        p-8"
    >
      <h2 className="text-red-900 text-xl">Danger Zone</h2>

      <p className="mt-3 mb-5">Deleting your account is permanent.</p>

      <InputField
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded"
      />

      <button
        disabled={loading}
        onClick={handleDelete}
        className="mt-5
            bg-red-900
            hover:bg-red-950
            text-white
            px-6
            py-3
            rounded"
      >
        {loading ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
};

export default DeleteAccountCard;
