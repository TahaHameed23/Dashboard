/* eslint-disable react/prop-types */
import { useState } from "react";
import { get } from "../../../../lib/fetch";

const StepOne = ({ setUser, nextStep, register, errors, trigger, getValues }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setLoading(true);
      const res = await get("/auth/client/check", { email: getValues("email") });
      if (res.status === 409) {
        setLoading(false);
        return setErrorMessage("User with this email already exists");
      }
      nextStep();
    } else {
      setErrorMessage("Please fill in all required fields correctly.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Personal Information</h2>
        <p className="text-gray-600">Fill in your personal details</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName">Preferred name</label>
          <input
            type="text"
            {...register("fullName", { required: true })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-500">Name is required</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            onChange={() => {
              setUser(null);
            }}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && <p className="text-md mt-1 text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("Password", {
              minLength: 8,
              maxLength: 20,
              required: true,
            })}
            className="mt-2 w-full rounded-lg border border-gray-200 p-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          {errors.Password && errors.Password.type === "minLength" && (
            <p className="mt-1 text-sm text-red-500">Password must be at least 8 characters long</p>
          )}
          {errors.Password && errors.Password.type === "maxLength" && (
            <p className="mt-1 text-sm text-red-500">Password cannot be more than 20 characters</p>
          )}
          {errors.Password && errors.Password.type === "required" && (
            <p className="mt-1 text-sm text-red-500">Password is required</p>
          )}
        </div>
      </div>

      {errorMessage && <p className="text-md text-center text-red-500">{errorMessage}</p>}

      <div className="pt-6">
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className={`w-full px-6 py-3 ${loading ? "cursor-not-allowed bg-indigo-300" : "cursor-pointer bg-indigo-600"} rounded-lg text-white ${loading ? "" : "hover:bg-indigo-700"} transition-all duration-700 ${
            errors.email ? "mt-0" : "-mt-2"
          }`}
        >
          {loading ? "Proceeding..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default StepOne;
