import api from "../../../Api/Axios";

export const getConversationById =(id)=>{
    return api.get(`/chat/${id}`);
}
export const chattedUsersApi =(limit,page)=>{
   return  api.get(`/users/chattedUsers?limit=${limit}&page=${page}`);
}
export const searchUserApi =(value)=>{
   return api.get(`/users/search?search=${value}`);
}