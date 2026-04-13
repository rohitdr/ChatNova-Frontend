import { useMutation } from "@tanstack/react-query"
import { sendMessageApi } from "../../Api/MessageApi"

export const useSendMessage=(handleError)=>{
    return useMutation({
         mutationFn: sendMessageApi,
    onError: handleError,
    })
}
