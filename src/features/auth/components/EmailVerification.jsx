/* eslint-disable react/prop-types */
import { account } from "../../../services/appwrite.config";
import { ID } from "appwrite";
import { useState, useEffect } from "react";
import { sendNewClientData } from "../lib/auth";

const EmailVerification = ({ getValues, setUser, user, prevStep, nextStep }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [OTP, setOTP] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    setVerified(false); // Reset verification when email changes
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    if (user !== null) {
      setVerified(true);
    } else {
      sendOTP();
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const sendOTP = async () => {
    try {
      const new_acc = await account.create(
        ID.unique(),
        getValues("email"),
        getValues("Password"),
        getValues("fullName"),
      );
      const token = await account.createEmailToken(new_acc.$id, getValues("email"));
      if (token.code===429){
        setOtpError("Too many requests. Please try again later.");
        return;
      }
      setToken(token);
      setIsResendDisabled(true);
      setTimer(60);

      // Start new countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("OTP sending failed:", error);
    }
  };

  const handleOTPChange = (e, index) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    let newOTP = [...OTP];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      setOTP(pasteData.split(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let newOTP = [...OTP];
      newOTP[index] = "";
      setOTP(newOTP);

      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  const verifyOTP = async () => {
    if (OTP.some((digit) => digit.trim() === "")) {
      setOtpError("Please enter all 6 digits of the OTP.");
      return;
    }
    setOtpError("");
    try {
      setLoading(true);
      await account.createSession(token.userId, OTP.join(""));
      const session = await account.get().then(async(session)=>await sendNewClientData(session));
      setUser(session);
      setVerified(true);
      setLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 px-6">
      {verified ? (
        <h2 className="text-center text-2xl font-semibold">Email verified</h2>
      ) : (
        <h2 className="text-center text-2xl font-semibold">Enter OTP sent to your email</h2>
      )}

      <div className="my-12 flex space-x-2 sm:space-x-4" onPaste={handlePaste}>
        {OTP.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            disabled={verified}
            className="h-12 w-12 rounded-lg border-2 border-gray-300 text-center text-xl font-semibold transition-all focus:border-0 focus:outline-none focus:ring-4 focus:ring-blue-500 sm:h-16 sm:w-16 sm:text-2xl"
            value={digit}
            onChange={(e) => handleOTPChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      {otpError && <p className="text-red-500">{otpError}</p>}

      <>
        {!verified && (
          <div className="my-5 flex flex-col items-center text-lg text-gray-600">
            Didn&apos;t receive OTP? <br />
            {isResendDisabled ? (
              <p className="text-md flex flex-col items-center font-light text-gray-600">Resend in {timer}s</p>
            ) : (
              <button onClick={sendOTP} className="text-blue-600 underline hover:cursor-pointer hover:text-blue-700">
                Resend OTP
              </button>
            )}
          </div>
        )}
      </>

      <div className="mt-8 flex w-full flex-row items-center gap-x-3 pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="w-full max-w-xs rounded-lg bg-gray-300 py-3 text-lg font-semibold transition-all hover:bg-gray-400"
        >
          Back
        </button>

        {!verified ? (
          <button
            type="button"
            className="w-full max-w-xs rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition-all hover:bg-blue-700"
            onClick={verifyOTP}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        ) : (
          <button
            type="button"
            className="w-full max-w-xs rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition-all hover:bg-blue-700"
            disabled={!verified}
            onClick={nextStep}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
