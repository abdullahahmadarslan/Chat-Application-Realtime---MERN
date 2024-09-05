import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export const useEditGroup = () => {
  const [loadingEditGroup, setLoading] = useState(false);
  const editGroup = useCallback(
    async (groupId, newGroupAvatar, newGroupName) => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/groups/editGroup/${groupId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newGroupName,
              newGroupAvatar,
            }),
            credentials: "include",
            withCredentials: true,
          }
        );

        // const data = await response.json();
        if (!response.ok) {
          throw new Error("Can't Edit Group");
        }
        toast.success("Group edited successfully!");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return { loadingEditGroup, editGroup };
};
