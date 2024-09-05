import { useEffect } from "react";
import { toast } from "react-toastify";
import useStore from "../stores/useStore";

export const useGetSentFriendRequests = () => {
  const { setToSentRequestIds } = useStore((state) => ({
    setToSentRequestIds: state.setToSentRequestIds,
  }));
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
        toast.error(error.message);
      }
    };

    getSentRequests();
    // eslint-disable-next-line
  }, []);
};
