import { post } from "../../../lib/fetch";

export const sendNewClientData = async (session) => {
    const sessionData = {
        "id":session.$id,
        "email":session.email
    }
    const response = await post("/auth/client/create", sessionData);
    return response;
     
 }