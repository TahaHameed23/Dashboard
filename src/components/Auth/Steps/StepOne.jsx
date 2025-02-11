import {  useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const StepOne = ({ setUser, nextStep, register, errors, trigger, getValues }) => {
  const [errorMessage, setErrorMessage] = useState("");



  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      const res = await fetch(`${API_URL}/auth/check?email=${getValues("email")}`);
      if(res.status===409) {
        setErrorMessage("User with this email already exists");
        return
      }
      nextStep();
    } else {
      setErrorMessage("Please fill in all required fields correctly.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Fill in your personal details</p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register("fullName", { required: true })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">Name is required</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            onChange={() => {setUser(null)}}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {errors.email && (
            <p className="mt-1 text-md text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("Password", {
              minLength: 8,
              maxLength: 20,
              required: true,
            })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {errors.Password && errors.Password.type === "minLength" && (
            <p className="mt-1 text-sm text-red-500">
              Password must be at least 8 characters long
            </p>
          )}
          {errors.Password && errors.Password.type === "maxLength" && (
            <p className="mt-1 text-sm text-red-500">
              Password cannot be more than 20 characters
            </p>
          )}
          {errors.Password && errors.Password.type === "required" && (
            <p className="mt-1 text-sm text-red-500">
              Password is required
            </p>    
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
      )}

      <div className="pt-6">
        <button
          type="button"
          onClick={handleNext}
          className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-700 ${
            errors.email ? "mt-0" : "-mt-2"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepOne;
