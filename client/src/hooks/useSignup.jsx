import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
// custom hook
export const useSignup = () => {
    // setting a loading state for the signup button
    const [loading, setLoading] = useState(false);
    //auth context
    const { setUserAuth } = useAuth();

    // signup logic here
    const signup = async ({
        firstName,
        lastName,
        userName,
        phone,
        email,
        password,
        cpassword,
        gender,
    }) => {
        // firstly checking inputs on front end
        const success = checkInputs({
            firstName,
            lastName,
            userName,
            phone,
            email,
            password,
            cpassword,
            gender
        });

        if (!success) return;

        setLoading(true);
        try {
            const serverResponse = await fetch("http://localhost:5000/auth/signup", {
                method: "POST",
                withCredentials: true,
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    userName,
                    phone,
                    email,
                    password,
                    cpassword,
                    gender
                }) //sending JSON data to the backend which is parsed there
            });
            // console.log(serverResponse);
            const data = await serverResponse.json();
            if (!serverResponse.ok) {
                throw new Error(data.message);
            } else {
                // console.log(data);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUserAuth(data.user);
                // console.log(userAuth);
                toast.success('Signup Successful');
            }
        } catch (error) {
            toast.error("useSignup" + error.message);
        } finally {
            setLoading(false);
        }
    }

    return { loading, signup };
};

// front end check
const checkInputs = ({
    firstName,
    lastName,
    userName,
    email,
    password,
    cpassword,
    gender,
    phone }) => {
    if (!firstName || !lastName || !userName || !password || !cpassword || !gender || !email || !phone) {
        toast.error('Please Complete All Fields');
        return false;
    }
    if (password !== cpassword) {
        toast.error('Passwords do not match');
        return false;
    }
    // if all checks are successful
    return true;
};