import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyEmail } from "../api/authApi";

const VerifyEmail = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const res = await verifyEmail(token);
      console.log(res);
      toast.success(res?.message || "Check your email to verify!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? <h2>Verifying your email...</h2> : <h2>Please login.</h2>}
    </div>
  );
};

export default VerifyEmail;
