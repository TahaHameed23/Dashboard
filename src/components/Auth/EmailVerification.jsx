import {account} from "../../services/appwrite.config";
import { ID } from "appwrite";
import { useState, useEffect } from "react";

const EmailVerification = ({ getValues, setUser, user, prevStep, nextStep }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [OTP, setOTP] = useState(Array(6).fill(""));
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    setVerified(false); // Reset verification when email changes
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    if (user!==null) {
      setVerified(true);
    }
    else {
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
      const new_acc = await account.create(ID.unique(), getValues("email"), getValues("Password"), getValues("fullName"));  
      const token = await account.createEmailToken(new_acc.$id, getValues("email"));
      setToken(token);
      alert("OTP sent to your email");
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
    try {
      setLoading(true);
      const session = await account.createSession(token.userId, OTP.join(""));
      setUser(session);
      setVerified(true);
      setLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-8 px-6">
      {
        verified
         ?
        <h2 className="text-2xl font-semibold text-center">Email verified</h2>
        :
        <h2 className="text-2xl font-semibold text-center">Enter OTP sent to your email</h2>
      }

      <div className="flex space-x-2 sm:space-x-4 my-12" onPaste={handlePaste}>
        {OTP.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            disabled={verified}
            className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-300 rounded-lg text-center text-xl sm:text-2xl font-semibold focus:border-0 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all"
            value={digit}
            onChange={(e) => handleOTPChange(e, index)}
            onKeyDown={(e) => handleKeyDown (e, index)}
          />
        ))}
      </div>

    <>
      {!verified && <p className="text-lg text-gray-600 flex flex-col items-center my-5">
        Didn&apos;t receive OTP? <br />
        {isResendDisabled ? (
          <p className="text-md font-light text-gray-600 flex flex-col items-center">
            Resend in {timer}s
          </p>
        ) : (
          <button onClick={sendOTP} className="text-blue-600 underline hover:text-blue-700 hover:cursor-pointer">
            Resend OTP
          </button>
        )}
      </p>}
    </>

      <div className="w-full flex flex-row gap-x-3 mt-8 items-center pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="w-full max-w-xs py-3 text-lg font-semibold bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
        >
          Back
        </button>

        {!verified ? (
          <button
            type="button"
            className="w-full max-w-xs py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            onClick={verifyOTP}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        ) : (
          <button
            type="button"
            className="w-full max-w-xs py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
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
