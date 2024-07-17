import { useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setUserAuth } = useAuth();

    const login = async (email, password) => {
        const success = handleErrors(email, password);
        if (!success) return;
        setLoading(true);
        try {
            const serverResponse = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                withCredentials: true,
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await serverResponse.json();
            if (!serverResponse.ok) {
                throw new Error(data.message);
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            setUserAuth(data);
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error("useLogin" + error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};
export default useLogin;

function handleErrors(email, password) {
    if (!email || !password) {
        toast.error("Please fill in all fields");
        return false;
    }

    return true;
}