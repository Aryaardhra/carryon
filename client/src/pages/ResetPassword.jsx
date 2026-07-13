import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { toast } from "react-hot-toast";

import BackgroundVideo from "../components/BackgroundVideo";
import { assets } from "../assets/data/assets";
import AuthLayout from "../layouts/AuthLayout";
import SwitchLink from "../components/form/SwitchLink";
import Button from "../components/form/Button";
import InputField from "../components/form/InputField";
import PasswordField from "../components/form/PasswordField";

const ResetPassword = () => {

  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);
      const { data } = await resetPassword(token, {
        password,
        confirmPassword,
      });
      toast.success(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Reset Password"
        subtitle="Enter your new password below."
      >
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <PasswordField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <PasswordField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />

          <Button loading={loading} loadingText="Resetting...">
            Reset Password
          </Button>

          <SwitchLink text="Back to" linkText="Login" to="/login" />
        </form>
      </AuthLayout>
    </>
  );
};

export default ResetPassword;
