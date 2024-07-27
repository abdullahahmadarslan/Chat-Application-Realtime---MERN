import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export const useGetSentFriendRequests = () => {
  const { setToSentRequestIds } = useAuth();
  useEffect(() => {
    const getSentRequests = async () => {
      try {
        const serverResponse = await fetch(
          "http://localhost:5000/friend-request/getSentFriendRequests",
          {
            method: "GET",
            withCredentials: true,
            credentials: "include",
          }
        );
        const data = await serverResponse.json();
        if (!serverResponse.ok) {
          throw new Error(data.message);
        }
        setToSentRequestIds(data.map((request) => request.receiver));
      } catch (error) {
        toast.error("useGetSentFriendRequests: " + error.message);
      }
    };

    getSentRequests();
    // eslint-disable-next-line
  }, []);
};
