
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";

import { useMe } from "../features/users/hooks/UseMe";

import { useUpdateUser } from "../features/users/hooks/useUpdateUser";
import ChangePasswordForm from "../features/users/components/ChangePasswordForm";
import ChangeProfileForm from "../features/users/components/ChangeProfileForm";
import ProfileImageForm from "../features/users/components/ProfileImageForm";
export default function ProfileSettings() {


  const {data:Me}=useMe()
  const {  showAlert } = useContext(AuthContext);

const updateUser=useUpdateUser()



 
  return  (
  <div className="flex h-full flex-col bg-gradient-to-br from-[#EEF2F7] to-[#F8FAFC] overflow-y-auto scrollbar-hide mb-20">


  <div className="flex justify-between items-center px-6 py-4">
    <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
  </div>




  <ProfileImageForm user={Me} updateUser={updateUser}></ProfileImageForm>


 
<ChangeProfileForm user={Me} showAlert={showAlert} updateUser={updateUser}></ChangeProfileForm>

<ChangePasswordForm showAlert={showAlert}></ChangePasswordForm>
</div>
  );
}
