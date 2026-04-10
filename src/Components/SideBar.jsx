import  { useContext, useState } from "react";
import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  PowerIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/solid";
import AuthContext from "../Context/AuthContext";
import ChatNovaContext from "../Context/ChatNovaContext";
export default function SideBar() {
  const {setIsGroup} =useContext(ChatNovaContext)
  const { logout, Me, setActivePage, activePage } = useContext(AuthContext);;
  const [showMenu, setShowMenu] = useState(false);
  const logoutHandler = () => {
    logout();
  };
const menuItems = [
  {
    id: 1,
    icon: UserCircleIcon,
    action: () => setActivePage(1),
    className: "md:w-9 w-7 h-7 sm:ml-12 lg:w-9 lg:h-9 lg:mb-4 mx-4 lg:mx-2",
  },
  {
    id: 0,
    icon: ChatBubbleLeftRightIcon,
    action: () => {
      setIsGroup(false);
      setActivePage(0);
    },
    className: "lg:w-9 sm:ml-12 w-7 h-7 md:w-9 md:h-9 2xs:mx-2 xs:mx-4 lg:my-2 lg:mx-2",
  },
  {
    id: 2,
    icon: UserGroupIcon,
    action: () => setActivePage(2),
    className: "lg:w-9 w-7 md:w-9 lg:my-2 h-7 md:h-9 sm:ml-12 mx-4 lg:mx-2",
  },
  {
    id: 3,
    icon: Cog8ToothIcon,
    action: () => setActivePage(3),
    className: "lg:w-9 md:w-9 w-7 sm:ml-12 lg:my-6 h-7 md:h-9 xs:mx-4 lg:mx-2",
  },
];
    const dropdownItems=[{
        id:1,
        action:() => {
                    setActivePage(1);
                    setShowMenu(false);
                  },
        name:"Profile",
        Icon:UserCircleIcon,
    },
   {
        id:2,
        action:() => {
                  setActivePage(3);
                  setShowMenu(false);
                },
        name:"Settings",
        Icon:Cog6ToothIcon,
    },
  {
        id:3,
        action:() => {
  logoutHandler();
  setShowMenu(false);
},
        name:"Logout",
        Icon:PowerIcon,
    }
]
  return (
    <>
      <div className={`2xs:h-14 xs:h-16 lg:h-full lg:grid lg:grid-rows-[35%_55%_10%] lg:static bg-white z-50 fixed bottom-0 left-0 right-0 flex  justify-between lg:justify-center `}>
        <div className="flex items-start lg:items-start  mt-4 lg:justify-center lg:mb-2 justify-start">
          <img
          loading="lazy"
            src="https://res.cloudinary.com/do2twyxai/image/upload/v1773486472/ChatGPT_Image_Mar_14_2026_04_35_32_PM_owgv9l.png"
            alt="App Logo"
            className=" lg:h-10 lg:w-14 xs:w-10 xs:pb-1 h-8  xs:h-8 w-8 xs:ml-5  2xs:ml-3 2xs:h-7 2xs:w-7  lg:mx-0 rounded-full"
          />
        </div>
        <div className="flex lg:h-[20rem] h-full flex-row lg:flex-col items-center justify-between">

        
             {menuItems.map(({id,icon:Icon,action,className})=> {
               return <div key={id}> <Icon  className={`cursor-pointer ${className} ${
      activePage === id ? "text-blue-700" : "text-black"
    }`} onClick={action} ></Icon></div>
             })}
         
         
        </div>
        <div className="flex items-end lg:items-end lg:justify-center mb-4  justify-end ">
          <img
          loading="lazy"
            onClick={() => {setShowMenu(prev=>!prev)}}
            src={Me?.image?.url || "https://via.placeholder.com/150"}
            alt="User Image"
            className=" 2xs:h-7 2xs:w-7 border-black cursor-pointer border-2 2xs:mr-2 xs:mr-5 lg:mx-0 lg:h-10 lg:w-10 h-8 w-8 xs:mb-1 rounded-full"
          />
        </div>
      </div>

      {showMenu && (
         <div
          className="fixed z-50 inset-0 bg-black/20"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          <div
            className="fixed shadow-xl   bg-white h-44 w-44 bottom-14 right-4 lg:bottom-14 lg:left-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {dropdownItems.map(({ id, name, Icon, action })=>(<div key={id} className="border cursor-pointer  border-gray-50 hover:bg-slate-100"
               onClick={action}>
                <div
                  className="flex m-4  mb-4 text-gray-700 justify-between font-medium"
                 
                >
                  <div>{name}</div>
                  <div>
                    <Icon className="w-4 h-4 mt-1.5 text-black cursor-pointer" />
                  </div>
                </div>
              </div>))}



           
          </div>
        </div>
      )}
    </>
  );
}
