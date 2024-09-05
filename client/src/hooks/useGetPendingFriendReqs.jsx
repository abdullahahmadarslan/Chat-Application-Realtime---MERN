import { useEffect } from "react";
import { toast } from "react-toastify";
import useStore from "../stores/useStore";

export const useGetPendingFriendReqs = () => {
  const { setPendingRequests } = useStore((state) => ({
    setPendingRequests: state.setPendingRequests,
  }));

  useEffect(() => {
    const getPendingFriendReqs = async () => {
      try {
        const serverResponse = await fetch(
          "http://localhost:5000/friend-request/friend-requests",
          {
            method: "GET",
            withCredentials: true,
            credentials: "include",
          }
        );
        const data = await serverResponse.json();
        if (!serverResponse.ok) {
          setPendingRequests([]);
          throw new Error(data.message);
        }
        setPendingRequests(data);
        // console.log(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getPendingFriendReqs();
    // eslint-disable-next-line
  }, []);
};
