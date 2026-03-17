import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import NoServer from "./NoServer";
import AuthContext from "../Context/AuthContext";

export default function Login() {
  const context = useContext(AuthContext);

  const { login, isServer } = context;
  const [Emailerror, setEmailerror] = useState(false);
  const [passworderror, setPasswordError] = useState(false);
  const [data, setData] = useState({ loginEmail: "", loginPassword: "" });
  const onChangeHandler = (e) => {
    const array = Array.from(data);
    setData({ ...data, [e.target.name]: e.target.value });
    data.loginEmail.length < 5 ? setEmailerror(true) : setEmailerror(false);
    data.loginPassword.length < 7
      ? setPasswordError(true)
      : setPasswordError(false);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!Emailerror && !passworderror) {
      console.log(isServer)
      login(data.loginEmail, data.loginPassword);
      console.log(isServer)
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
        <div className=" my-5 flex flex-col items-center">
          <h2 className="text-2xl pb-2 font-medium">Sign in</h2>{" "}
          <p>Sign in to continue to ChatNova</p>
        </div>

        <div className="px-7 pt-1 md:pt-7  pb-4 bg-white w-[320px] sm:w-[450px] rounded-lg shadow-md ">
          <form onSubmit={submitHandler} className="my-3 py-2">
            <div className="m-1 p-1 flex w-full flex-col">
              <label htmlFor="loginEmail" className="pb-2">
                Email
              </label>
              <div className="flex items-center">
                <div className="w-10 flex justify-center border border-gray-300 bg-[#F8F9FA]">
                  <EnvelopeIcon className="w-7  px-1  h-[45px]  text-gray-500 " />
                </div>
                <input
                  className={`pl-2  h-[45px]  w-full border border-r-[0px]  outline-none ${Emailerror ? "border-red-600 " : "border-gray-300"}"`}
                  placeholder="   Enter your Email"
                  type="email"
                  name="loginEmail"
                  id="loginEmail"
                  onChange={onChangeHandler}
                />
                <div
                  className={`w-10  justify-center  ${Emailerror ? "block border border-red-500 border-l-[0px]" : "hidden"}`}
                >
                  <ExclamationCircleIcon className="w-7 px-1 h-[43px] text-red-600  " />
                </div>
              </div>
            </div>
            <div className="m-1  p-1 w-full flex flex-col">
              <div className="flex justify-between">
                <label htmlFor="loginPassword" className="pb-2">
                  Passoword
                </label>
                <p className="pb-2 text-gray-500"> Forget password? </p>
              </div>
              <div className="flex items-center border border-gray-300">
                <div className="w-10 bg-[#F8F9FA] flex justify-center">
                  <LockClosedIcon className="w-7 px-1  h-[45px] text-gray-500" />
                </div>
                <input
                  type="password"
                  placeholder="    Enter your Password"
                  className={`${passworderror ? "border-red-600 " : "border-gray-300"} pl-2 border-r-[0px] outline-none border  h-[45px]  w-full`}
                  name="loginPassword"
                  id="loginPassword"
                  onChange={onChangeHandler}
                />
                <div
                  className={`w-10  justify-center  ${passworderror ? "block border border-red-500 border-l-[0px]" : "hidden"}`}
                >
                  <ExclamationCircleIcon className="w-7 px-1 h-[43px] text-red-600  " />
                </div>
              </div>{" "}
            </div>

            <div className="m-1 mt-5  p-1">
              <input
                disabled={Emailerror || passworderror}
                type="submit"
                className={`bg-[#7269EF] cursor-pointer ${Emailerror || passworderror ? "text-gray-600" : "text-white"} w-full rounded-lg h-[42px] text-lg`}
                value="Sign in"
              />
            </div>
          </form>
        </div>
        <div className="flex justify-center m-4">
          <div>
            <p>
              Don't have an account?{" "}
              <Link className="text-blue-500" to="/SignUp">
                {" "}
                Signup now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
