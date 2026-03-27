import {
  ArrowUpCircleIcon,
  EllipsisVerticalIcon,
  LockClosedIcon,
  PencilIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import NoServer from "./NoServer";
export default function Settings() {
  const [editMenu,setEditMenu]=useState(false)
  const authContext = useContext(AuthContext);
  const { user, updateUserImage,updatePassword, isServer,showAlert ,updateUser} = authContext;
  const [settingsImage, setSettingsImage] = useState(null);
  const [data,setData]=useState({settingsPhoneNumber:user?.phone_number,settingsEmail:user?.email,settingsName:user?.name,settingsUsername:user?.username})
  const [originaldata,setOriginalData]=useState({settingsPhoneNumber:user?.phone_number,settingsEmail:user?.email,settingsName:user?.name,settingsUsername:user?.username})
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
    <div className="flex h-full flex-col bg-[#F5F7FB] overflow-y-auto scrollbar-hide">
      <div className="flex justify-between m-2 p-2 mt-4">
        <div>
          {" "}
          <h2 className="text-2xl pt-2 font-medium">My Profile</h2>{" "}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center my-2">
        <div className="my-2 py-2 relative">
          <input
            type="file"
            id="settingsImage"
            accept="image/*"
            className="hidden"
            onChange={settingImagehandler}
          />
          {settingsImage ? (
            <ArrowUpCircleIcon
              className="w-7 h-7 right-2 bg-white shadow text-blue-900    cursor-pointer rounded-full bottom-3 absolute "
              onClick={() => {
                updateUserImage(settingsImage);
                setSettingsImage(null);
              }}
            ></ArrowUpCircleIcon>
          ) : (
            <PencilIcon
              className="w-7 h-7 right-2 bg-white border border-black  p-1.5 text-blue-900  cursor-pointer rounded-full bottom-3 absolute "
              onClick={() => {
                document.getElementById("settingsImage").click();
              }}
            ></PencilIcon>
          )}
          <img
          loading="lazy"
            className="w-28  shadow h-28 rounded-full   border-2"
            src={
              settingsImage
                ? URL.createObjectURL(settingsImage)
                : user?.image.url
            }
            alt=""
          />
        </div>
        <p className="my-2 mb-1 font-medium">{user?.name}</p>
        <p>Active</p>
      </div>
      <div className="my-3 py-3 mx-3 px-2 text-sm text-[#8E949D]">
        Hey! I love connecting with new people and having meaningful conversations.
Feel free to drop a message anytime!
      </div>
      {/* form to update users information */}
    <div className="flex flex-col mx-3 mb-2">
        <div className="flex justify-between">
        <div className="flex font-medium bg-[#F9FAFA] pt-2 pb-3">
          {" "}
          <UserCircleIcon className="w-5 font-medium mt-1.5  mx-2 h-5 text-black" />
          <div className=" text-xl"> About</div></div>
          { !editMenu &&<div className="p-2 pt-3" onClick={()=>{setEditMenu(true)}}><PencilIcon className="h-4 w-4 cursor-pointer "></PencilIcon></div>}
          {editMenu &&<div className="p-2 pt-3" onClick={()=>{setEditMenu(false)}}><XMarkIcon className="h-4 w-4 cursor-pointer "></XMarkIcon></div>}
          </div>
        
      {!editMenu &&  <div className="flex flex-col mx-0.5 mb-2 py-3 bg-[#FFFFFF]">
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A] ">Name</div> <div className="text-sm py-1 font-medium">{user?.name}</div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Email</div> <div className="text-sm py-1 font-medium">{user?.email}</div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Username</div> <div className="text-sm py-1 font-medium">{user?.username}</div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Phone Number</div> <div className="text-sm py-1 font-medium">{user?.phone_number}</div></div>
          
          
          
          </div>}
       {editMenu &&<> <form onSubmit={handleUpdate}><div className="flex flex-col mx-0.5  py-3 bg-[#FFFFFF]">
       
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A] ">Name</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="text" name="settingsName"  value={data.settingsName} id="settingsName" onChange={onChangeHandler}/></div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Email</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="email" name="settingsEmail" value={data.settingsEmail} id="settingsEmail" onChange={onChangeHandler} /></div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Username</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="text" name="settingsUsername" value={data.settingsUsername} id="settingsUsername" onChange={onChangeHandler}/></div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Phone Number</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="tel" name="settingsPhoneNumber" value={data.settingsPhoneNumber} id="settingsPhoneNumber" onChange={onChangeHandler}/></div></div>
     
          
          
          </div>
               <div className="flex ">
        <div className="flex font-normal w-full pt-2 pb-3 justify-end"> 
        <div className="p-2 pt-3"><button type="submit" className="shadow rounded p-2 text-white bg-[#6159CB]">Update</button></div>
         
      </div>
          </div></form></> }
          
          </div>
          {/* form to change password */}
          <div className="flex flex-col mx-3 mb-20">
        <div className="flex justify-between">
        <div className="flex font-medium bg-[#F9FAFA] pt-2 pb-3">
          {" "}
          <LockClosedIcon className="w-5 font-medium mt-1.5  mx-2 h-5 text-black" />
          <div className=" text-xl"> Change Password</div></div>
     
          </div>
        
       <> <form onSubmit={handlePasswordUpdate}><div className="flex flex-col mx-0.5  py-3 bg-[#FFFFFF]">
       
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A] ">Old Password</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="text" name="oldPassword"  value={passwordData.oldPassword} id="oldPasswordd" onChange={onPasswordChangeHandler}/></div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">New Passowrd</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="password" name="newPassword" value={passwordData.newPassword} id="newPassword" onChange={onPasswordChangeHandler} /></div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Confirm Password</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="text" name="confirmPassword" value={passwordData.confirmPassword} id="confirmPassword" onChange={onPasswordChangeHandler} /></div></div>
           
          
          
          </div>
               <div className="flex ">
        <div className="flex font-normal w-full pt-2 pb-3 justify-end"> 
        <div className="p-2 pt-3"><button type="submit" className="shadow rounded p-2 text-white bg-[#6159CB]">Update</button></div>
         
      </div>
          </div></form></> 
          
          </div>
    </div>
  );
}
