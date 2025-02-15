/* eslint-disable react/prop-types */
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
    <div className="space-y-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Business Information</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="space-y-8">
        <div>
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            {...register("businessName", { required: true })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          {errors.businessName && <p className="mt-1 text-sm text-red-500">Business Name is required</p>}
        </div>

        <div>
          <label htmlFor="businessType">Business Category</label>
          <select
            {...register("businessType", { required: true })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Your Business Category</option>
            <option value="SaaS">SaaS</option>
            <option value="Retail">Retail</option>
            <option value="Agency">Agency</option>
          </select>
          {errors.businessType && <p className="mt-1 text-sm text-red-500">Business Type is required</p>}
        </div>

        <div>
          <label htmlFor="businessWebsite">Business Website</label>
          <input
            type="url"
            {...register("businessWebsite", {
              required: "Business Website is required",
              pattern: {
                value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
                message: "Enter a valid website URL (e.g., https://example.com)",
              },
            })}
            className={`mt-2 w-full rounded-lg border p-3 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 
            ${errors.businessWebsite ? "border-red-500" : "border-gray-200"}`}
          />

          {/* Error Messages */}
          {errors.businessWebsite && <p className="mt-1 text-sm text-red-500">{errors.businessWebsite.message}</p>}
        </div>

        <div>
          <label htmlFor="businessEmail">Business Email</label>
          <input
            type="email"
            {...register("businessEmail", {
              required: "Business Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />

          {/* Error Messages */}
          {errors.businessEmail && <p className="mt-1 text-sm text-red-500">{errors.businessEmail.message}</p>}
        </div>
      </div>

      {errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}

      <div className="flex justify-between space-x-4 pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 rounded-lg bg-gray-100 px-6 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-white transition-all duration-300 hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
