import { useState, useCallback } from "react";
import { toast } from "react-toastify";

export const useFriendRequest = () => {
  const [loading, setLoading] = useState(false);

  const sendFriendRequest = useCallback(async (userId) => {
    setLoading(true);
    try {
      const serverResponse = await fetch(
        "http://localhost:5000/friend-request/",
        {
          method: "POST",
          withCredentials: true,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiverId: userId }),
        }
      );
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      toast.success("Friend Request Sent Successfully!");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, sendFriendRequest };
};
