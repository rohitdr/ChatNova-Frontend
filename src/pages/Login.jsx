
import { Link } from "react-router-dom";
import LoginForm from "../features/auth/components/LoginForm";
export default function Login() {

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
    
    <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8">
      
      {/* Logo */}
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">
        ChatNova
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Welcome back 👋
      </p>

  <LoginForm></LoginForm>

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
