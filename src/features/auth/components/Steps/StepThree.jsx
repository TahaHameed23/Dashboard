/* eslint-disable react/prop-types */
import { useState } from "react";

const StepThree = ({ prevStep, register, errors, trigger, loading }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = await trigger();
    if (!isValid) {
      setErrorMessage("Please fill in all required fields correctly.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Business Address</h2>
        <p className="text-gray-600">Where is your business located?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            {...register("country", { required: true })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          {errors.country && <p className="mt-1 text-sm text-red-500">Country is required</p>}
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            {...register("city", { required: true })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">City is required</p>}
        </div>

        <div>
          <label htmlFor="address">Adderss</label>
          <input
            type="text"
            {...register("address", { required: true })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          {errors.address && <p className="mt-1 text-sm text-red-500">Address is required</p>}
        </div>

        <div>
          <label htmlFor="zip">Zip Code</label>
          <input
            type="text"
            {...register("zipCode", { required: true })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          {errors.zipCode && <p className="mt-1 text-sm text-red-500">Zip Code is required</p>}
        </div>
      </div>

      {errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}

      <div className="flex justify-between space-x-4 pt-6">
        <button
          type="button"
          disabled={loading}
          onClick={prevStep}
          className="flex-1 rounded-lg bg-gray-100 px-6 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-white transition-all duration-300 hover:bg-indigo-700"
        >
          {loading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default StepThree;
