import React from 'react'
import {

  PencilIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
export default function Edit({editMenu,setEditMenu,Me,handleUpdate,formData,onChangeHandler}) {
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
          { label: "Name", value: Me?.name },
          { label: "Email", value: Me?.email },
          { label: "Username", value: Me?.username },
          { label: "Phone", value: Me?.phone_number },
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
          { name: "name", type: "text" },
          { name: "email", type: "email" },
          { name: "username", type: "text" },
          { name: "phone_number", type: "tel" },
        ].map((field, i) => (
          <input
            key={i}
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={onChangeHandler}
            placeholder={field.name.replace("_", " ")}
            className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition"
          />
        ))}

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Update
          </button>
        </div>
      </form>
    )}
  </div>
  )
}
