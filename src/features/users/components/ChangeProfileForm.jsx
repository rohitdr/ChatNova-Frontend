import { useEffect, useState } from "react"
import { validateUserForm } from './../services/validateUser';
import { PencilIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FaSpinner } from "react-icons/fa6";

export default function ChangeProfileForm({user,showAlert,updateUser}) {

      const [originaldata,setOriginalData]=useState(null)
      const [editMenu,setEditMenu]=useState(false)
   const [formData, setFormData] = useState({
  phone_number: "",
  email: "",
  name: "",
  username: "",
});
        const handleChange=({target:{name,value}})=>{
    setFormData(prev=>({...prev,[name]:value}))
  }
 
 useEffect(() => {
  if (!user) return;

  const initial = {
    phone_number: user.phone_number ?? "",
    email: user.email ?? "",
    name: user.name ?? "",
    username: user.username ?? "",
  };

  setFormData(initial);
  setOriginalData(initial);
}, [user]);
   const handleUpdate = (e) => {
     e.preventDefault();
     const { error, payload } = validateUserForm(formData,originaldata);
   
     if (error) {
       showAlert("Error", error);
       return;
     }
  updateUser.mutate(
  { data: payload },
  {
    onSuccess: () => {
      setOriginalData({ ...formData });
      setEditMenu(false);
    },
  }
);
   };
   
    const isChanged =formData && originaldata && JSON.stringify(formData) !== JSON.stringify(originaldata) 
  return (
    <div className="mx-4 mt-4">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <UserCircleIcon className="w-5 h-5 text-gray-700 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">About</h3>
      </div>

      {!editMenu ? (
        <PencilIcon
          className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => setEditMenu(true)}
        />
      ) : (
        <XMarkIcon
          className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => setEditMenu(false)}
        />
      )}
    </div>

  
    {!editMenu && (
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {[
          { label: "Name", value: user?.name },
          { label: "Email", value: user?.email },
          { label: "Username", value: user?.username },
          { label: "Phone", value: user?.phone_number },
        ].map((item, i) => (
          <div key={i} className="p-4 hover:bg-gray-50 transition">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    )}

  
    {editMenu && (
      <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-sm p-4 space-y-4">

        {[
          { name: "name", type: "text"},
          { name: "email", type: "email" },
          { name: "username", type: "text"},
          { name: "phone_number", type: "tel" },
        ].map((field, i) => (
          <input
            key={i}
    
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={`Enter ${field.name}`}
            className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
          />
        ))}

        <div className="flex justify-end">
          <button
          disabled={!isChanged || updateUser.isPending}
           className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50">
           {updateUser.isPending ? <FaSpinner className="animate-spin w-5 h-5 text-white"></FaSpinner>:"Update"} 
          </button>
        </div>
      </form>
    )}
  </div>
  )
}
