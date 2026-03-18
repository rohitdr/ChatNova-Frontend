
import {
  ArrowUpCircleIcon,
  
  PencilIcon,
} from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";

import NoServer from "./NoServer";
import { useNavigate } from "react-router-dom";

export default function AdditonalDeatils() {
    let Navigate=useNavigate()

  const authContext = useContext(AuthContext);
  const {  updateUserImage, isServer,showAlert ,updateUser} = authContext;
  const [settingsImage, setSettingsImage] = useState(null);
  const [data,setData]=useState({signUpPhoneNumber:"",signUpName:""})

 
  const settingImagehandler = (e) => {
    setSettingsImage(e.target.files[0]);
  };
  const onChangeHandler=(e)=>{
    setData({...data,[e.target.name]:e.target.value})
  }
  const handleUpdate=(e)=>{

    e.preventDefault()

    if(data.signUpName.length<3 || data.signUpName.length>20 ){
      showAlert("Warning","Name should be between length 3 to 20")
    }
    else if(String(data.signUpPhoneNumber).trim().length !==10){
     showAlert("Warning","Phone number should be of length 10")
    }
    else if(Object.keys(data).length===0){
         showAlert("Warning","Please Update anything to change the data")
    }
    else{
  
updateUser({name:data.signUpName,phone_number:data.signUpPhoneNumber})

Navigate('/')

    }



  }



  return (
    <div>
    
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center "
        >
               <div className="flex object-contain md:w-[50%] lg:w-[600px] flex-col bg-[#F5F7FB]  shadow-lg rounded-xl">
      <div className="flex justify-between m-2 p-2 mt-4 text-center">
        <div>
          {" "}
          <h2 className="text-2xl pt-2 font-medium">Additional Infromation</h2>{" "}
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
            className="w-28  shadow h-28 rounded-full   border-2"
            src={
              settingsImage
                ? URL.createObjectURL(settingsImage)
                : "https://res.cloudinary.com/do2twyxai/image/upload/v1773586565/oje7kknlxwfgylu9wwxh.jpg"
            }
            alt=""
          />
        </div>
  
  
      </div>
    
      {/* form to update users information */}
    <div className="flex flex-col mx-3 mb-2">
        <div className="flex justify-between">
       
        
          </div>

       <> <form onSubmit={handleUpdate}><div className="flex flex-col mx-0.5  py-3 bg-[#FFFFFF]">
       
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A] ">Name</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="text" name="signUpName"  value={data.signUpName} id="signUpName" onChange={onChangeHandler}/></div></div>
 
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Phone Number</div> <div className="text-sm py-1 font-medium"><input className="outline-none bg-[#F9FAFA] h-8 p-1 w-full" type="tel" name="signUpPhoneNumber" value={data.signUpPhoneNumber} id="signUpPhoneNumber" onChange={onChangeHandler}/></div></div>
     
          
          
          </div>
               <div className="flex ">
        <div className="flex font-normal w-full pt-2 pb-3 justify-end"> 
        <div className="p-2 pt-3"><button type="button" className="shadow rounded p-2 w-16 text-white bg-yellow-500" onClick={()=>{Navigate('/')}}>Skip</button></div>
        <div className="p-2 pt-3"><button type="submit"  className="shadow rounded p-2 w-16 text-white bg-[#6159CB]">Add</button></div>
         
      </div>
          </div>
         
          </form></> 
          
          </div>
       
    </div>
        
        </div>
    </div>
  )
}
