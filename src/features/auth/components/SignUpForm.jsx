import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { emailRegex } from "../schemas/login.schema";
import { validateSignUpForm } from "../schemas/signUp.schema";
import { useSignUp } from "../hooks/useSignUp";
import AuthContext from "../../../Context/AuthContext";
export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const {  showAlert } = useContext(AuthContext);
  const signUpMutation=useSignUp()
  const onChange = ({target:{name,value}}) => {
    setFormData(prev=>({ ...prev, [name]:value }));
  
  };

const isFormValid=emailRegex.test(formData.email.trim()) && formData.password.length>=8 && formData.username.trim().length>=8
  const handleSubmit = (e) => {
    e.preventDefault();
const error = validateSignUpForm(formData)
   if (error) {
    return showAlert("Warning", error);
  }
   signUpMutation.mutate({email:formData.email.trim(), password:formData.password, username:formData.username.trim()})

  };
return  (
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
          disabled={!isFormValid || signUpMutation.isPending}
          className="w-full h-11 flex justify-center items-center rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {signUpMutation.isPending?<FaSpinner className="text-white animate-spin w-5 h-5"></FaSpinner>:"Create Account"}
        </button>
      </form>    
);
}
