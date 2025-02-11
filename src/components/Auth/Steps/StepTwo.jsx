import { useState } from "react";

const StepTwo = ({ nextStep, prevStep, register, errors, trigger }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      nextStep();
    } else {
      setErrorMessage("Please fill in all required fields correctly.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Business Information</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Business Name"
            {...register("businessName", { required: true })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-500">Business Name is required</p>
          )}
        </div>

        <div>
          <select 
            {...register("businessType", { required: true })} 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select Business Type</option>
            <option value="SaaS">SaaS</option>
            <option value="Retail">Retail</option>
            <option value="Agency">Agency</option>
          </select>
          {errors.businessType && (
            <p className="mt-1 text-sm text-red-500">Business Type is required</p>
          )}
        </div>

        <div>
        <input 
          type="url" 
          placeholder="Business Website" 
          {...register("businessWebsite", { 
            required: "Business Website is required", 
            pattern: { 
              value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/, 
              message: "Enter a valid website URL (e.g., https://example.com)" 
            } 
          })}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-300 
            ${errors.businessWebsite ? "border-red-500" : "border-gray-200"}`}
        />

        {/* Error Messages */}
        {errors.businessWebsite && (
          <p className="mt-1 text-sm text-red-500">{errors.businessWebsite.message}</p>
        )}
        </div>

        <div>
        <input
          type="email"
          placeholder="Business Email"
          {...register("businessEmail", { 
            required: "Business Email is required", 
            pattern: { 
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
              message: "Enter a valid email address" 
            } 
          })}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        />

        {/* Error Messages */}
        {errors.businessEmail && (
          <p className="mt-1 text-sm text-red-500">{errors.businessEmail.message}</p>
        )}

        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
      )}

      <div className="flex justify-between space-x-4 pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepTwo;