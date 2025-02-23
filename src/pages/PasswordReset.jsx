import { useState, useEffect } from "react";
import Header from "../components/Header";
import { ResetPassword, UpdatePassword } from "../features/auth/components/PasswordResetComponent"

export default function PasswordReset() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("userId") && queryParams.get("secret")) {
      setStep(2);
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex h-screen flex-col justify-center md:flex-row">
        {/* Left Side - Form */}
        <div className="flex w-full flex-col items-center justify-center p-8 md:w-3/5">
          {step === 1 && (
            <ResetPassword
              loading={loading}
              setLoading={setLoading}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          )}
          {step === 2 && (
            <UpdatePassword
              loading={loading}
              setLoading={setLoading}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          )}
        </div>
        {/* Right Side - Image */}
        <div className="hidden items-center justify-center bg-gray-100 md:flex md:w-2/5">
          <img
            src="https://res.cloudinary.com/dlsujv3gk/image/upload/v1739469716/blue-abstract-background_1123-51_dlrqkc.avif"
            alt="Reset Password Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
