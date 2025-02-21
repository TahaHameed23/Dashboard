const API_URL = decodeURIComponent(import.meta.env.VITE_API_URL.trim());

export const sendNewClientData = async (session) => {
    const sessionData = {
        "id":session.$id,
        "email":session.email
    }
    await fetch(`${API_URL}/auth/client/create`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(sessionData),
    });
     
 }