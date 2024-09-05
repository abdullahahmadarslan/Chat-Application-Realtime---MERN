import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import useStore from "../stores/useStore";

export const useGetGroups = () => {
  const [loading, setLoading] = useState(false);
  const { setGroupsArray } = useStore((state) => ({
    setGroupsArray: state.setGroupsArray,
  }));

  const getGroups = useCallback(async () => {
    setLoading(true);
    try {
      const serverResponse = await fetch("http://localhost:5000/groups/", {
        method: "GET",
        withCredentials: true,
        credentials: "include",
      });
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        setGroupsArray([]);
        throw new Error(data.message);
      }
      //   console.log(data);
      setGroupsArray(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [setGroupsArray]);

  return { loading, getGroups };
};
