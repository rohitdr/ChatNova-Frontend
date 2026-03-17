import {
  ArrowUpCircleIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import NoServer from "./NoServer";
export default function Settings() {
  const authContext = useContext(AuthContext);
  const { user, updateUserImage, isServer } = authContext;
  const [settingsImage, setSettingsImage] = useState(null);
  const settingImagehandler = (e) => {
    setSettingsImage(e.target.files[0]);
  };
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <div className="flex h-full flex-col bg-[#F5F7FB]">
      <div className="flex justify-between m-2 p-2 mt-4">
        <div>
          {" "}
          <h2 className="text-2xl pt-2 font-medium">My Profile</h2>{" "}
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
                : user?.image.url
            }
            alt=""
          />
        </div>
        <p className="my-2 mb-1 font-medium">{user?.name}</p>
        <p>Active</p>
      </div>
      <div className="my-3 py-3 mx-3 px-2 text-sm text-[#8E949D]">
        Lorem ipsum dolor o aut quis laboriosam esse incidunt assumenda
        distinctio obcaecati eligendi ullam dolorum quibusdam, accusamus
        deserunt!
      </div>
      <div className="flex flex-col mx-3">
        <div className="flex font-medium bg-[#F9FAFA] pt-2 pb-3">
          {" "}
          <UserCircleIcon className="w-5 font-medium mt-1.5  mx-2 h-5 text-black" />
          <div className=" text-xl"> About</div>
        </div>
      </div>
    </div>
  );
}
