import { EnvelopeIcon, LockClosedIcon ,UserIcon,PhoneIcon  } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
export default function SignUp() {
  return (
   <div className="h-screen flex justify-center items-center bg-[#F7F7FF]">
      <div className="">
        <div className=" my-5 flex text-3xl font-medium justify-center">
          <h1>ChatNova</h1>
        </div>
        <div className=" mb-5 mt-1  flex flex-col items-center">
          <h2 className="text-2xl pb-2 font-medium">Register</h2>{" "}
          <p>Get your ChatNova account now.</p>
        </div>

        <div className="px-7 pt-0 md:pt-2 md:pb-4  pb-1 bg-white w-[320px] sm:w-[450px] rounded-lg shadow-md ">
          <form action="" className="my-3 py-3">
            <div className="m-1 p-1 flex w-full flex-col">
              <label htmlFor="Login-email" className="pb-2">
                Email
              </label>
              <div className="flex items-center">
                <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">
                  <EnvelopeIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
                </div>
                <input
                  className="pl-2  h-[45px]  w-full border border-gray-300"
                  placeholder="   Enter your Email"
                  type="email"
                  name="Login-email"
                  id="Login-email"
                />
              </div>
            </div>
              <div className="m-1 p-1 flex w-full flex-col">
              <label htmlFor="Login-username" className="pb-2">
                Username
              </label>
              <div className="flex items-center">
                <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">
                  <UserIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
                </div>
                <input
                  className="pl-2  h-[45px]  w-full border border-gray-300"
                  placeholder="   Enter your Username"
                  type="text"
                  name="Login-username"
                  id="Login-username"
                />
              </div>
            </div>
              <div className="m-1 p-1 flex w-full flex-col">
              <label htmlFor="Login-email" className="pb-2">
                Phone number
              </label>
              <div className="flex items-center">
                <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">
                  <PhoneIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
                </div>
                <input
                  className=" h-[45px] pl-2 w-full border border-gray-300"
                  placeholder="   Enter your Number"
                  type="tel"
                  name="Login-phonenumber"
                  id="Login-phonenumber"
                />
              </div>
            </div>
            <div className="m-1 mb-4 p-1 w-full flex flex-col">
              <div className="flex justify-between">
                <label htmlFor="Login-password" className="pb-2">
                  Passoword
                </label>
               
              </div>
              <div className="flex items-center border border-gray-300">
                <div className="w-10 bg-[#F8F9FA] flex justify-center">
                  <LockClosedIcon className="w-7 px-1  h-[45px] text-gray-500" />
                </div>
                <input
                  type="password"
                  placeholder="    Enter your Password"
                  className=" pl-2  border border-gray-300 h-[45px]  w-full"
                  name="Login-password"
                  id="Login-password"
                />
              </div>{" "}
            </div>

            
            <div className="m-1 p-1">
              <input
                type="button"
                className="bg-[#7269EF] text-white w-full rounded-lg h-[42px] text-lg"
                value="Sign in"
              />
            </div>
          
          </form>
        </div>
        <div className="flex justify-center m-4">
          <div>
            <p>
              Already have an account?{" "}
              <Link className="text-blue-500" to="/"> Signup in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
