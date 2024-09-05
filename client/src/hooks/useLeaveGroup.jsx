import { useCallback, useState } from "react";
import useStore from "../stores/useStore";
import { toast } from "react-toastify";

const useLeaveGroup = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup } = useStore((state) => ({
    selectedGroup: state.selectedGroup,
  }));

  const leaveGroup = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/groups/leaveGroup/${selectedGroup._id}`,
        {
          method: "DELETE",
          credentials: "include",
          withCredentials: true,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to leave the group");
      }

      toast.success("Successfully left the group");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  return { leaveGroup, loading };
};

export default useLeaveGroup;
