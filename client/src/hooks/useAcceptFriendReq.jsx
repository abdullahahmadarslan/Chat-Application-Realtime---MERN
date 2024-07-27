import { useState } from "react";
import { toast } from "react-toastify";

export const useAcceptFriendReq = () => {
  const [loading, setLoading] = useState(false);

  const acceptFriendReq = async (requestId) => {
    setLoading(true);
    try {
      const serverResponse = await fetch(
        `http://localhost:5000/friend-request/${requestId}/accept`,
        {
          method: "PUT",
          withCredentials: true,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      toast.success("Friend Request Accepted!");
    } catch (error) {
      toast.error("acceptFriendReq" + error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, acceptFriendReq };
};
