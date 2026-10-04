import  {  useState } from "react";
import {
 
  ChatBubbleOvalLeftEllipsisIcon,
  Cog6ToothIcon,
  PowerIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useMe } from "../features/users/hooks/UseMe";
import { NavLink, useLocation ,Link} from "react-router-dom";
import { useLogout } from "../features/auth/hooks/useLogout";

export default function SideBar() {
  const logout=useLogout()
  const location=useLocation()
  const {data:Me}=useMe()
  const isChatsRoute =
  location.pathname === "/" ||
  location.pathname.startsWith("/chat/");
  const isgroupRoute =
  location.pathname === "/group" ||
  location.pathname.startsWith("/group/");
  const [showMenu, setShowMenu] = useState(false);

const menuItems = [
  {
    id: 1,
    icon: UserIcon,
  path:"/profile",
    className: "md:w-9 w-6 h-6 sm:ml-12 lg:w-9 lg:h-9 lg:mb-4 mx-4 lg:mx-2",
  },
  {
    id: 0,
    icon:ChatBubbleOvalLeftEllipsisIcon ,
    path:"/",
    className: ` ${isChatsRoute? "text-blue-700":"text-black"} lg:w-9 sm:ml-12 w-7 h-7 md:w-9 md:h-9 2xs:mx-2 xs:mx-4 lg:my-2 lg:mx-2`,
  },
  {
    id: 2,
    icon: UsersIcon,
      path:"/group",
  
    className: `${isgroupRoute? "text-blue-700":"text-black"} lg:w-9 w-7 md:w-9 lg:my-2 h-7 md:h-9 sm:ml-12 mx-4 lg:mx-2`,
  },
  {
    id: 3,
    icon: Cog6ToothIcon,
      path:"/settings",
    className: "lg:w-9 md:w-9 w-7 sm:ml-12 lg:my-6 h-7 md:h-9 xs:mx-4 lg:mx-2",
  },
];
    const dropdownItems=[{
        id:1,
        action:() => {
                    setShowMenu(false);
                  },
                    path:"/profile",
        name:"Profile",
        Icon:UserIcon,
    },
   {
        id:2,
        action:() => {
                  setShowMenu(false);
                },
                  path:"/settings",
        name:"Settings",
        Icon:Cog6ToothIcon,
    },
  {
        id:3,
        action:async () => {
  await logout.mutateAsync();
  setShowMenu(false);
},
        name:"Logout",
        Icon:PowerIcon,
    }
]

  return (
    <>
      <div className={`2xs:h-14 xs:h-16 border border-black/20  shadow-2xl m-2 lg:shadow-none lg:m-0 lg:rounded-none  rounded-3xl lg:h-full lg:grid lg:grid-rows-[35%_55%_10%] lg:static bg-white z-50 fixed bottom-0 left-0 right-0 flex  justify-between lg:justify-center `}>
        <div className="flex items-start lg:items-start  mt-4 lg:justify-center lg:mb-2 justify-start">
          <img
          loading="lazy"
            src="/logo.png"
            alt="App Logo"
            className=" lg:h-14 lg:w-14 xs:w-10 xs:pb-1 h-8  xs:h-10 w-8 xs:ml-5  2xs:ml-3 2xs:h-7 2xs:w-7  lg:mx-0 rounded-full"
          />
        </div>
        <div className="flex lg:h-[20rem] h-full flex-row lg:flex-col items-center justify-between">

        
             {menuItems.map(({id,icon:Icon,className, path})=> {
               return <NavLink end to={path} className={({isActive})=>(isActive )?"text-blue-700":"text-black" } whileHover={{scale:1.05}} whileTap={{scale:0.95}} key={id} > <Icon  className={ `cursor-pointer ${className}`}  ></Icon></NavLink>
             })}
         
         
        </div>
        <div className="flex items-end lg:items-end lg:justify-center mb-4  justify-end ">
          <img
          loading="lazy"
            onClick={() => {setShowMenu(prev=>!prev)}}
            src={Me?.image?.url || "/logo.png"}
            alt="User Image"
            className=" 2xs:h-7 2xs:w-7 border-black cursor-pointer border-2 2xs:mr-2 xs:mr-5 lg:mx-0 lg:h-10 lg:w-10 h-8 w-8 xs:mb-1 rounded-full"
          />
        </div>
      </div>
<AnimatePresence>
      {showMenu && (
         <div
          className="fixed z-50 inset-0 bg-black/20"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          <motion.div
          initial={{opacity:0,scale:0}}
          animate={{opacity:1,scale:1}}
          exit={{opacity:0,scale:0}}
          transition={{duration:0.3}}
            className="fixed shadow-xl rounded-2xl  bg-white h-44 w-44 bottom-14 right-4 lg:bottom-14 lg:left-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {dropdownItems.map(({ id, name, Icon , action,path })=>(<div key={id} className="border rounded-2xl cursor-pointer  border-gray-50 hover:bg-slate-100"
               onClick={action}>
                <Link to={path}
                  className="flex m-4  mb-4 text-gray-700 justify-between font-medium"
                 
                >
                  <div>{name}</div>
                  <div>
                    <Icon className="w-4 h-4 mt-1.5 text-black cursor-pointer" />
                  </div>
                </Link>
              </div>))}



           
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </>
  );
}
