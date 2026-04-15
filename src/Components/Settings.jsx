import {
  ArrowUpIcon,
  LockClosedIcon,
  PencilIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Context/AuthContext";

import ChatNovaContext from "../Context/ChatNovaContext"
import SocketContext from "../Context/SocketContext"
import NoServer from "./NoServer";
export default function Settings() {
  const {socket }= useContext(SocketContext)
  const [editMenu,setEditMenu]=useState(false)
  const {capitalizeFirstLetter,queryClient} = useContext(ChatNovaContext)
const imageRef =useRef(null)
  const { Me, updateUserImage,updatePassword, isServerDown,showAlert ,updateUser} = useContext(AuthContext);
  const [settingsImage, setSettingsImage] = useState(null);
  const [formData,setFormData]=useState(null)
  const [originaldata,setOriginalData]=useState(null)
 const [passwordData,setPasswordData]=useState({oldPassword:"",newPassword:"",confirmPassword:""})
const [preview,setPreview]=useState(null)
  useEffect(()=>{
      if (Me) {
    const initial = {
      phone_number: Me.phone_number,
      email: Me.email,
      name: Me.name,
      username: Me.username,
    };
    setFormData(initial);
    setOriginalData(initial);
  }
  },[Me])
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if(!file) return
    setSettingsImage(file);
  };

  useEffect(()=>{
    if(!settingsImage) return
    const url = URL.createObjectURL(settingsImage)
    setPreview(url)
    return ()=> URL.revokeObjectURL(url)
  },[settingsImage])
 const handleImageUpdate=()=>{
            updateUserImage(settingsImage);
            setSettingsImage(null);
            setPreview(null)
         
 }
  const handleChange=({target:{name,value}})=>{
    setFormData(prev=>({...prev,[name]:value}))
  }
  
   const emailRegex = /^\S+@\S+\.\S+$/;

const validate = () => {
  if(!formData || !originaldata) return   { error: "Data not ready" };
  const updatedFields = {};
  const payload = {};

  Object.keys(formData).forEach((key) => {
    if (formData[key] !== originaldata[key]) {
      updatedFields[key] = formData[key];
    }
  });

  if (!emailRegex.test(formData.email)) {
    return { error: "Please Enter a Valid Email" };
  }

  if (formData.name.trim().length < 3 || formData.name.trim().length > 20) {
    return { error: "Name should be between length 3 to 20" };
  }

  if (formData.username.trim().length < 8 || formData.username.trim().length > 12) {
    return { error: "Username should be between length 8 to 12" };
  }

  if (String(formData.phone_number).trim().length !== 10) {
    return { error: "Phone number should be of length 10" };
  }

  if (!Object.keys(updatedFields).length) {
    return { error: "Please update something" };
  }


  if (updatedFields.name) payload.name = updatedFields.name;
  if (updatedFields.email) payload.email = updatedFields.email;
  if (updatedFields.username) payload.username = updatedFields.username;
  if (updatedFields.phone_number) payload.phone_number = updatedFields.phone_number;

  return { payload };
};

const handleUpdate = (e) => {
  e.preventDefault();

  const { error, payload } = validate();

  if (error) {
    showAlert("Error", error);
    return;
  }

  updateUser(payload);
  setEditMenu(false);
  setOriginalData(formData);
};

 const isChanged =formData && originaldata && JSON.stringify(formData) !== JSON.stringify(originaldata) 
  useEffect(()=>{
    if(!socket) return
    const handleSocket=(userToSend)=>{
  
      if(userToSend){
    
 queryClient.setQueryData(["Me"],(oldData)=>{
  if(!oldData) return
    return {...oldData,...userToSend}

  })

      }
    }
      socket.on("updateUser",handleSocket)
 return ()=>{
  socket.off("updateUser",handleSocket)
 }
  },[socket,queryClient])

  const handlePasswordChange=({target:{name,value}})=>{
     setPasswordData(prev=>({...prev,[name]:value}))
  }
  const validatePassword=()=>{
 if(passwordData.oldPassword.length<8 || passwordData.newPassword.length<8 || passwordData.confirmPassword.length<8  ){
      return "Password should be of length 8"
    }
  if(passwordData.confirmPassword !== passwordData.newPassword){
        return "New password and confirm password must be same"
    }
    if(passwordData.oldPassword === passwordData.newPassword){
        return "New password and old password must not be same"
    }
    return null
  }
  const isValidPassword =
  passwordData.oldPassword.length >= 8 &&
  passwordData.newPassword.length >= 8 &&
  passwordData.confirmPassword === passwordData.newPassword;
  const handlePasswordUpdate=(e)=>{
e.preventDefault()
 const error = validatePassword()
 if(error){
  showAlert("Error",error)
  return
 }
  
  updatePassword(passwordData.oldPassword,passwordData.newPassword)
   setPasswordData({oldPassword:"",newPassword:"",confirmPassword:""})
    
  }
  return isServerDown  ? (
    <NoServer></NoServer>
  ) : (
  <div className="flex h-full flex-col bg-gradient-to-br from-[#EEF2F7] to-[#F8FAFC] overflow-y-auto scrollbar-hide">


  <div className="flex justify-between items-center px-6 py-4">
    <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
  </div>


  <div className="mx-4 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
    
    <div className="relative">
      <input
      ref={imageRef}
        type="file"
        id="settingsImage"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

    
      <img
        loading="lazy"
        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
        src={preview|| Me?.image?.url}
        alt="User"
      />


      {settingsImage ? (
        <ArrowUpIcon
          className="w-8 h-8 p-1.5 bg-blue-600 text-white rounded-full shadow absolute bottom-1 right-1 cursor-pointer hover:bg-blue-700 transition"
          onClick={handleImageUpdate}
        />
      ) : (
        <PencilIcon
          className="w-8 h-8 p-1.5 bg-white border shadow rounded-full absolute bottom-1 right-1 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => {
            imageRef.current.click()
          }}
        />
      )}
    </div>

    <p className="mt-4 text-lg font-semibold text-gray-800">
      {capitalizeFirstLetter(Me?.name)}
    </p>

    <p className="text-sm text-gray-500">@{Me?.username}</p>
  </div>

  


  <div className="mx-4 mt-4">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <UserCircleIcon className="w-5 h-5 text-gray-700 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">About</h3>
      </div>

      {!editMenu ? (
        <PencilIcon
          className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => setEditMenu(true)}
        />
      ) : (
        <XMarkIcon
          className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => setEditMenu(false)}
        />
      )}
    </div>

  
    {!editMenu && (
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {[
          { label: "Name", value: Me?.name },
          { label: "Email", value: Me?.email },
          { label: "Username", value: Me?.username },
          { label: "Phone", value: Me?.phone_number },
        ].map((item, i) => (
          <div key={i} className="p-4 hover:bg-gray-50 transition">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    )}

  
    {editMenu && (
      <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-sm p-4 space-y-4">

        {[
          { name: "name", type: "text"},
          { name: "email", type: "email" },
          { name: "username", type: "text"},
          { name: "phone_number", type: "tel" },
        ].map((field, i) => (
          <input
            key={i}
    
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={`Enter ${field.name}`}
            className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
          />
        ))}

        <div className="flex justify-end">
          <button
          disabled={!isChanged}
           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50">
            Update
          </button>
        </div>
      </form>
    )}
  </div>


  <div className="mx-4 mt-4 mb-10">
    <div className="flex items-center mb-2">
      <LockClosedIcon className="w-5 h-5 text-gray-700 mr-2" />
      <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
    </div>

    <form onSubmit={handlePasswordUpdate} className="bg-white rounded-2xl shadow-sm p-4 space-y-4">

      <input
        type="password"
        name="oldPassword"
        autoComplete="current-password"
        value={passwordData.oldPassword}
        onChange={handlePasswordChange}
        placeholder="Old Password"
        className="input-modern"
      />

      <input
        type="password"
        name="newPassword"
        autoComplete="new-password"
        value={passwordData.newPassword}
        onChange={handlePasswordChange}
        placeholder="New Password"
        className="input-modern"
      />

      <input
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        value={passwordData.confirmPassword}
        onChange={handlePasswordChange}
        placeholder="Confirm Password"
        className="input-modern"
      />

      <div className="flex justify-end">
        <button
        disabled={!isValidPassword}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50">
          Update
        </button>
      </div>
    </form>
  </div>
</div>
  );
}
