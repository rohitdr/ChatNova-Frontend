import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { useContext, useState } from "react";
import { useForgetPassword } from "../hooks/useForgetPassword";
import { emailRegex, validateForgetPassword } from "../schemas/forgetpassword.schema";
import { FaSpinner } from "react-icons/fa";
import AuthContext from "../../../Context/AuthContext";

export default function ForgetPasswordForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
const forgetPassword=useForgetPassword()
  const { showAlert } =
    useContext(AuthContext);

  const handlerChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const isFormValid =
    emailRegex.test(formData.email.trim()) &&
    formData.password.length >= 8 &&
    formData.username.trim().length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForgetPassword(formData);

    if (error) {
      showAlert("Warning", error);
      return;
    }
     await forgetPassword.mutateAsync({
        email: formData.email.trim(),
      password:formData.password,
      username:formData.username.trim()
     })

    setFormData({
      username: "",
      password: "",
      email: "",
    });
  };

  return  (
  

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
            disabled={!isFormValid || forgetPassword.isPending}
            className="w-full h-11 rounded-lg font-medium bg-indigo-600 flex items-center justify-center   text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
           {forgetPassword.isPending ?<FaSpinner className=" animate-spin text-white"></FaSpinner>: "Reset Password"}
          </button>
        </form>

    
  );
}