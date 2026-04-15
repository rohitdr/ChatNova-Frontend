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
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
import ChatNovaContext from "../Context/ChatNovaContext";
import { useQueryClient } from "@tanstack/react-query";
import UserItem from "./UserItem";
import useDebounce from "./Hooks/Debouncer";
import UserSkeleton from "./UserSkeleton";

export default function GroupInfo() {


  const{searchUser,addMember,isAdmin,isGroup,deleteGroup,leaveGroup,queryClient,selectedGroup,dataBaseUsers,removeMember,conversationId,updateGroupImage,chattedUsersList,capitalizeFirstLetter,isDeletingGroup,isLeavingGroup,isSearchLoading}=useContext(ChatNovaContext)
  const [searchValue,setSearchValue]=useState("")
  const {  isServerDown,Me} =  useContext(AuthContext);
  const [image, setImage] = useState(null);
const [preview,setPreview]=useState(null)
const imageRef =useRef(null)
  const {socket}= useContext(SocketContext)
 const [addUser,setAddUser] = useState(false)
 const [searchingAddUser,setSearchingAddUser]=useState(false)
 const conversationIdRef=useRef(conversationId)
const queryclient = useQueryClient();
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if(!file) return
    setImage(file);
  };
    useEffect(()=>{
    if(!image) return
    const url = URL.createObjectURL(image)
    setPreview(url)
    return ()=> URL.revokeObjectURL(url)
  },[image])

  const handleUploadImage =()=>{

                updateGroupImage(image);
                setImage(null);
          setPreview(null)
  }

  const onChangeSearchAddUser = (e) => {
    let value = e.target.value;
setSearchValue(value)
    if (value.length === 0) {
      setAddUser(false);
      setSearchingAddUser(false)
      
    } else {
      setAddUser(true);
      setSearchingAddUser(true)
    
    }
  };
   const debounceSearch = useDebounce(searchValue,400)
  const lastValue = useRef("");
  useEffect(() => {
  if (
    debounceSearch.trim().length > 2 &&
    debounceSearch !== lastValue.current
  ) {
    lastValue.current = debounceSearch;
    searchUser(debounceSearch);
  }
}, [debounceSearch, searchUser]);
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
     queryClient.invalidateQueries(["Group",conversationId])
    }

    const MemberHandler =({groupId,participents})=>{

       if(conversationIdRef.current===groupId){
     
         queryClient.setQueryData(["Group",conversationId],(oldData)=>{
         if(!oldData) return oldData
        return { ...oldData,participents}}
        )

       }
       queryClient.invalidateQueries(["Group",conversationId])
    }
   
    socket.on("member_added",MemberHandler)
    socket.on("group_update", handler)
     socket.on("remove_member",MemberHandler)
   return ()=>{
      socket.off("group_update", handler)
      socket.off("member_added",MemberHandler)
      socket.off("remove_member",MemberHandler)
   }
  },[socket,isGroup,queryClient,conversationId])

    const sendMessageToQueryUser=(message)=>{
queryclient.setQueryData(["messages",conversationId],(oldData)=>{
 if(!oldData) return oldData
 const newPages = [...oldData.pages]
 newPages[0] = {
  ...newPages[0],
  message: [message, ...newPages[0].message],
};
  return {...oldData,pages:newPages}
})
  }
  const createSystemMessage =useCallback((name,messageType)=>{
return {
        _id: Date.now(),
        type: "system",
        text: `Admin ${messageType} ${name}`,
        createdAt: Date.now(),
         senderId: {
          _id: Me?._id,
         
        },
      };
  },[Me?._id])
  const removeMemberhandler=useCallback((id,name)=>{
 
  const tempmessage = createSystemMessage(name,"removed")
sendMessageToQueryUser(tempmessage)
    removeMember(id,tempmessage._id)
  },[removeMember,createSystemMessage])
  const addMemberhandler=useCallback((id,name)=>{
  const tempmessage = createSystemMessage(name,"added")
  sendMessageToQueryUser(tempmessage)
    addMember(id,tempmessage._id)
  setAddUser(false);
      setSearchingAddUser(false)
  },[addMember,createSystemMessage])
  const handleLeaveGroup=()=>{
    if(isDeletingGroup || isLeavingGroup) return
    isAdmin?deleteGroup():leaveGroup()
  }

   const normalizeItem = useCallback((element,type)=>{
        if(type==="chat"){
             return{
              element,
              name:element.user?.name,
              image:element.user?.image?.url,
         
               _id:element.user._id,
           
             }
             
            }
            if(type==="search"){
            return{
               element,
             name:element.name,
             image:element.image?.url,
        
             _id:element._id,
         
            }
            }
        
        
      },[])
      
  
        
