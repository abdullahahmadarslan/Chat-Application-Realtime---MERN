import { toast } from "react-toastify";

export const useDeleteFriendRequest = () => {
  const cancelFriendRequest = async (userId) => {
    try {
      const serverResponse = await fetch(
        `http://localhost:5000/friend-request/deleteFriendRequest/${userId}`,
        {
          method: "DELETE",
          withCredentials: true,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      toast.success("Friend Request Cancelled!");
    } catch (error) {
      toast.error("useDeleteFriendRequest" + error.message);
    }
  };

  return { cancelFriendRequest };
};
