import { ID } from "appwrite";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { db } from "../services/appwrite.config";
import StepOne from "./Auth/Steps/StepOne";
import StepTwo from "./Auth/Steps/StepTwo";
import StepThree from "./Auth/Steps/StepThree";
import EmailVerification from "./Auth/EmailVerification";

const Form = ({ setUser, user }) => {
  const methods = useForm({ mode: "onChange" });
  const { handleSubmit, getValues, trigger, register, formState: { errors } } = methods;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        fullName: getValues("fullName"),
        email: getValues("email"),
        businessName: getValues("businessName"),
        businessType: getValues("businessType"),
        businessEmail: getValues("businessEmail"),
        businessWebsite: getValues("businessWebsite"),
        address: getValues("address"),
        city: getValues("city"),
        zip: getValues("zipCode"),
        country: getValues("country"),
      }  
      await db.createDocument("67ab536000182ce07dca", "67ab536a0005445dda28", ID.unique(), data).then(()=>{
        navigate("/");
      })      
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
      <div className="h-full w-full max-w-2xl mx-auto my-2 shadow-xl rounded-2xl transition-all duration-300 p-4 md:p-8">
  <div>
    {/* Progress Bar */}
    <div className="mb-6 md:mb-8">
      <div className="flex justify-between mb-2">
        {["Personal Info", "Verification", "Business", "Address"].map((label, index) => (
          <div key={index} className="flex flex-col items-center flex-1 text-center">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 
              ${step === index + 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
              {index + 1}
            </div>
            <span className={`text-xs md:text-sm font-medium transition-colors duration-300 
              ${step === index + 1 ? "text-indigo-600" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-1 bg-gray-100 rounded-full">
        <div 
          className="h-1 bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
      </div>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {step === 1 && <StepOne setUser={setUser} nextStep={nextStep} trigger={trigger} register={register} errors={errors} getValues={getValues} />}
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
      {step === 3 && <StepTwo nextStep={nextStep} prevStep={prevStep} register={register} errors={errors} trigger={trigger} />}
      {step === 4 && <StepThree prevStep={prevStep} register={register} errors={errors} trigger={trigger} handleSubmit={handleSubmit} loading={loading}/>}
    </form>

    {step === 1 && (
      <div className="flex flex-col md:flex-row justify-center mt-6 text-center">
        <p>Already have an account?</p>
        <button type="button" className="mx-2 underline text-blue-700 hover:text-blue-500" onClick={() => navigate("/login")}>
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