import {

  CheckIcon,

  MagnifyingGlassIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,

  UserGroupIcon,

} from "@heroicons/react/24/solid";

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AuthContext from "../Context/AuthContext";

import NoServer from "./NoServer";
import ChatNovaContext from "../Context/ChatNovaContext";
import UserItem from "./UserItem";

export default function CreateGroup() {

 
  const{searchUser,dataBaseUsers,createGroup,chattedUsersList,capitalizeFirstLetter}= useContext(ChatNovaContext)

  const {  isServerDown,showAlert,setActivePage } =  useContext(AuthContext);;
  const [groupImage, setGroupImage] = useState(null);
  

 const [addUser,setAddUser] = useState(false)
 const [searchingAddUser,setSearchingAddUser]=useState(false)

 const [selectedUsers,setSelectedUsers]=useState([])
 const [formData,setFormData]=useState({name:"",code:""})
const [preview , setPreview]=useState(null)
let pencilIconRef = useRef(null)
let imageRef =useRef(null)
 useEffect(()=>{
if(!groupImage) return
const url = URL.createObjectURL(groupImage)
setPreview(url)
return ()=> URL.revokeObjectURL(url)
 },[groupImage])


 const groupImagehandler = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    showAlert("Error", "Image size should be less than 10mb");
    return;
  }

  setGroupImage(file);
};

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

 const handleChange=({target:{name,value}})=>{
 setFormData((prev)=> ({...prev,[name]:value}))
 }
 
 

const validate = () => {
  if (!groupImage) return "Select a group image";
  if (formData.name.trim().length < 5) return "Group name must be ≥ 5 chars";
  if (formData.code.trim().length < 5) return "Invite code must be ≥ 5 chars";
  if (!selectedUsers.length) return "Select at least 1 user";
};



  const handleCreateGroup=()=>{

 const error = validate();
 if(error){
  showAlert("Error",error)
  return
 } 

    createGroup(selectedUsers,formData.name,formData.code,groupImage)
    setGroupImage(null)
     setFormData({ name: "", code: "" });
   setSelectedUsers([]);
setPreview(null);

  }
  const isSelected =(id)=>{
  return selectedUsers.some(p=>
                p.user ===id
              )
  }
