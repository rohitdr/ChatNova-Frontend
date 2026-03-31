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
export default function SignUp() {
  const [data, setData] = useState({
    signUpEmail: "",
    signUpPassword: "",
    signUpUsername: "",
  });

  const authcontext = useContext(AuthContext);
  const { signUp, isServer,showAlert } = authcontext;
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  
  };
  const handlerSubmit = (e) => {
    e.preventDefault();

    if ( data.signUpEmail.length < 8 ) {
        showAlert("Warning","Email length should be more than 8")
    

    }
    else if(data.signUpPassword.length < 8){
  showAlert("Warning","Password length should be more than 8")
    }
    else if(data.signUpUsername.length < 8){
  showAlert("Warning","Username length should be more than 8")
    }
    else{
   signUp(data.signUpEmail, data.signUpPassword, data.signUpUsername);
    }
  };
return isServer === 500 ? (
  <NoServer />
) : (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100  px-4">
    
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
      
      {/* Logo */}
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">
        ChatNova
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Create your account 🚀
      </p>

      <form onSubmit={handlerSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">
            
            <EnvelopeIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="email"
              name="signUpEmail"
              placeholder="Enter your email"
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
              name="signUpUsername"
              placeholder="Choose a username"
              onChange={onChange}
              className="w-full h-11 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">
            
            <LockClosedIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="password"
              name="signUpPassword"
              placeholder="Create a password"
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
          Create Account
        </button>

      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>

    </div>
  </div>
);
}