const NormalizedSelectedGroup=useMemo(()=>{
if(!selectedGroup) return
  return selectedGroup.participents?.map((element)=>
  
        normalizeItem(element,"chat")


  
      )},[selectedGroup,normalizeItem])
     const NormalizedChattedUsers=useMemo(()=>chattedUsersList?.map((element)=>
    normalizeItem(element,"chat")

  ),[chattedUsersList,normalizeItem])
    
   
        const NormalizedDatabaseUsers=useMemo(()=>dataBaseUsers?.map((element)=>
      normalizeItem(element,"search")
    ),[dataBaseUsers,normalizeItem])
    const isSelectedUser=useMemo(()=>(id)=>{
return selectedGroup?.participents?.some(p=>
                p.user._id === id
                )
    },[selectedGroup])
  return isServerDown  ? (
    <NoServer></NoServer>
  ) : (
    <div>
    
    {!addUser &&  <div className="flex h-screen flex-col bg-[#F5F7FB] overflow-y-auto scrollbar-hide">
      <div className="flex justify-between m-2 p-2 mt-0">
        <div>
        
          <h2 className="text-2xl pt-2 font-medium">Group Info</h2>{" "}
        </div>
      </div>
      <div className="bg-white mx-3  rounded-2xl shadow">
      <div className="flex flex-col items-center justify-center my-2  ">
        <div className="my-2 py-2 relative">
          <input
          ref={imageRef}
            type="file"
            id="groupSettingsImage"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {image ? (
            <ArrowUpCircleIcon
              className={`w-9 h-9 right-2 bg-white shadow text-blue-900    cursor-pointer rounded-full bottom-3 absolute ${!isAdmin && "hidden"}`}
              onClick={handleUploadImage}
            ></ArrowUpCircleIcon>
          ) : (
            <PencilIcon
              className={`w-9 h-9 right-2 bg-white border border-black  p-1.5 text-blue-900 ${!isAdmin && "hidden"}  cursor-pointer rounded-full bottom-3 absolute `}
              onClick={() => {
                imageRef.current.click();
              }}
            ></PencilIcon>
          )}
          <img
          loading="lazy"
            className="w-28  shadow-md h-28 rounded-full border-white   border-4"
            src={preview || selectedGroup?.avtar.url
            }
            alt="Group Image"
          />
        </div>
        <p className=" font-medium">{capitalizeFirstLetter(selectedGroup?.name)}</p>
      
      </div>
     </div>
    
          <div className="flex flex-col mx-3 mt-4 mb-20 ">
        <div className="flex justify-between ">
        <div className="flex font-medium  pt-2 pb-1">
      
          <UserGroupIcon className="w-6 font-medium mt-0.5  mx-2 h-6 text-black" />
          <div className=" text-xl">{selectedGroup?.participents?.length} Members</div></div>
        <div className="flex font-medium  pt-2 pb-1">
     
      
          <UserPlusIcon onClick={()=>{setAddUser(true)}} className={`w-5 font-medium mt-1.5 ${!isAdmin && "hidden"} mx-2 h-5 text-blue-500 cursor-pointer`} />
         
          </div>
          
          </div>
          <div className="">
         { NormalizedSelectedGroup && NormalizedSelectedGroup?.map((element) => {
             
                return (
                     <UserItem user={element} key={element._id}     onRemove={removeMemberhandler}   mode="groupRemove"></UserItem>
                
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
                {!searchingAddUser && NormalizedChattedUsers &&
              NormalizedChattedUsers.length !== 0 && NormalizedChattedUsers.map((element) => {
                const exist =isSelectedUser(element._id)
               if(exist) return null
                return (
                     <UserItem user={element} key={element._id} onAdd={addMemberhandler}   mode="groupAdd"></UserItem>
                 

                );
              })}
                {searchingAddUser && !isSearchLoading && NormalizedDatabaseUsers &&
              NormalizedDatabaseUsers.length !== 0 && NormalizedDatabaseUsers.map((element) => {
                const exist =isSelectedUser(element._id)
               if(exist) return null
                return (
                       <UserItem user={element} key={element._id} onAdd={addMemberhandler}   mode="groupAdd"></UserItem>
               
                );
              })}
              {(isSearchLoading )&&[...Array(10)].map((_,i)=><UserSkeleton key ={i} send={i%2===0}></UserSkeleton>) }

        </div>
          </div>
        </div>}
   
        </div>)

  
}
