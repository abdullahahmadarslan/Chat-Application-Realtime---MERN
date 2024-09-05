import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import useStore from "../stores/useStore";

export const useGetContacts = () => {
  //   const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setContactsArray } = useStore((state) => ({
    setContactsArray: state.setContactsArray,
  }));

  const getContacts = useCallback(async () => {
    setLoading(true);
    try {
      const serverResponse = await fetch("http://localhost:5000/users/", {
        method: "GET",
        withCredentials: true,
        credentials: "include",
      });
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        setContactsArray([]);
        throw new Error(data.message);
      }
      // console.log(data);
      setContactsArray(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [setContactsArray]);

  return { loading, getContacts };
};
