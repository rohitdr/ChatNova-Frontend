
import { PencilIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useAuthMutations } from "./Hooks/useAuthMutations";
export default function AdditionalDetails() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setImage] = useState(null);
 

  const navigate = useNavigate();
  const InputRef = useRef(null);

  const { updateUserImage, showAlert, updateUser,handleError } =
    useContext(AuthContext);
 const {userUpdatedMutation}=useAuthMutations()
  const [formData, setFormData] = useState({
    phone_number: "",
    name: "",
  });

  useEffect(() => {
    if (!image) return;

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const phone = formData.phone_number.trim();

    if (name.length < 3 || name.length > 20) {
      return "Name must be 3–20 characters";
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return "Enter a valid 10-digit phone number";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      showAlert("Warning", error);
      return;
    }
    const data={
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
      }
      userUpdatedMutation.mutate({data,file:image})
   
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-2xl md:rounded-3xl max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Complete Your Profile
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Add your details to personalize your experience
          </p>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center py-3 sm:py-4">
          <div className="relative group">

            <input
              type="file"
              ref={InputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <img
              loading="lazy"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
              src={
                previewUrl ||
                "/profile.jpg"
              }
              alt="Profile"
            />

            <button
              type="button"
              onClick={() => InputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all p-2 rounded-full shadow-lg"
            >
              <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 sm:px-8 py-6 space-y-5">
            
            <div>
              <label
                htmlFor="additional-name"
                className="text-sm font-medium text-slate-600"
              >
                Full Name
              </label>

              <input
                id="additional-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="additional-number"
                className="text-sm font-medium text-slate-600"
              >
                Phone Number
              </label>

              <input
                id="additional-number"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-5 sm:px-8 py-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSkip}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-all font-medium"
            >
              Skip
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl flex justify-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 transition-all"
            >
                    {userUpdatedMutation.isPending?<FaSpinner className="text-white animate-spin w-6 h-6"></FaSpinner>:"Save"}      
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