const handleAddMember = (id) => {

  setSelectedUsers(prev => {
    if (prev.some(p => p.user === id)) return prev;

    return [...prev, { user: id, role: "member" }];
  });
};
  const handleRemoveMember =(id)=>{
    setSelectedUsers(prev=>
                      {
                        const filtered = prev.filter(p=>
                            p.user !==id
                        )
                        return filtered
                      }
                       
                      )
  }
    const normalizeItem = useCallback((element,type)=>{
      if(type==="chat"){
           return{
            element,
            name:element.user?.name,
            image:element.user?.image?.url,
            lastMessage:element.lastMessage,
             _id:element.user._id,
             unreadCount:element.unreadCount
           }
           
          }
          if(type==="search"){
          return{
             element,
           name:element.name,
           image:element.image?.url,
           lastMessage:null,
           _id:element._id,
           unreadCount:element.unreadCount
          }
          }
      
      
    },[])
  
    const NormalizedChattedUsers=useMemo(()=>chattedUsersList?.map((element)=>
      normalizeItem(element,"chat")

    ),[chattedUsersList,normalizeItem])
      const NormalizedDatabaseUsers=useMemo(()=>dataBaseUsers?.map((element)=>
    normalizeItem(element,"search")
  ),[dataBaseUsers,normalizeItem])
  return isServerDown ? (
    <NoServer></NoServer>
  ) : (
    <div>
    { <div className="flex h-screen flex-col bg-[#F5F7FB] overflow-y-auto scrollbar-hide">
      <div className="flex justify-between m-2 p-2 mt-0">
        <div>
      
          <h2 className="text-2xl pt-2 font-medium">Create Group</h2>
        </div>
      </div>
      <div className="bg-white mx-3  rounded-2xl shadow">
      <div className="flex flex-col items-center justify-center my-2  ">
        <div className="my-2 py-2 relative">
          <input
           ref={imageRef}
            type="file"
            id="GroupImage"
            accept="image/*"
            className="hidden"
            onChange={groupImagehandler}
          />
         
            <PencilIcon
            
              className={`w-9 h-9 right-2 bg-white border border-black  p-1.5 text-blue-900  cursor-pointer rounded-full bottom-3 absolute `}
              onClick={() => {
               imageRef.current.click()
              }}
            ></PencilIcon>
          
          <img
         
          loading="lazy"
          onClick={() => {
                imageRef.current.click()
              }}
            className="w-28  shadow-md h-28 rounded-full border-white   border-4"
            src={preview || ".././public/group-of-friends-sketch-vector-43422085.avif"}
            alt="Group Image"
          />
        </div>
       <form className="w-full px-6 pb-4 flex flex-col gap-4">


  <div className="flex flex-col">
    <label className="text-sm text-gray-500 mb-1" htmlFor="group-name">
      Group Name
    </label>
    <input
      type="text"
      onChange={handleChange}
      name="name"
      autoComplete="name"
      value={formData.name}
      id="group-name"
      placeholder="Enter group name..."
      className="px-4 py-2 rounded-xl border border-gray-300 bg-[#F9FAFA] 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 transition-all shadow-sm"
    />
  </div>

 
  <div className="flex flex-col">
    <label className="text-sm text-gray-500 mb-1" htmlFor="group-code">
      Invite Code
    </label>
    <input
      type="text"
      name="code"
           onChange={handleChange}
           value={formData.code}
      id="group-code"
      placeholder="Enter invite code..."
      className="px-4 py-2 rounded-xl border border-gray-300 bg-[#F9FAFA] 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 transition-all shadow-sm"
    />
  </div>

</form>
      </div>
      </div>
    
        { !addUser? <div className="flex flex-col mx-3 py-2 mt-4 mb-4  rounded-xl ">
        <div className="flex justify-between ">
        <div className="flex font-medium  pt-2 pb-1 mx-2">
          
          <UserGroupIcon className="w-6 font-medium mt-0.5  mx-2 h-6 text-black" />
          <div className=" text-xl">Add Members</div></div>
        <div className="flex font-medium  pt-2 pb-1">
      
      
          <MagnifyingGlassIcon onClick={()=>{setAddUser(true)}} className={`w-5 font-medium mt-1.5  mx-2 h-5 text-blue-500 cursor-pointer`} />
         
          </div>
          
          </div>
          <div className="">
       {NormalizedChattedUsers &&
              NormalizedChattedUsers?.length !== 0 && NormalizedChattedUsers?.map((element) => {
                
                return (
                  <UserItem user={element} key={element._id}  isSelected={isSelected(element._id)} onAdd={handleAddMember} onRemove={handleRemoveMember}  showActions={true} mode="select"></UserItem>
               
                );
              })} </div>
            

   
          
          </div>: 
    <div className={`h-screen  2xs:p-0 xs:p-1  lg:p-0 flex bg-white rounded-xl  m-3 mb-20 flex-col `}>
        
          <div className="flex p-2 pr-0 rounded-xl    mx-2 sm:mx-4 my-2 mt-6 bg-[#F9FAFA] border border-gray-300 ">
            <MagnifyingGlassIcon className="w-5 h-5 pt-1  text-gray-700 cursor-pointer" />
            <input
              type="search"
              className="w-full bg-[#F9FAFA]   outline-none pl-2"
              onChange={onChangeSearchAddUser}
              placeholder="Search messages or users"
              name="usersearch"
              id="usersearch"
            />
          </div>
        

          <div className="flex pt-2 flex-col pb-10  sm:p-2 sm:px-4 overflow-y-auto scrollbar-hide">
           
            <div className="">
                {searchingAddUser && NormalizedDatabaseUsers &&
              NormalizedDatabaseUsers?.length !== 0 && NormalizedDatabaseUsers?.map((element) => {
            
            
                return (
                                <UserItem user={element} key={element._id}  isSelected={isSelected(element._id)} onAdd={handleAddMember} onRemove={handleRemoveMember}  showActions={true} mode="select"></UserItem>

               
                );
              })}

        </div>
          </div>
        </div>}
     <button
     disabled={!selectedUsers.length}
     onClick={handleCreateGroup}
     className={`mx-3 flex justify-center items-center gap-2 mb-20 py-3 px-4 rounded-2xl font-semibold text-white shadow-md transition-all duration-200${selectedUsers.length ===0 ?"cursor-not-allowed bg-gray-400":" bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] hover:shadow-lg active:scale-95"}`}
     >
      <UserGroupIcon className="w-5 h-5"></UserGroupIcon>
      Create Group
<span className="">{selectedUsers.length}</span>
     </button>
    </div>}
   
   
        </div>)

  
}
