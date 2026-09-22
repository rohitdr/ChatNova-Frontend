
import { Link } from "react-router-dom";
import SignUpForm from "../features/auth/components/SignUpForm";
export default function SignUp() {

return  (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100  px-4">
    
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
      
     
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">
        ChatNova
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Create your account 🚀
      </p>

   
<SignUpForm></SignUpForm>
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
