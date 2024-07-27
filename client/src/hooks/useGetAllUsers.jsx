import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useGetAllUsers = () => {
  //   const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAllUsers } = useAuth();

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const serverResponse = await fetch(
        "http://localhost:5000/users/allUsers",
        {
          method: "GET",
          withCredentials: true,
          credentials: "include",
        }
      );
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      //   console.log(data);
      setAllUsers(data);
    } catch (error) {
      toast.error("useGetAllUsers" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getAllUsers };
};
