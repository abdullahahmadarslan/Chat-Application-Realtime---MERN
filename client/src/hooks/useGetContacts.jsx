import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useGetContacts = () => {
  //   const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setContactsArray } = useAuth();

  const getContacts = async () => {
    setLoading(true);
    try {
      const serverResponse = await fetch("http://localhost:5000/users/", {
        method: "GET",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      //   console.log(data);
      setContactsArray(data);
    } catch (error) {
      toast.error("useGetContacts" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getContacts };
};
