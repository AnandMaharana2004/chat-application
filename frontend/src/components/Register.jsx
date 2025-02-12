import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAxiosCall } from "../hooks/useAxiosCall";
import { register } from "../api/authApi";

function Register() {
  const { loading, error, fetchData } = useAxiosCall();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !user.email ||
      !user.password ||
      !user.confirmPassword ||
      !user.gender ||
      !user.username
    ) {
      return toast.error("All fields are require !!");
    }
    if (user.password !== user.confirmPassword)
      return toast.error("Password and ConformPassword should be same");

    const data = await fetchData(() => register(user));
    setUser({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
    if (data) {
      console.log("register data is : ", data);
      toast.success(data?.message || "Create account successfully !!");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen px-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
        Welcome to Chat More
      </h1>
      <form
        className="flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6 w-full max-w-sm md:max-w-md"
        onSubmit={handleSubmit}
      >
        <label className="flex items-center gap-2 border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-5 w-5 text-gray-500"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="email"
            className="flex-1 bg-transparent outline-none placeholder-gray-400 text-gray-700"
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            value={user.email}
          />
        </label>

        <label className="flex items-center gap-2 border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-5 w-5 text-gray-500"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="flex-1 bg-transparent outline-none placeholder-gray-400 text-gray-700"
            placeholder="Username"
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            value={user.username}
          />
        </label>

        <label className="flex items-center gap-2 border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-5 w-5 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="flex-1 bg-transparent outline-none placeholder-gray-400 text-gray-700"
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
          />
        </label>

        <label className="flex items-center gap-2 border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-5 w-5 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="flex-1 bg-transparent outline-none placeholder-gray-400 text-gray-700"
            placeholder="ConformPassword"
            onChange={(e) =>
              setUser({ ...user, confirmPassword: e.target.value })
            }
            value={user.confirmPassword}
          />
        </label>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 bg-white">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={user.gender === "male"}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            />
            Male
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={user.gender === "female"}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            />
            Female
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="other"
              checked={user.gender === "other"}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            />
            Other
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Submit"}
          {/* disabled={loading} */}
        </button>
        {error && <p className="text-red-500">{error?.message}</p>}
      </form>

      {/* Login Link */}
      <Link
        to={"/login"}
        className="text-sm text-blue-500 hover:underline hover:text-blue-700"
      >
        Already have an account? Log in
      </Link>
    </div>
  );
}

export default Register;
