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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Business Address</h2>
        <p className="text-gray-600">Where is your business located?</p>
      </div>

      <div className="space-y-4">
        <div>
          <input 
            type="text" 
            placeholder="Country" 
            {...register("country", { required: true })} 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-500">Country is required</p>
          )}
        </div>

        <div>
          <input 
            type="text" 
            placeholder="City" 
            {...register("city", { required: true })} 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">City is required</p>
          )}
        </div>

        <div>
          <input 
            type="text" 
            placeholder="Address" 
            {...register("address", { required: true })} 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">Address is required</p>
          )}
        </div>

        <div>
          <input 
            type="text" 
            placeholder="Zip Code" 
            {...register("zipCode", { required: true })} 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-500">Zip Code is required</p>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
      )}

      <div className="flex justify-between space-x-4 pt-6">
        <button
          type="button"
          disabled={loading}
          onClick={prevStep}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
          {loading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default StepThree;