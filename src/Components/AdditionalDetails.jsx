import { ArrowUpCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Context/AuthContext";


import { useNavigate } from "react-router-dom";

export default function AdditionalDetails() {
  const [previewUrl,setPreviewUrl]=useState(null)
  useEffect(()=>{
    if(!image) return 
    const url = URL.createObjectURL(image)
    setPreviewUrl(url)
    return ()=>{
      URL.revokeObjectURL(url)
    }
  },[image])
  const navigate = useNavigate();
const InputRef = useRef(null)
  const { updateUserImage, showAlert, updateUser } =  useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({ phone_number: "", name: "" });


  const handleImageChange = (e) => {
   const file = e.target.files?.[0]
   if(file) setImage(file)
  };
  const handleChange = ({target:{name,value}}) => {
    setFormData(prev=>({ ...prev, [name]:value }));
  };

const validateForm = () => {
    const name = formData.name.trim();
    const phone = formData.phone_number.trim();

    if (name.length < 3 || name.length > 20) {
     return "Name must be 3–20 characters"
    
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return "Enter a valid 10-digit phone number"
   
    }

    return null;
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    const error = validateForm()
    if(error){
      showAlert("Warning",error)
      return
    }
  
      await updateUser({
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
      })
 if(image){
 await  updateUserImage(image);
 }
      navigate("/");
    }
  
const handleSkip=()=>{
                          navigate("/");     
}
  return (
    <div>
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center ">
        <div className="flex object-contain md:w-[50%] lg:w-[600px] flex-col bg-[#F5F7FB]  shadow-lg rounded-xl">
          <div className="flex justify-between m-2 p-2 mt-4 text-center">
            <div>
              {" "}
              <h2 className="text-2xl pt-2 font-medium">
                Additional Infromation
              </h2>{" "}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center my-2">
            <div className="my-2 py-2 relative">
              <input
                type="file"
                  ref={InputRef}
                id="settingsImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {image ? (
                <ArrowUpCircleIcon
                  className="w-7 h-7 right-2 bg-white shadow text-blue-900    cursor-pointer rounded-full bottom-3 absolute "
                  onClick={()=>{setImage(null);
                    setPreviewUrl(null)
                  }}
                ></ArrowUpCircleIcon>
              ) : (
                <PencilIcon
              
                  className="w-7 h-7 right-2 bg-white border border-black  p-1.5 text-blue-900  cursor-pointer rounded-full bottom-3 absolute "
                  onClick={()=>InputRef.current.click()}
                ></PencilIcon>
              )}
              <img
                loading="lazy"
                className="w-28  shadow h-28 rounded-full   border-2"
                src={previewUrl ||  "https://via.placeholder.com/150"}
                alt="Profile"
              />
            </div>
          </div>

          {/* form to update users information */}
          <div className="flex flex-col mx-3 mb-2">
            <div className="flex justify-between"></div>

            <>
              {" "}
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mx-0.5  py-3 bg-[#FFFFFF]">
                  <div className="flex flex-col py-2 px-6">
                    {" "}
                    <label className=" text-[#7A7F9A] " htmlFor="additional-name">Name</label>{" "}
                    <div className="text-sm py-1 font-medium">
                      <input
                        className="outline-none bg-[#F9FAFA] h-8 p-1 w-full"
                        type="text"
                        id="additional-name"
                        name="name"
                        value={formData.name}
                      
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col py-2 px-6">
                    {" "}
                    <label className=" text-[#7A7F9A]" htmlFor="additional-number">Phone Number</label>{" "}
                    <div className="text-sm py-1 font-medium">
                      <input
                        className="outline-none bg-[#F9FAFA] h-8 p-1 w-full"
                        type="tel"
                        name="phone_number"
                        id="additional-number"
                        value={formData.phone_number}
                   
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex ">
                  <div className="flex font-normal w-full pt-2 pb-3 justify-end">
                    <div className="p-2 pt-3">
                      <button
                        type="button"
                        className="shadow rounded p-2 w-16 text-white bg-yellow-500"
                        onClick={handleSkip}
                      >
                        Skip
                      </button>
                    </div>
                    <div className="p-2 pt-3">
                      <button
                        type="submit"
                        className="shadow rounded p-2 w-16 text-white bg-[#6159CB]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
