import React, { useEffect, useState } from "react";
import { assets } from "../assets/data/assets";
import BackgroundVideo from "../components/BackgroundVideo";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/form/InputField";
import Button from "../components/form/Button";

const Login = () => {

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (state === "login") {
        await login({ email, password });
        navigate("/", { replace: true });
      } else {
        const response = await register({ name, email, password });

        setVerificationMessage(response.message);
        // toast.success(res.data.message|| "Please check your email to verify!");
        setState("login");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthLayout title={state === "login" ? "User Login" : "Create Account"}>
        <form
          onSubmit={onSubmitHandler}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-4 "
        >
          {state === "register" && (
            <InputField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          )}
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <InputField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <div className="w-full flex justify-between">
            {state === "register" ? (
              <p className="text-gray-300 text-xs">
                Already have account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-gray-300 cursor-pointer"
                >
                  click here
                </span>
              </p>
            ) : (
              <p className="text-gray-300 text-xs">
                Create an account?{" "}
                <span
                  onClick={() => setState("register")}
                  className="text-gray-300 cursor-pointer"
                >
                  click here
                </span>
              </p>
            )}
            <span
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-secondary hover:underline"
            >
              Forgot Password?
            </span>
          </div>
          <Button loading={submitting} loadingText="Please wait...">
            {state === "login" ? "Login" : "Create Account"}
          </Button>
          {verificationMessage && (
            <p className="w-full mt-3 text-center text-md text-gray-900">
              {verificationMessage}
            </p>
          )}
        </form>
      </AuthLayout>
    </>
  );
};

export default Login;
