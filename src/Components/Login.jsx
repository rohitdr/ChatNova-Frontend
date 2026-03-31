import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import NoServer from "./NoServer";
import AuthContext from "../Context/AuthContext";

export default function Login() {
  const context = useContext(AuthContext);

  const { login, isServer ,showAlert} = context;
  const [Emailerror, setEmailerror] = useState(false);
  const [passworderror, setPasswordError] = useState(false);
  const [data, setData] = useState({ loginEmail: "", loginPassword: "" });
 const onChangeHandler = (e) => {
  const { name, value } = e.target;

  const updatedData = { ...data, [name]: value };
  setData(updatedData);


  setEmailerror(updatedData.loginEmail.length < 5);
  setPasswordError(updatedData.loginPassword.length < 7);
};
  const submitHandler =  (e) => {
    e.preventDefault();
    if (!Emailerror && !passworderror) {
  
      login(data.loginEmail, data.loginPassword);
  
    }
    else{
      showAlert("Error","Enter the full Deatils and then submit")
    }
  };
return isServer === 500 ? (
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

      <form onSubmit={submitHandler} className="space-y-5">

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className={`flex items-center mt-1 rounded-lg border 
          border-gray-300
            focus-within:ring-2 focus-within:ring-indigo-400`}>

            <EnvelopeIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="email"
              name="loginEmail"
              placeholder="Enter your email"
              onChange={onChangeHandler}
              className="w-full h-11 outline-none bg-transparent"
            />

            {Emailerror && (
              <ExclamationCircleIcon className="w-5 h-5 mr-3 text-red-500" />
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between">
            <label className="text-sm text-gray-600">Password</label>
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
              name="loginPassword"
              placeholder="Enter your password"
              onChange={onChangeHandler}
              className="w-full h-11 outline-none bg-transparent"
            />

            {passworderror && (
              <ExclamationCircleIcon className="w-5 h-5 mr-3 text-red-500" />
            )}
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className={`w-full h-11 rounded-lg font-medium transition-all duration-200 
         
            bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]`}
        >
          Sign in
        </button>

      </form>

      {/* Footer */}
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
