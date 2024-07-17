import { useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';


export const useSendMsg = () => {
    const [loading, setLoading] = useState();
    const { selectedContact, messages, setMessages } = useAuth();

    const sendMsg = async (message) => {
        setLoading(true);
        try {
            const serverResponse = await fetch(`http://localhost:5000/message/sendMsg/${selectedContact._id}`, {
                method: "POST",
                withCredentials: true,
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            const data = await serverResponse.json();
            if (!serverResponse.ok) {
                throw new Error(data.message);
            }
            setMessages([...messages, data.newMessage]);
            toast.success("message sent successfully");
        } catch (error) {
            toast.error("useSendMsg" + error.message);
        }
        setLoading(false);
    }
    return { loading, sendMsg };
}
