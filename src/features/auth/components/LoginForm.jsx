import {
  EnvelopeIcon,
  LockClosedIcon,

} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa6";
import { emailRegex, validateLoginForm } from "../schemas/login.schema";
import { useLogin } from './../hooks/useLogin';
import AuthContext from "../../../Context/AuthContext";
export default function LoginForm() {
  const { showAlert} =  useContext(AuthContext);
    const loginMutation=useLogin()
  const [formData, setFormData] = useState({ email: "", password: "" });
 const onChangeHandler = ({target:{name,value}}) => {
  setFormData(prev=>({...prev,[name]:value}));
};
const isFormValid=emailRegex.test(formData.email.trim()) && formData.password.length>=8 

  const handleSubmit =  (e) => {
    e.preventDefault();
   const error = validateLoginForm(formData)
   if(error){
    showAlert("Warning",error)
    return
   }
  loginMutation.mutate({email:formData.email.trim(), password:formData.password})
  
  };
return (


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
        disabled={!isFormValid || loginMutation.isPending}
          type="submit"
          className="w-full flex justify-center items-center h-11 rounded-lg font-medium transition-all duration-200 
            bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:active:scale-100"
        >
        {loginMutation.isPending ? <FaSpinner className="text-white animate-spin w-5 h-5 "></FaSpinner>:"Sign in"} 
    
        </button>

      </form>

     
);
}
