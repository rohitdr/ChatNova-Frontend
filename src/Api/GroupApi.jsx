import api from "./Axios"

export const addMemberApi =(data)=>{
    return api.post(`/groups/addMember`,data);
}

export const removeMemberApi =(data)=>{
    return  api.post(`/groups/removeMember`,data);
}

export const leaveGroupApi =(data)=>{
    return api.patch(`/groups/leaveGroup`,data);
}

export const deleteGroupApi =(data)=>{
    return api.delete(`/groups/delete`,{data});
}

export const createGroupApi =(data)=>{
    return api.post(`/groups/createGroup`,data);
}
export const getConversationIdApi =(id)=>{
    return api.get(`/messages/conversationId/${id}`);
}
export const getAllGroupsApi =()=>{
    return api.get(`/groups/allgroups?page=1&limit=20`);
}
export const getGroupByIdApi =(id)=>{
    return api.get(`/groups/getGroupById/${id}`);
}
export const uploadGroupImageApi =(image,conversationId)=>{
    return api.put("/groups/groupUpdate", {image,groupId:conversationId });
}
