import { useCallback } from "react";
import { toast } from "react-toastify";

export const useDeleteFriendRequest = () => {
  const cancelFriendRequest = useCallback(async (userId) => {
    try {
      const serverResponse = await fetch(
        `http://localhost:5000/friend-request/deleteFriendRequest/${userId}`,
        {
          method: "DELETE",
          withCredentials: true,
          credentials: "include",
        }
      );
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      toast.success("Friend Request Cancelled!");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  return { cancelFriendRequest };
};
