import { useState } from "react";
import { toast } from "react-toastify";

export const useRejectFriendRequest = () => {
  const [loadingRejectFr, setLoading] = useState(false);

  const rejectFriendReq = async (requestId) => {
    setLoading(true);
    try {
      const serverResponse = await fetch(
        `http://localhost:5000/friend-request/${requestId}/reject`,
        {
          method: "PATCH",
          withCredentials: true,
          credentials: "include",
        }
      );
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      toast.success("Friend Request Rejected!");
    } catch (error) {
      toast.error("rejectFriendReq" + error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loadingRejectFr, rejectFriendReq };
};
