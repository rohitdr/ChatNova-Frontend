import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";

export default function ForgetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { forgetPassword, isServerDown, showAlert } =
    useContext(AuthContext);

  const handlerChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const emailRegex = /^\S+@\S+\.\S+$/;

  const validate = () => {
    if (
      !formData.email.trim() ||
      !formData.username.trim() ||
      !formData.password
    ) {
      return "Fields cannot be empty";
    }

    if (!emailRegex.test(formData.email.trim())) {
      return "Enter valid Email";
    }

    if (formData.password.length < 8) {
      return "Password should be of length 8";
    }

    if (formData.username.trim().length < 8) {
      return "Username should be of length 8";
    }

    return null;
  };

  const isFormValid =
    emailRegex.test(formData.email.trim()) &&
    formData.password.length >= 8 &&
    formData.username.trim().length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (error) {
      showAlert("Warning", error);
      return;
    }

    await forgetPassword(
      formData.email.trim(),
      formData.password,
      formData.username.trim()
    );

    setFormData({
      username: "",
      password: "",
      email: "",
    });
  };

  return isServerDown ? (
    <NoServer />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            loading="lazy"
            src="https://res.cloudinary.com/do2twyxai/image/upload/v1773486472/ChatGPT_Image_Mar_14_2026_04_35_32_PM_owgv9l.png"
            alt="logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-2xl font-semibold text-gray-800">
            ChatNova
          </h1>
        </div>

        <p className="text-center text-gray-500 mb-6">
          Enter your details to reset your password 🔐
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label
              className="text-sm text-gray-600"
              htmlFor="forget-email"
            >
              Email
            </label>

            <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">
              <EnvelopeIcon className="w-5 h-5 mx-3 text-gray-400" />

              <input
                type="email"
                autoComplete="email"
                name="email"
                id="forget-email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handlerChange}
                className="w-full h-11 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              className="text-sm text-gray-600"
              htmlFor="forget-username"
            >
              Username
            </label>

            <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">
              <UserIcon className="w-5 h-5 mx-3 text-gray-400" />

              <input
                type="text"
                id="forget-username"
                name="username"
                autoComplete="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handlerChange}
                className="w-full h-11 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="text-sm text-gray-600"
              htmlFor="forget-password"
            >
              New Password
            </label>

            <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">
              <LockClosedIcon className="w-5 h-5 mx-3 text-gray-400" />

              <input
                type="password"
                name="password"
                autoComplete="new-password"
                id="forget-password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handlerChange}
                className="w-full h-11 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-11 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Password
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?
          <Link
            to="/login"
            className="text-indigo-600 hover:underline"
          >
            {" "}Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}