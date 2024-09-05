import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useStore from "../stores/useStore";

const useDeleteGroup = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup } = useStore((state) => ({
    selectedGroup: state.selectedGroup,
  }));
  const deleteGroup = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/groups/deleteGroup/${selectedGroup._id}`,
        {
          method: "DELETE",
          credentials: "include",
          withCredentials: true,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the group");
      }
      toast.success("Group deleted successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  return { deleteGroup, loading };
};

export default useDeleteGroup;
