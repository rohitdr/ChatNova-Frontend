import {
  ArrowUpCircleIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  TicketIcon,
  TrashIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserMinusIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import SocketContext from '../Context/SocketContext'
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Context/AuthContext";

import NoServer from "./NoServer";
import ChatNovaContext from "../Context/ChatNovaContext";

export default function CreateGroup() {
  const [editMenu,setEditMenu]=useState(false)
  const context = useContext(ChatNovaContext)
  const{currentGroup,serchUser,addMember,setCurrentGroup,dataBaseUsers,removeMember,conversationId,updateGroupImage,chattedUsersList,capitalizeFirstLetter}=context
  const authContext = useContext(AuthContext);
  const { user,updatePassword, isServer,showAlert ,updateUser} = authContext;
  const [settingsImage, setSettingsImage] = useState(null);
  const [data,setData]=useState({settingsPhoneNumber:user?.phone_number,settingsEmail:user?.email,settingsName:user?.name,settingsUsername:user?.username})
  const [originaldata,setOriginalData]=useState({settingsPhoneNumber:user?.phone_number,settingsEmail:user?.email,settingsName:user?.name,settingsUsername:user?.username})
 const [passwordData,setPasswordData]=useState({oldPassword:"",newPassword:"",confirmPassword:""})
 const socketcontext = useContext(SocketContext)
 const [addUser,setAddUser] = useState(false)
 const [searchingAddUser,setSearchingAddUser]=useState(false)
 const [isAdmin,setIsAdmin]=useState(false)
 const [selectedUsers,setSelectedUsers]=useState([])

 

 const {socket}=socketcontext
  const settingImagehandler = (e) => {
    setSettingsImage(e.target.files[0]);
  };
  const onChangeHandler=(e)=>{
    setData({...data,[e.target.name]:e.target.value})
  }
  const onChangeSearchAddUser = (e) => {
    let value = e.target.value;

    if (value.length === 0) {
      setAddUser(false);
      setSearchingAddUser(false)
      
    } else {
      setAddUser(true);
      setSearchingAddUser(true)
      serchUser(value);
    }
  };


 
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

  useEffect(()=>{
    if(!socket) return
    
     const handler =(group)=>{
      console.log(group)
      if(conversationId === group._id){
       setCurrentGroup((prev)=>({
        ...prev,...group})
      )
      }
        console.log(currentGroup)
      
    }

    const MemberHandler =({groupId,participents})=>{
      console.log("running")
      console.log(groupId)
       if(conversationId===groupId){
        setCurrentGroup(prev=>{
            return {...prev,participents}
       })
       }
    }
   
    socket.on("member_added",MemberHandler)
    socket.on("group_update", handler)
     socket.on("remove_member",MemberHandler)
   return ()=>{
      socket.off("group_update", handler)
      socket.off("member_added",MemberHandler)
      socket.off("remove_member",MemberHandler)
   }
  },[socket])
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <div>
    {!addUser &&  <div className="flex h-screen flex-col bg-[#F5F7FB] overflow-y-auto scrollbar-hide">
      <div className="flex justify-between m-2 p-2 mt-0">
        <div>
          {" "}
          <h2 className="text-2xl pt-2 font-medium">Create Group</h2>{" "}
        </div>
      </div>
      <div className="bg-white mx-3  rounded-2xl shadow">
      <div className="flex flex-col items-center justify-center my-2  ">
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
              className={`w-9 h-9 right-2 bg-white shadow text-blue-900    cursor-pointer rounded-full bottom-3 absolute `}
              onClick={() => {
                console.log(currentGroup)
                updateGroupImage(settingsImage);
                setSettingsImage(null);
              }}
            ></ArrowUpCircleIcon>
          ) : (
            <PencilIcon
              className={`w-9 h-9 right-2 bg-white border border-black  p-1.5 text-blue-900  cursor-pointer rounded-full bottom-3 absolute `}
              onClick={() => {
                document.getElementById("settingsImage").click();
              }}
            ></PencilIcon>
          )}
          <img
            className="w-28  shadow-md h-28 rounded-full border-white   border-4"
            src={
              settingsImage
                ? URL.createObjectURL(settingsImage)
                : ".././public/group-of-friends-sketch-vector-43422085.avif"
            }
            alt=""
          />
        </div>
       <form className="w-full px-6 pb-4 flex flex-col gap-4">

  {/* Group Name */}
  <div className="flex flex-col">
    <label className="text-sm text-gray-500 mb-1">
      Group Name
    </label>
    <input
      type="text"
      placeholder="Enter group name..."
      className="px-4 py-2 rounded-xl border border-gray-300 bg-[#F9FAFA] 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 transition-all shadow-sm"
    />
  </div>

  {/* Invite Code */}
  <div className="flex flex-col">
    <label className="text-sm text-gray-500 mb-1">
      Invite Code
    </label>
    <input
      type="text"
      placeholder="Enter invite code..."
      className="px-4 py-2 rounded-xl border border-gray-300 bg-[#F9FAFA] 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 transition-all shadow-sm"
    />
  </div>

</form>
      </div>
      </div>
    
          <div className="flex flex-col mx-3 mt-4 mb-20 bg-white rounded-xl shadow">
        <div className="flex justify-between ">
        <div className="flex font-medium  pt-2 pb-1 mx-2">
          {" "}
          <UserGroupIcon className="w-6 font-medium mt-0.5  mx-2 h-6 text-black" />
          <div className=" text-xl">Add Members</div></div>
        <div className="flex font-medium  pt-2 pb-1">
          {" "}
      
          <MagnifyingGlassIcon onClick={()=>{setAddUser(true)}} className={`w-5 font-medium mt-1.5  mx-2 h-5 text-blue-500 cursor-pointer`} />
         
          </div>
          
          </div>
          <div className="">
       {chattedUsersList &&
              chattedUsersList.length !== 0 && chattedUsersList.map((element) => {
                const participentExists=selectedUsers.some(p=>
                p.user === element.user._id
              )
                return (
                  
                  <div
                  key={element.user._id}
                   
                    className={`flex mx-4  cursor-pointer rounded-2xl mt-2  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2 ${participentExists
                      ? "bg-blue-50 border border-blue-400 scale-[1.01]"
                      : "hover:bg-gray-100 border border-transparent"}`}
                  >
                    
                    <div className="flex-shrink-0">
                       
                        <img
                          className="w-10 mt-1 h-10 rounded-full border-white border-2"
                          src={element.user.image.url}
                          alt=""
                        />
                      </div>
                    <div className="flex flex-col w-full justify-between py-1">
                      <div className="flex  flex-1 justify-between items-center pl-2 ">
                        <p className="font-small text-xs  xs:text-sm text-black">
                          {capitalizeFirstLetter(element.user.name)}
                        </p>
                    
                       
                       
                      </div>
                     
                    </div>
                     <div className="flex flex-shrink-0 items-center">
                      {!participentExists ?<PlusIcon className={`w-5 font-medium   h-5 text-blue-500 cursor-pointer `} onClick={()=>{setSelectedUsers(prev=>
                        [...prev,{user:element.user._id,role:"member"}]
                      )}}/>:<><CheckIcon className={`w-5 font-medium mx-2  h-5 text-blue-500 cursor-pointer `}></CheckIcon><MinusIcon className={`w-5 font-medium  mx-2  h-5 text-red-500 cursor-pointer `} onClick={()=>{setSelectedUsers(prev=>
                      {
                        const filtered = prev.filter(p=>
                            p.user !==element.user._id
                        )
                        return filtered
                      }
                       
                      )}}/></>}
                    </div>
                  </div>
                );
              })} </div>
                 <div
                
                   
                    className="flex    border-2  cursor-pointer rounded-2xl mt-8 bg-white  hover:bg-[#E6EBF5]    xs:p-2"
                  >
                    
                    <div className="">
                       
                     
                      </div>
                    <div className="flex flex-col w-full justify-between py-2">
                      <div className="flex  flex-1 justify-between items-center pl-2 ">
                        <p className="font-small text-xs  xs:text-sm text-red-500">
                   Exit Group
                        </p>
                    
                       
                       
                      </div>
                   
                     
                    </div>
                    <div className="flex items-center">
                      <TrashIcon className="w-5 font-medium   h-5 text-red-500 cursor-pointer" />
                    </div>
                  </div>

   
          
          </div>
    </div>}
    {addUser && 
    <div className={`h-screen  2xs:p-0 xs:p-1  lg:p-0 flex bg-[#F5F7FB] flex-col `}>
        
          <div className="flex p-2 pr-0 rounded-lg border-none mx-2 sm:mx-4 my-2 mt-6 bg-[#E6EBF5]">
            <MagnifyingGlassIcon className="w-5 h-5 pt-1  text-gray-700 cursor-pointer" />
            <input
              type="search"
              className="w-full  bg-[#E6EBF5] outline-none pl-2"
              onChange={onChangeSearchAddUser}
              placeholder="Search messages or users"
              name="usersearch"
              id="usersearch"
            />
          </div>
        

          <div className="flex pt-2 flex-col pb-10  sm:p-2 sm:px-4 overflow-y-auto scrollbar-hide">
           
            <div className="">
             
                {searchingAddUser && dataBaseUsers &&
              dataBaseUsers.length !== 0 && dataBaseUsers.map((element) => {
                const participentExists=selectedUsers.some(p=>
                p.user === element._id
              )
            
                return (
                  
                  <div
                  key={element._id}
                   
                    className="flex shadow  border-2   cursor-pointer rounded-2xl mt-2 bg-white  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                  >
                    
                    <div className="">
                       
                        <img
                          className="w-12 mt-1 h-10 rounded-full border-white border-2"
                          src={element.image.url}
                          alt=""
                        />
                      </div>
                    <div className="flex flex-col w-full justify-between py-1">
                      <div className="flex  flex-1 justify-between items-center pl-2 ">
                        <p className="font-small text-xs  xs:text-sm text-black">
                          {capitalizeFirstLetter(element.name)}
                        </p>
                    
                       
                       
                      </div>
                     
                    </div>
                     <div className="flex items-center">
                      {!participentExists ?<PlusIcon className={`w-5 font-medium   h-5 text-blue-500 cursor-pointer `} onClick={()=>{setSelectedUsers(prev=>
                        [...prev,{user:element._id,role:"member"}]
                      )}}/>:<MinusIcon className={`w-5 font-medium   h-5 text-red-500 cursor-pointer `} onClick={()=>{setSelectedUsers(prev=>
                      {
                        const filtered = prev.filter(p=>
                            p.user !==element._id
                        )
                        return filtered
                      }
                       
                      )}}/>}
                    </div>
                    </div>
               
                );
              })}

        </div>
          </div>
        </div>}
   
        </div>)

  
}
