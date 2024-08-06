import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useGetGroupMembers = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup, setCurrentGroupMembers } = useAuth();

  useEffect(() => {
    const getGroupsMembers = async () => {
      setLoading(true);
      try {
        const serverResponse = await fetch(
          `http://localhost:5000/groups/getGroupMembers/${selectedGroup._id}`,
          {
            method: "GET",
            withCredentials: true,
            credentials: "include",
          }
        );
        const data = await serverResponse.json();
        if (!serverResponse.ok) {
          setCurrentGroupMembers([]);
          throw new Error(data.message);
        }
        // console.log(data);
        // console.log(selectedGroup);
        setCurrentGroupMembers(data);
      } catch (error) {
        toast.error("useGetGroupMembers" + error.message);
      } finally {
        setLoading(false);
      }
    };
    getGroupsMembers();
    // eslint-disable-next-line
  }, [selectedGroup]);

  return { loading };
};
