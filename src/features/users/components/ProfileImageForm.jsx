import React, { useEffect, useRef, useState } from 'react'
import captalize from '../../../utils/captalise';
import { FaSpinner } from 'react-icons/fa6';
import { ArrowUpIcon, PencilIcon } from '@heroicons/react/24/solid';

export default function ProfileImageForm({user,updateUser}) {
    const imageRef =useRef(null)
      const [settingsImage, setSettingsImage] = useState(null);
const [preview,setPreview]=useState(null)
   
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if(!file) return
    setSettingsImage(file);
  };

  useEffect(()=>{
    if(!settingsImage) return
    const url = URL.createObjectURL(settingsImage)
    setPreview(url)
    return ()=> URL.revokeObjectURL(url)
  },[settingsImage])
 const handleImageUpdate=()=>{
  updateUser.mutate({data:{},file:settingsImage},{
    onSuccess: () => {
   setSettingsImage(null);
              setPreview(null)
    },
  })

         
 }
  return (
     <div className="mx-4 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
    
    <div className="relative">
    {updateUser.isPending &&<FaSpinner className=" absolute inset-0 animate-spin text-black w-5 h-5"></FaSpinner>}
      <input
      ref={imageRef}
        type="file"
        id="settingsImage"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

    
      <img
        loading="lazy"
        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
        src={preview|| user?.image?.url}
        alt="User"
      />


      {settingsImage ? (
        <ArrowUpIcon
          className="w-8 h-8 p-1.5 bg-blue-600 text-white rounded-full shadow absolute bottom-1 right-1 cursor-pointer hover:bg-blue-700 transition"
          onClick={handleImageUpdate}
        />
      ) : (
        <PencilIcon
          className="w-8 h-8 p-1.5 bg-white border shadow rounded-full absolute bottom-1 right-1 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => {
            imageRef.current.click()
          }}
        />
      )}
    </div>

    <p className="mt-4 text-lg font-semibold text-gray-800">
      {captalize(user?.name)}
    </p>

    <p className="text-sm text-gray-500">@{user?.username}</p>
  </div>
  )
}
