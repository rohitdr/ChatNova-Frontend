import {
  ArrowUpCircleIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import SocketContext from '../Context/SocketContext'
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
import ChatNovaContext from "../Context/ChatNovaContext";
import { useQueryClient } from "@tanstack/react-query";

export default function GroupInfo() {

  const context = useContext(ChatNovaContext)
  const{currentGroup,searchUser,addMember,isAdmin,isGroup,deleteGroup,leaveGroup,queryClient,activeGroupChat,selectedGroup,setCurrentGroup,dataBaseUsers,removeMember,conversationId,updateGroupImage,chattedUsersList,capitalizeFirstLetter,isDeletingGroup,isLeavingGroup}=context
  const authContext = useContext(AuthContext);
  const { updatePassword, isServerDown,showAlert ,updateUser,Me} = authContext;
  const [groupSettingsImage, setGroupSettingsImage] = useState(null);
  const [data,setData]=useState({settingsPhoneNumber:Me?.phone_number,settingsEmail:Me?.email,settingsName:Me?.name,settingsUsername:Me?.username})
  const [originaldata,setOriginalData]=useState({settingsPhoneNumber:Me?.phone_number,settingsEmail:Me?.email,settingsName:Me?.name,settingsUsername:Me?.username})
 const [passwordData,setPasswordData]=useState({oldPassword:"",newPassword:"",confirmPassword:""})
 const socketcontext = useContext(SocketContext)
 const [addUser,setAddUser] = useState(false)
 const [searchingAddUser,setSearchingAddUser]=useState(false)
 const conversationIdRef=useRef(conversationId)
const queryclient = useQueryClient();

 

 const {socket}=socketcontext
  const settingImagehandler = (e) => {
    setGroupSettingsImage(e.target.files[0]);
    e.target.files=""
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
      searchUser(value);
    }
  };


 


 useEffect(() => {
  conversationIdRef.current = conversationId;
}, [conversationId]);


  useEffect(()=>{
   
    if(!socket || !isGroup) return
  
     const handler =(populatedConversation)=>{

   
      if(conversationIdRef.current === populatedConversation._id){
        queryClient.setQueryData(["Group",conversationId],(oldData)=>{
          if(!oldData) return oldData
     
        return { ...oldData,...populatedConversation}}
        )
        queryClient.setQueryData(["groups"],(oldData)=>{
          if(!oldData) return [populatedConversation]
        
            const filtered = oldData.filter(
    p => p._id.toString() !== populatedConversation._id.toString()
  );


  return [populatedConversation, ...filtered];
  
      })
      
    }
    }

    const MemberHandler =({groupId,participents})=>{

       if(conversationIdRef.current===groupId){
     
         queryClient.setQueryData(["Group",conversationId],(oldData)=>{
         if(!oldData) return oldData
        return { ...oldData,participents}}
        )
        
    
     
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
  },[socket,isGroup])

    const sendMessageToQueryUser=(message)=>{
queryclient.setQueryData(["messages",conversationId],(oldData)=>{
 if(!oldData) return oldData
 const newPages = [...oldData.pages]
  newPages[0].message.push(message)
  return {...oldData,pages:newPages}
})
  }
  const removeMemberhandler=(element)=>{
  const tempmessage = {
        _id: Date.now(),
        type: "system",
        text: `Admin removed ${element.name}`,
        createdAt: Date.now(),
         senderId: {
          _id: Me._id,
         
        },
      };
sendMessageToQueryUser(tempmessage)
    removeMember(element._id,tempmessage._id)
  }
  const addMemberhandler=(element)=>{
 
  const tempmessage = {
        _id: Date.now(),
        type: "system",
        text: `Admin added ${element.name}`,
        createdAt: Date.now(),
         senderId: {
          _id: Me._id,
         
        },
      };
  sendMessageToQueryUser(tempmessage)
    addMember(element._id,tempmessage._id)
  setAddUser(false);
      setSearchingAddUser(false)
  }
  const handleLeaveGroup=()=>{
    if(isDeletingGroup || isLeavingGroup) return
    isAdmin?deleteGroup():leaveGroup()
  }
  return isServerDown  ? (
    <NoServer></NoServer>
  ) : (
    <div>
    {!addUser &&  <div className="flex h-screen flex-col bg-[#F5F7FB] overflow-y-auto scrollbar-hide">
      <div className="flex justify-between m-2 p-2 mt-0">
        <div>
          {" "}
          <h2 className="text-2xl pt-2 font-medium">Group Info</h2>{" "}
        </div>
      </div>
      <div className="bg-white mx-3  rounded-2xl shadow">
      <div className="flex flex-col items-center justify-center my-2  ">
        <div className="my-2 py-2 relative">
          <input
            type="file"
            id="groupSettingsImage"
            accept="image/*"
            className="hidden"
            onChange={settingImagehandler}
          />
          {groupSettingsImage ? (
            <ArrowUpCircleIcon
              className={`w-9 h-9 right-2 bg-white shadow text-blue-900    cursor-pointer rounded-full bottom-3 absolute ${!isAdmin && "hidden"}`}
              onClick={() => {
             
                updateGroupImage(groupSettingsImage);
                setGroupSettingsImage(null);
              }}
            ></ArrowUpCircleIcon>
          ) : (
            <PencilIcon
              className={`w-9 h-9 right-2 bg-white border border-black  p-1.5 text-blue-900 ${!isAdmin && "hidden"}  cursor-pointer rounded-full bottom-3 absolute `}
              onClick={() => {
                document.getElementById("groupSettingsImage").click();
              }}
            ></PencilIcon>
          )}
          <img
          loading="lazy"
            className="w-28  shadow-md h-28 rounded-full border-white   border-4"
            src={
              groupSettingsImage
                ? URL.createObjectURL(groupSettingsImage)
                : selectedGroup?.avtar.url
            }
            alt=""
          />
        </div>
        <p className=" font-medium">{capitalizeFirstLetter(selectedGroup?.name)}</p>
      
      </div>
      <div className=" mt-2 mb-4 mx-6 px-2 text-sm text-[#8E949D]   ">
        Hey! I love connecting with new people and having meaningful conversations.

      </div></div>
    
          <div className="flex flex-col mx-3 mt-4 mb-20 ">
        <div className="flex justify-between ">
        <div className="flex font-medium  pt-2 pb-1">
          {" "}
          <UserGroupIcon className="w-6 font-medium mt-0.5  mx-2 h-6 text-black" />
          <div className=" text-xl">{selectedGroup?.participents?.length} Members</div></div>
        <div className="flex font-medium  pt-2 pb-1">
          {" "}
      
          <UserPlusIcon onClick={()=>{setAddUser(true)}} className={`w-5 font-medium mt-1.5 ${!isAdmin && "hidden"} mx-2 h-5 text-blue-500 cursor-pointer`} />
         
          </div>
          
          </div>
          <div className="">
         { selectedGroup && selectedGroup?.participents?.map((element) => {
             
                return (
                  
                  <div
                  key={element.user._id}
                   
                    className="flex   border-2   cursor-pointer rounded-2xl mt-1 bg-white  hover:bg-[#E6EBF5] p-0   xs:p-2"
                  >
                    
                    <div className="">
                       
                        <img
                        loading="lazy"
                          className="w-12 mt-1 h-10 rounded-full border-white border-2"
                          src={element.user.image.url}
                          alt=""
                        />
                      </div>
                    <div className="flex flex-col w-full justify-between py-1">
                      <div className="flex  flex-1 justify-between items-center pl-2 ">
                        <p className="font-small text-xs  xs:text-sm text-black">
                          {capitalizeFirstLetter(element.user.name)} {element.user._id === Me._id && "(You)"}
                        </p>
                    
                       
                       
                      </div>
                     {element.role=="admin" && <div className="text-xs px-2 text-blue-400">
                        Admin
                      </div>}
                     
                    </div>
                    <div className="flex items-center">
                      <UserMinusIcon className={`w-5 font-medium   h-5 text-red-500 cursor-pointer ${!isAdmin&& "hidden"}`} onClick={()=>{removeMemberhandler(element.user)}}/>
                    </div>
                  </div>
                );
              })} </div>
                 <div
                onClick={handleLeaveGroup}
              
                    className={`flex     border-2  cursor-pointer rounded-2xl mt-8 bg-white  hover:bg-[#E6EBF5]    xs:p-2 ${(isDeletingGroup || isLeavingGroup)&&"bg-[#e0e0e0]  "} `}
                  >
                    
                  
                    <div className={`flex flex-col w-full justify-between py-2 ${(isDeletingGroup || isLeavingGroup)&&"cursor-not-allowed"}`} >
                      <div className="flex  flex-1 justify-between items-center pl-2 ">
                        <p className={`font-small text-xs  xs:text-sm text-red-500  ${(isDeletingGroup || isLeavingGroup)&&"text-[#a0a0a0]"} `}>
                  {isAdmin?"Delete Group":"Exit Group"}
                        </p>
                    
                       
                       
                      </div>
                   
                     
                    </div>
                    <div className={`flex items-center ${(isDeletingGroup || isLeavingGroup)&&" cursor-not-allowed"}`}>
                      <TrashIcon className={`w-5 font-medium   h-5 text-red-500   ${(isDeletingGroup || isLeavingGroup)&&"text-[#a0a0a0] "} `} />
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
                {!searchingAddUser && chattedUsersList &&
              chattedUsersList.length !== 0 && chattedUsersList.map((element) => {
                const exist =selectedGroup.participents.some(p=>
                p.user._id === element.user._id
                )
               if(exist) return null
                return (
                  
                  <div
                  key={element.user._id}
                   
                    className="flex shadow  border-2   cursor-pointer rounded-2xl mt-2 bg-white  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                  >
                    
                    <div className="">
                       
                        <img
                        loading="lazy"
                          className="w-12 mt-1 h-10 rounded-full border-white border-2"
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
                     <div className="flex items-center">
                      <UserPlusIcon className="w-5 font-medium   h-5 text-blue-500 cursor-pointer" onClick={()=>{addMemberhandler(element.user)}}/>
                    </div>
                  </div>
                );
              })}
                {searchingAddUser && dataBaseUsers &&
              dataBaseUsers.length !== 0 && dataBaseUsers.map((element) => {
                const exist =selectedGroup.participents.some(p=>
                p.user._id === element._id
              
                )
               if(exist) return null
                return (
                  
                  <div
                  key={element._id}
                   
                    className="flex shadow  border-2   cursor-pointer rounded-2xl mt-2 bg-white  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                  >
                    
                    <div className="">
                       
                        <img
                        loading="lazy"
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
                      <UserPlusIcon className="w-5 font-medium   h-5 text-blue-500 cursor-pointer"onClick={()=>{addMemberhandler(element)}} />
                    </div>
                  </div>
                );
              })}

        </div>
          </div>
        </div>}
   
        </div>)

  
}
