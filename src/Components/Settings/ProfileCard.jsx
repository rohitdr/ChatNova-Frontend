import {
  ArrowUpIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

export default function ProfileCard({
  user,
  image,
  onImageChange,
  onUpload,
  formatName,
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

 
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    onUpload(image);
  };

  return (
    <div className="mx-4 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
      
      <div className="relative">
      
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => onImageChange(e.target.files[0])}
        />

     
        <img
          loading="lazy"
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          src={preview || user?.image?.url}
          alt="Profile"
        />

      
        {image ? (
          <ArrowUpIcon
            className="w-8 h-8 p-1.5 bg-blue-600 text-white rounded-full shadow absolute bottom-1 right-1 cursor-pointer hover:bg-blue-700 transition"
            onClick={handleUpload}
          />
        ) : (
          <PencilIcon
            className="w-8 h-8 p-1.5 bg-white border shadow rounded-full absolute bottom-1 right-1 cursor-pointer hover:bg-gray-100 transition"
            onClick={handleSelectImage}
          />
        )}
      </div>

   
      <p className="mt-4 text-lg font-semibold text-gray-800">
        {formatName(user?.name || "")}
      </p>

      <p className="text-sm text-gray-500">
        @{user?.username}
      </p>
    </div>
  );
}