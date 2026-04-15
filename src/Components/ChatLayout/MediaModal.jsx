import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";


export default function MediaModal({setMediaSendModal,uploadedVideo,uploadedImage,setUploadedImage,handleUploadImage,setUploadedVideo,handleUploadVideo}) {
const [preview, setPreview] = useState(null);

useEffect(() => {
  const file = uploadedImage || uploadedVideo;
  if (!file) return;

  const url = URL.createObjectURL(file);
  setPreview(url);

  return () => URL.revokeObjectURL(url);
}, [uploadedImage, uploadedVideo]);
useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") setMediaSendModal(false);
  };

  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, [setMediaSendModal]);
useEffect(() => {
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      if (uploadedImage) handleUploadImage();
      if (uploadedVideo) handleUploadVideo();
    }
  };

  window.addEventListener("keydown", handleEnter);
  return () => window.removeEventListener("keydown", handleEnter);
}, [uploadedImage, uploadedVideo]);
  return (
     <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center "
          onClick={() => {
            setMediaSendModal(false);
          }}
        >
          <div
            className="fixed shadow-xl "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {uploadedImage && (
              <div>
                <img
                  loading="lazy"
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
                  src={preview}
                  alt="image"
                />
                <XMarkIcon
                  className="h-8 w-8 absolute cursor-pointer top-6 right-6 text-white"
                  onClick={() => {
                    setMediaSendModal(false);
                    setUploadedImage(null);
                  }}
                />
                <PaperAirplaneIcon
                  className=" w-8 h-8 absolute  bottom-6 right-6 text-white cursor-pointer"
                  onClick={handleUploadImage}
                />
              </div>
            )}
            {uploadedVideo && (
              <div>
            
                <video
                  autoPlay
                  controls
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
                  src={preview}
                  
                ></video>
                <button
                type="button"
                 onClick={() => {
                    setMediaSendModal(false);
                    setUploadedVideo(null);
                  }}
                >
 <XMarkIcon
                  className="h-8 w-8 absolute cursor-pointer top-6 right-6 text-white"
                 
                />
                </button>
               <button
               type="button"
                onClick={handleUploadVideo}
               >
 <PaperAirplaneIcon
                  className=" w-8 h-8 absolute  bottom-6 right-6 text-white cursor-pointer"
                 
                />
               </button>
               
              </div>
            )}
        
          </div>
        </div>
  )
}
