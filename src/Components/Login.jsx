import {
  EnvelopeIcon,
  LockClosedIcon,

} from "@heroicons/react/24/outline";

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NoServer from "./NoServer";
import AuthContext from "../Context/AuthContext";

export default function Login() {
const navigate = useNavigate()

  const { login, isServerDown ,showAlert,Me} =  useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
 const onChangeHandler = ({target:{name,value}}) => {


  setFormData(prev=>({...prev,[name]:value}));

};
  const emailRegex = /^\S+@\S+\.\S+$/;
 const validate = () => {
  if(!formData.email.trim()){
  return "Email cannot be empty";
}

  if (!emailRegex.test(formData.email.trim())) {
    return "Invalid email format";
  }
  if (!formData.password) {
  return "Password cannot be empty";
}
  if (formData.password.length < 8) {
    return "Password must be at least 8 characters";
  }
 
  return null;
};
const isFormValid=emailRegex.test(formData.email.trim()) && formData.password.length>=8 

  const handleSubmit =  (e) => {
    e.preventDefault();
   const error = validate()
   if(error){
    showAlert("Warning",error)
    return
   }
  
      login(formData.email.trim(), formData.password);
  
    
   
  };
return isServerDown  ? (
  <NoServer />
) : (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
    
    <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8">
      
      {/* Logo */}
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">
        ChatNova
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Welcome back 👋
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">


        <div>
          <label className="text-sm text-gray-600" htmlFor="login-email">Email</label>
          <div className={`flex items-center mt-1 rounded-lg border 
          border-gray-300
            focus-within:ring-2 focus-within:ring-indigo-400`}>

            <EnvelopeIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="email"
              id="login-email"
              required
              autoComplete="email"
              name="email"
              aria-label="email"
              placeholder="Enter your email"
              onChange={onChangeHandler}
              value={formData.email}
              className="w-full h-11 outline-none bg-transparent"
            />

           
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <label className="text-sm text-gray-600" htmlFor="login-password">Password</label>
            <Link to="/forgetpassword" className="text-sm text-indigo-500 hover:underline">
              Forgot?
            </Link>
          </div>

          <div className={`flex items-center mt-1 rounded-lg border 
           border-gray-300
            focus-within:ring-2 focus-within:ring-indigo-400`}>

            <LockClosedIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              id="login-password"
              aria-label="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={onChangeHandler}
              className="w-full h-11 outline-none bg-transparent"
            />

           
          </div>
        </div>

        <button
        disabled={!isFormValid}
          type="submit"
          className="w-full h-11 rounded-lg font-medium transition-all duration-200 
         
            bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:active:scale-100"
        >
          Sign in
        </button>

      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don’t have an account?{" "}
        <Link to="/SignUp" className="text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>

    </div>
  </div>
);
}
