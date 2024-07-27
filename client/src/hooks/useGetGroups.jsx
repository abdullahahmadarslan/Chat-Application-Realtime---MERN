import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useGetGroups = () => {
  const [loading, setLoading] = useState(false);
  const { setGroupsArray } = useAuth();

  const getGroups = async () => {
    setLoading(true);
    try {
      const serverResponse = await fetch("http://localhost:5000/groups/", {
        method: "GET",
        withCredentials: true,
        credentials: "include",
      });
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        setGroupsArray([]);
        throw new Error(data.message);
      }
      //   console.log(data);
      setGroupsArray(data);
    } catch (error) {
      toast.error("useGetGroups" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getGroups };
};
