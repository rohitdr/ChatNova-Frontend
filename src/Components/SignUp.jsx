import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });


  const { signUp, isServerDown,showAlert } = useContext(AuthContext);
  const onChange = ({target:{name,value}}) => {
    setFormData(prev=>({ ...prev, [name]:value }));
  
  };
    const emailRegex = /^\S+@\S+\.\S+$/;
 const validate = () => {
  if(!formData.email.trim() || !formData.username.trim()){
  return "Fields cannot be empty";
}

  if (!emailRegex.test(formData.email.trim())) {
    return "Invalid email format";
  }
  if (formData.password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (formData.username.trim().length < 8) {
    return "Username must be at least 8 characters";
  }
  return null;
};
const isFormValid=emailRegex.test(formData.email.trim()) && formData.password.length>=8 && formData.username.trim().length>=8
  const handleSubmit = (e) => {
    e.preventDefault();
const error = validate()
   if (error) {
    return showAlert("Warning", error);
  }


   signUp(formData.email.trim(), formData.password, formData.username.trim());


    
  };
return isServerDown ? (
  <NoServer />
) : (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100  px-4">
    
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
      
     
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">
        ChatNova
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Create your account 🚀
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

     
        <div>
          <label className="text-sm text-gray-600" htmlFor="signup-email">Email</label>
          <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">
            
            <EnvelopeIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="email"
              name="email"
              id="signup-email"
              autoComplete="email"
              required
              value={formData.email}
              aria-label="Email"
              placeholder="Enter your email"
              onChange={onChange}
              className="w-full h-11 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-sm text-gray-600" htmlFor="signup-username">Username</label>
          <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">
            
            <UserIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="text"
              id="signup-username"
              required
              autoComplete="username"
              aria-label="UserName"
              value={formData.username}
              name="username"
              placeholder="Choose a username"
              onChange={onChange}
              className="w-full h-11 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600" htmlFor="signup-password">Password</label>
          <div className="flex items-center mt-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-400">
            
            <LockClosedIcon className="w-5 h-5 mx-3 text-gray-400" />

            <input
              type="password"
              id="signup-password"
              required
              autoComplete="new-password"
              aria-label="Password"
              value={formData.password}
              name="password"
              placeholder="Create a password"
              onChange={onChange}
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
