import { uploadCloudinaryApi } from "../../../Api/MessageApi";
import { updateUserApi } from "../api/user.api";

export const updateUser = async (data,file) => {

      if(file){
const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await uploadCloudinaryApi(formdata);
      let image = {
        publicId: res.data.public_id,
        url: res.data.secure_url,
      };
      
       data.image =  image 

      }
      const response = await updateUserApi(data)
return response.data
  
  };