import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
export default function ForgetPassword() {
  const [data, setData] = useState({
    forgetEmail: "",
    forgetPassword: "",
    forgetUsername: "",
  });

  const authcontext = useContext(AuthContext);
  const { forgetPassword, isServer,showAlert } = authcontext;
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  
  };
  const handlerSubmit = (e) => {
    e.preventDefault();

   if( data.forgetEmail.length<8){
   showAlert("Warning","Email should be of length 8")
   }
   else if(data.forgetPassword.length<8){
       showAlert("Warning","Password should be of length 8")
   }
   else if( data.forgetUsername.length<8){
   showAlert("Warning","Username should be of length 8")
   }
 else{
  forgetPassword(data.forgetEmail,data.forgetPassword,data.forgetUsername)
    setData({
    forgetEmail: "",
    forgetPassword: "",
    forgetUsername: "",
  });
    }
  };
 return isServer === 500 ? (
  <NoServer />
) : (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100  px-4">

    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <img
          loading="lazy"
          src="https://res.cloudinary.com/do2twyxai/image/upload/v1773486472/ChatGPT_Image_Mar_14_2026_04_35_32_PM_owgv9l.png"
          alt="logo"
          className="w-10 h-10 rounded-full"
        />
        <h1 className="text-2xl font-semibold text-gray-800">ChatNova</h1>
      </div>

      <p className="text-center text-gray-500 mb-6">
        Reset your password 🔐
      </p>

      <form onSubmit={handlerSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">

            <EnvelopeIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="email"
              name="forgetEmail"
              placeholder="Enter your email"
              value={data.forgetEmail}
              onChange={onChange}
              className="w-full h-11 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-sm text-gray-600">Username</label>
          <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">

            <UserIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="text"
              name="forgetUsername"
              placeholder="Enter your username"
              value={data.forgetUsername}
              onChange={onChange}
              className="w-full h-11 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm text-gray-600">New Password</label>
          <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">

            <LockClosedIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="password"
              name="forgetPassword"
              placeholder="Enter new password"
              value={data.forgetPassword}
              onChange={onChange}
              className="w-full h-11 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full h-11 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200"
        >
          Reset Password
        </button>

      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>

    </div>
  </div>
);
}
