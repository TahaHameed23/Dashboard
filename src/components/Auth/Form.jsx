/* eslint-disable react/prop-types */
import { ID } from "appwrite";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/appwrite.config";
import StepOne from "./Steps/StepOne";
import StepTwo from "./Steps/StepTwo";
import StepThree from "./Steps/StepThree";
import EmailVerification from "./EmailVerification";

const Form = ({ setUser, user }) => {
  const methods = useForm({ mode: "onChange" });
  const {
    handleSubmit,
    getValues,
    trigger,
    register,
    formState: { errors },
  } = methods;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async () => {
    setLoading(true);
    try {
      const { Password, ...formData } = getValues();
      await db.createDocument("67ab536000182ce07dca", "67ab536a0005445dda28", ID.unique(), formData).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <FormProvider {...methods}>
      <div className="border-1 mx-auto my-24 h-full w-full max-w-2xl rounded-2xl border-blue-100 p-4 shadow-md shadow-blue-200 transition-all duration-300 md:p-8">
        <div>
          {/* Progress Bar */}
          <div className="mb-6 md:mb-8">
            <div className="mb-2 flex justify-between">
              {["Personal Info", "Verification", "Business", "Address"].map((label, index) => (
                <div key={index} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 md:h-10 md:w-10 
              ${step === index + 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors duration-300 md:text-sm 
              ${step === index + 1 ? "text-indigo-600" : "text-gray-400"}`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 rounded-full bg-gray-100">
              <div
                className="h-1 rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <StepOne
                setUser={setUser}
                nextStep={nextStep}
                trigger={trigger}
                register={register}
                errors={errors}
                getValues={getValues}
              />
            )}
            {step === 2 && (
              <EmailVerification
                setVerified={setVerified}
                verified={verified}
                getValues={getValues}
                setUser={setUser}
                user={user}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}
            {step === 3 && (
              <StepTwo nextStep={nextStep} prevStep={prevStep} register={register} errors={errors} trigger={trigger} />
            )}
            {step === 4 && (
              <StepThree
                prevStep={prevStep}
                register={register}
                errors={errors}
                trigger={trigger}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </form>

          {step === 1 && (
            <div className="mt-6 flex flex-col justify-center text-center md:flex-row">
              <p>Already have an account?</p>
              <button
                type="button"
                className="mx-2 cursor-pointer text-blue-700 underline hover:text-blue-500"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default Form;
