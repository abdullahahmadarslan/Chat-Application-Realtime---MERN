import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useAddGroupMember = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup } = useAuth();

  const addGroupMember = async (memberId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/groups/${selectedGroup._id}/addMember`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberId,
          }),
          credentials: "include",
          withCredentials: true,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast.success("Member added successfully");
    } catch (error) {
      console.error(`Error adding member to group ${memberId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, addGroupMember };
};
