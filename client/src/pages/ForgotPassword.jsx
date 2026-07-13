import { useState } from "react";
import { forgotPassword } from "../api/authApi";
import { toast } from "react-hot-toast";
import { assets } from "../assets/data/assets";
import BackgroundVideo from "../components/BackgroundVideo";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/form/InputField";
import SwitchLink from "../components/form/SwitchLink";
import Button from "../components/form/Button";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);
      const { data } = await forgotPassword(email);
      toast.success(data.message);
      setEmail("");
      setEmailSent(true);
    }
     catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Forgot Password"
        subtitle="Enter your registered email."
      >
        <form
          onSubmit={submitHandler}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-4"
        >
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Button loading={loading} loadingText="Sending...">
            Send Reset Link
          </Button>

          {emailSent && (
            <p className="text-center text-green-700 text-xs">
              If an account exists with this email, we've sent a password reset
              link.
            </p>
          )}

          <SwitchLink
            text="Remember your password?"
            linkText="Login"
            to="/login"
          />
        </form>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
