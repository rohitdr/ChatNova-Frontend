import { EnvelopeIcon ,LockClosedIcon } from "@heroicons/react/24/outline";
export default function Login() {
  return (
    <div className="h-screen flex justify-center items-center bg-[#F7F7FF]">
      <div className="">
      <div className=" my-5 flex text-3xl font-medium justify-center">
        <h1>ChatNova</h1>
      </div> 
      <div className=" my-5 flex flex-col items-center">
        <h2 className="text-2xl pb-2 font-medium">Sign in</h2> <p>Sign in to continue to ChatNova</p>
      </div>

      <div className="px-7 pt-1 md:pt-7  pb-4 bg-white w-[320px] sm:w-[450px] rounded-lg shadow-md ">
        <form action="" className="my-3 py-3">
          <div className="m-1 p-1 flex w-full flex-col">
            <label htmlFor="Login-email" className="pb-2">Email</label>
            <div className="flex items-center">
              <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">

                <EnvelopeIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
              </div>
            <input className=" h-[45px]  w-full border border-gray-300"  placeholder="   Enter your Email" type="email" name="Login-email" id="Login-email" />
            </div>
           
          </div>
          <div className="m-1 p-1 flex flex-col">
            <div className="flex justify-between">
                <label htmlFor="Login-password" className="pb-2">Passoword</label>
                 <p className="pb-2 text-gray-500"> Forget password? </p>
            </div>
          
             <div className="flex items-center border border-gray-300">
                   <div className="w-10 bg-[#F8F9FA] flex justify-center">
             <LockClosedIcon className="w-7 px-1  h-[45px] text-gray-500" /></div>
            <input type="password"  placeholder="    Enter your Password" className=" border border-gray-300 h-[45px]  w-full" name="Login-password" id="Login-password" />
          </div> </div>
         
          <div className="flex m-2 justify-between">
             <div className="m-1 p-1">
        
            <input
              type="checkbox"
              name="Login-remeberme"
              id="Login-remeberme"
              className=" accent-gray-400"
            />
             <label htmlFor="Login-remeberme " className="px-2">Remember me</label>
          </div>
            </div>
          <div className="m-1 p-1">
            <input type="button" className="bg-[#7269EF] text-white w-full rounded-lg h-[42px] text-lg" value="Sign in" />
          </div>
        </form>
      
      </div>
      <div className="flex justify-center m-4">
         <div>
          <p>Don't have an account? <a className="text-blue-500"> Signup now</a></p>
        </div>
      </div>
       
      </div>
    </div>
  );
}
