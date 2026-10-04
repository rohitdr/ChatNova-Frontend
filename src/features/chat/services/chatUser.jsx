import { chattedUsersApi } from "../api/api";

  //function to serach the users with whom logged in user have chatted
  export const chattedUsers = async (page) => {

     let limit =15
      const res =await chattedUsersApi(limit,page)
         return  {
  users: res.data.users,
  page: page,
  hasMore: res.data.hasMore

      }
  
  };