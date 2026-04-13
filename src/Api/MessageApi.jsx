import axios from "axios";
import api from "./Axios";

export const sendMessageApi =(data)=>{
    return api.post(`/messages/sendMessage`,data);
}
export const getMessagesApi =(id,cursor)=>{
     let url = `/messages/recieveMessage/${id}`
    if(cursor){
      url +=`?cursor=${cursor}`
    }
    return api.get(url);
}
export const sendMediaApi =(id,data)=>{
    return api.post(`/messages/sendFile/${id}`, data);
}
export const uploadCloudinaryApi =(data)=>{
    return axios.post( `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_DATABASE_NAME}/auto/upload`,data);
} 