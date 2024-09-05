import { useCallback } from "react";
import { toast } from "react-toastify";

export const useDeleteFriend = () => {
  const deleteFriend = useCallback(async (friendId) => {
    try {
      const serverResponse = await fetch(
        `http://localhost:5000/friend-request/deleteFriend/${friendId}`,
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
      toast.success("Friend Removed Successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  return { deleteFriend };
};
