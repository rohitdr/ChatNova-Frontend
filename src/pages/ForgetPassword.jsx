
import { Link } from "react-router-dom";
import ForgetPasswordForm from "../features/auth/components/ForgetPasswordForm";

export default function ForgetPassword() {


  return  (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            loading="lazy"
            src="https://res.cloudinary.com/do2twyxai/image/upload/v1773486472/ChatGPT_Image_Mar_14_2026_04_35_32_PM_owgv9l.png"
            alt="logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-2xl font-semibold text-gray-800">
            ChatNova
          </h1>
        </div>

        <p className="text-center text-gray-500 mb-6">
          Enter your details to reset your password 🔐
        </p>

    <ForgetPasswordForm></ForgetPasswordForm>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?
          <Link
            to="/login"
            className="text-indigo-600 hover:underline"
          >
            {" "}Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}