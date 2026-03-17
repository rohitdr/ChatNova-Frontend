import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";

export default function SignUp() {
  const [data, setData] = useState({
    signUpEmail: "",
    signUpPassword: "",
    signUpUsername: "",
  });
  const [emailerror, setemailError] = useState(false);
  const [passworderror, setPasswordError] = useState(false);
  const [usernameerror, setUsernameError] = useState(false);
  const authcontext = useContext(AuthContext);
  const { signUp, isServer } = authcontext;
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    data.signUpEmail.length < 8 ? setemailError(true) : setemailError(false);
    data.signUpPassword.length < 8
      ? setPasswordError(true)
      : setPasswordError(false);
    data.signUpUsername.length < 8
      ? setUsernameError(true)
      : setUsernameError(false);
  };
  const handlerSubmit = (e) => {
    e.preventDefault();
    if (!emailerror && !passworderror && !usernameerror) {
      signUp(data.signUpEmail, data.signUpPassword, data.signUpUsername);
    }
  };
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
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
          <form onSubmit={handlerSubmit} className="my-3 py-3">
            <div className="m-1 p-1 flex w-full flex-col">
              <label htmlFor="signUpEmail" className="pb-2">
                Email
              </label>
              <div className="flex items-center">
                <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">
                  <EnvelopeIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
                </div>
                <input
                  className={`pl-2  border outline-none  h-[45px] ${emailerror ? "border-red-700 border-2" : "border-gray-300"}  w-full`}
                  placeholder="   Enter your Email"
                  type="email"
                  name="signUpEmail"
                  id="signUpEmail"
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="m-1 p-1 flex w-full flex-col">
              <label htmlFor="signUpUsername" className="pb-2">
                Username
              </label>
              <div className="flex items-center">
                <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">
                  <UserIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
                </div>
                <input
                  className={`pl-2 outline-none  border  h-[45px] ${usernameerror ? "border-red-700 border-2" : "border-gray-300"}  w-full`}
                  placeholder="   Enter your Username"
                  type="text"
                  name="signUpUsername"
                  id="signUpUsername"
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="m-1 mb-4 p-1 w-full flex flex-col">
              <div className="flex justify-between">
                <label htmlFor="signUpPassword" className="pb-2">
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
                  className={`pl-2  outline-none border  h-[45px] ${passworderror ? "border-red-700 border-2" : "border-gray-300"}  w-full`}
                  name="signUpPassword"
                  id="signUpPassword"
                  onChange={onChange}
                />
              </div>{" "}
            </div>

            <div className="m-1 p-1">
              <input
                disabled={emailerror || passworderror || usernameerror}
                type="submit"
                className={`bg-[#7269EF] cursor-pointer  w-full rounded-lg h-[42px] text-lg ${emailerror || passworderror || usernameerror ? "text-gray-700" : "text-white"}`}
                value="Sign in"
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
                Signup in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
