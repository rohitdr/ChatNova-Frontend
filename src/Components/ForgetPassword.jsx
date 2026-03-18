import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
export default function ForgetPassword() {
  const [data, setData] = useState({
    forgetEmail: "",
    forgetPassword: "",
    forgetUsername: "",
  });

  const authcontext = useContext(AuthContext);
  const { forgetPassword, isServer,showAlert } = authcontext;
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  
  };
  const handlerSubmit = (e) => {
    e.preventDefault();

   if( data.forgetEmail.length<8){
   showAlert("Warning","Email should be of length 8")
   }
   else if(data.forgetPassword.length<8){
       showAlert("Warning","Password should be of length 8")
   }
   else if( data.forgetUsername.length<8){
   showAlert("Warning","Username should be of length 8")
   }
 else{
  forgetPassword(data.forgetEmail,data.forgetPassword,data.forgetUsername)
    setData({
    forgetEmail: "",
    forgetPassword: "",
    forgetUsername: "",
  });
    }
  };
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <div className="h-screen flex justify-center items-center bg-[#F7F7FF]">
      <div className="">
        <div className=" my-5 flex text-3xl font-medium justify-center">
         <img
            src="https://res.cloudinary.com/do2twyxai/image/upload/v1773486472/ChatGPT_Image_Mar_14_2026_04_35_32_PM_owgv9l.png"
            alt=""
            className=" lg:h-12 lg:w-14 xs:w-10 xs:pb-1 h-8  xs:h-8 w-8 xs:ml-5  2xs:ml-3 2xs:h-7 2xs:w-7  lg:mx-0 rounded-full"
          />  <h1>ChatNova</h1>
        </div>
        <div className=" mb-5 mt-1  flex flex-col items-center">
          <h2 className="text-2xl pb-2 font-medium">Forget Password</h2>{" "}
      
        </div>

        <div className="px-7 pt-0 md:pt-2 md:pb-4  pb-1 bg-white w-[320px] sm:w-[450px] rounded-lg shadow-md ">
          <form onSubmit={handlerSubmit} className="my-3 py-3">
            <div className="m-1 p-1 flex w-full flex-col">
              <label htmlFor="forgetEmail" className="pb-2">
                Email
              </label>
              <div className="flex items-center">
                <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">
                  <EnvelopeIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
                </div>
                <input
                  className={`pl-2  border outline-none  h-[45px]  border-gray-300  w-full`}
                  placeholder="   Enter your Email"
                  type="email"
                  name="forgetEmail"
                  id="forgetEmail"
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="m-1 p-1 flex w-full flex-col">
              <label htmlFor="forgetUsername" className="pb-2">
                Username
              </label>
              <div className="flex items-center">
                <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">
                  <UserIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
                </div>
                <input
                  className={`pl-2 outline-none  border  h-[45px] border-gray-300  w-full`}
                  placeholder="   Enter your Username"
                  type="text"
                  name="forgetUsername"
                  id="forgetUsername"
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="m-1 mb-4 p-1 w-full flex flex-col">
              <div className="flex justify-between">
                <label htmlFor="forgetPassword" className="pb-2">
                 New Passoword
                </label>
              </div>
              <div className="flex items-center border border-gray-300">
                <div className="w-10 bg-[#F8F9FA] flex justify-center">
                  <LockClosedIcon className="w-7 px-1  h-[45px] text-gray-500" />
                </div>
                <input
                  type="password"
                  placeholder="    Enter your Password"
                  className={`pl-2  outline-none border  h-[45px] border-gray-300  w-full`}
                  name="forgetPassword"
                  id="forgetPassword"
                  onChange={onChange}
                />
              </div>{" "}
            </div>
            <div className="m-1 p-1">
              <input
              
                type="submit"
                className={`bg-[#7269EF] cursor-pointer  w-full rounded-lg h-[42px] text-lg text-white`}
                value="Change Password"
              />
            </div>
          </form>
        </div>
        <div className="flex justify-center m-4">
          <div>
            <p>
              Already have an account?{" "}
              <Link className="text-blue-500" to="/login">
                {" "}
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
