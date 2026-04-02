import {
  ArrowUpIcon,
  EllipsisVerticalIcon,
  LockClosedIcon,
  PencilIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Context/AuthContext";

import ChatNovaContext from "../Context/ChatNovaContext"
import SocketContext from "../Context/SocketContext"
import NoServer from "./NoServer";
export default function Settings() {
  const {socket }= useContext(SocketContext)
  const [editMenu,setEditMenu]=useState(false)
  const {capitalizeFirstLetter,queryClient} = useContext(ChatNovaContext)
  const authContext = useContext(AuthContext);
  const { Me, updateUserImage,updatePassword, isServer,showAlert ,updateUser} = authContext;
  const [settingsImage, setSettingsImage] = useState(null);
  const [data,setData]=useState({settingsPhoneNumber:Me?.phone_number,settingsEmail:Me?.email,settingsName:Me?.name,settingsUsername:Me?.username})
  const [originaldata,setOriginalData]=useState({settingsPhoneNumber:Me?.phone_number,settingsEmail:Me?.email,settingsName:Me?.name,settingsUsername:Me?.username})
 const [passwordData,setPasswordData]=useState({oldPassword:"",newPassword:"",confirmPassword:""})

  const settingImagehandler = (e) => {
    setSettingsImage(e.target.files[0]);
  };
  const onChangeHandler=(e)=>{
    setData({...data,[e.target.name]:e.target.value})
  }
  const handleUpdate=(e)=>{
    let updatedfiled={}
    const argu ={}
    Object.keys(data).forEach((key)=>{
      if(data[key] !== originaldata[key]){
        updatedfiled[key]=data[key]
      }
    })
    e.preventDefault()

    if(data.settingsName.length<3 || data.settingsName.length>20 ){
      showAlert("Warning","Name should be between length 3 to 20")
    }
    else if(data.settingsUsername.length<8 ||data.settingsUsername.length>12){
      showAlert("Warning","Username should be between length 8 to 12")
    }
    else if(String(data.settingsPhoneNumber).trim().length !==10){
     showAlert("Warning","Phone number should be of length 10")
    }
    else if(Object.keys(updatedfiled).length===0){
         showAlert("Warning","Please Update anything to change the data")
    }
    else{
   if(updatedfiled.settingsName){
     argu.name=updatedfiled.settingsName
   }
   if(updatedfiled.settingsEmail){
     argu.email=updatedfiled.settingsEmail
   }
   if(updatedfiled.settingsUsername){
     argu.username=updatedfiled.settingsUsername
   }
   if(updatedfiled.settingsPhoneNumber){
     argu.phone_number=updatedfiled.settingsPhoneNumber
   }
updateUser(argu)
setEditMenu(false)
updatedfiled={}

    }



  }


 
  useEffect(()=>{
    if(!socket) return
    const handleSocket=(userToSend)=>{
  
      if(userToSend){
    
 queryClient.setQueryData(["Me"],(oldData)=>{
    return [...oldData,...userToSend]

  })

      }
    }
      socket.on("updateUser",handleSocket)
 return ()=>{
  socket.off("updateUser",handleSocket)
 }
  },[socket])
  const onPasswordChangeHandler=(e)=>{
     setPasswordData({...passwordData,[e.target.name]:e.target.value})
  }
  const handlePasswordUpdate=(e)=>{
e.preventDefault()
 if(passwordData.oldPassword.length<8 || passwordData.newPassword.length<8 || passwordData.confirmPassword.length<8  ){
      showAlert("Warning","Password should be of length 8")
    }
    else if(passwordData.confirmPassword !== passwordData.newPassword){
         showAlert("Warning","New password and confirm password must be same")
    }
    else if(passwordData.oldPassword === passwordData.newPassword){
         showAlert("Warning","New password and old password must not be same")
    }
    else{
      // console.log(passwordData.oldPassword,passwordData.newPassword)
  updatePassword(passwordData.oldPassword,passwordData.newPassword)
   setPasswordData({oldPassword:"",newPassword:"",confirmPassword:""})
    }
  }
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
  <div className="flex h-full flex-col bg-gradient-to-br from-[#EEF2F7] to-[#F8FAFC] overflow-y-auto scrollbar-hide">


  <div className="flex justify-between items-center px-6 py-4">
    <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
  </div>

  {/* Profile Card */}
  <div className="mx-4 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
    
    <div className="relative">
      <input
        type="file"
        id="settingsImage"
        accept="image/*"
        className="hidden"
        onChange={settingImagehandler}
      />

      {/* Avatar */}
      <img
        loading="lazy"
        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
        src={
          settingsImage
            ? URL.createObjectURL(settingsImage)
            : Me?.image?.url
        }
        alt=""
      />


      {settingsImage ? (
        <ArrowUpIcon
          className="w-8 h-8 p-1.5 bg-blue-600 text-white rounded-full shadow absolute bottom-1 right-1 cursor-pointer hover:bg-blue-700 transition"
          onClick={() => {
            updateUserImage(settingsImage);
            setSettingsImage(null);
          }}
        />
      ) : (
        <PencilIcon
          className="w-8 h-8 p-1.5 bg-white border shadow rounded-full absolute bottom-1 right-1 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => {
            document.getElementById("settingsImage").click();
          }}
        />
      )}
    </div>

    <p className="mt-4 text-lg font-semibold text-gray-800">
      {capitalizeFirstLetter(Me?.name)}
    </p>

    <p className="text-sm text-gray-500">@{Me?.username}</p>
  </div>

  {/* Bio */}
  <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-5 text-sm text-gray-600 leading-relaxed">
    Hey! I love connecting with new people and having meaningful conversations.
    Feel free to drop a message anytime!
  </div>

  {/* About Section */}
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
          { name: "settingsName", type: "text" },
          { name: "settingsEmail", type: "email" },
          { name: "settingsUsername", type: "text" },
          { name: "settingsPhoneNumber", type: "tel" },
        ].map((field, i) => (
          <input
            key={i}
            type={field.type}
            name={field.name}
            value={data[field.name]}
            onChange={onChangeHandler}
            placeholder={field.name.replace("settings", "")}
            className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
          />
        ))}

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
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
        value={passwordData.oldPassword}
        onChange={onPasswordChangeHandler}
        placeholder="Old Password"
        className="input-modern"
      />

      <input
        type="password"
        name="newPassword"
        value={passwordData.newPassword}
        onChange={onPasswordChangeHandler}
        placeholder="New Password"
        className="input-modern"
      />

      <input
        type="password"
        name="confirmPassword"
        value={passwordData.confirmPassword}
        onChange={onPasswordChangeHandler}
        placeholder="Confirm Password"
        className="input-modern"
      />

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Update
        </button>
      </div>
    </form>
  </div>
</div>
  );
}
