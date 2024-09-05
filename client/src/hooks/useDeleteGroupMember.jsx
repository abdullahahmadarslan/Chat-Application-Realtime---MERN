import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useStore from "../stores/useStore";

export const useDeleteGroupMember = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup } = useStore((state) => ({
    selectedGroup: state.selectedGroup,
  }));

  const deleteGroupMember = useCallback(
    async (memberId) => {
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
        toast.error(error.message);
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [selectedGroup]
  );

  return { loading, deleteGroupMember };
};
