import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useDeleteGroupMember = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup } = useAuth();

  const deleteGroupMember = async (memberId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/groups/${selectedGroup._id}/removeMember`,
        {
          method: "DELETE",
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
      toast.success("Member removed successfully");
    } catch (error) {
      console.error(`Error removing member from group ${memberId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteGroupMember };
};
