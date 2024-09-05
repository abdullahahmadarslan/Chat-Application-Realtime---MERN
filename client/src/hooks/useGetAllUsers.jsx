// import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import useStore from "../stores/useStore";

export const useGetAllUsers = () => {
  //   const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAllUsers } = useStore((state) => ({
    setAllUsers: state.setAllUsers,
  }));

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const serverResponse = await fetch(
        "http://localhost:5000/users/allUsers",
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
      //   console.log(data);
      setAllUsers(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [setAllUsers]);

  return { loading, getAllUsers };
};
