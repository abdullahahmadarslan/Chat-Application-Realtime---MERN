import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useStore from "../stores/useStore";

export const useGetGroupMembers = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup, setCurrentGroupMembers } = useStore((state) => ({
    selectedGroup: state.selectedGroup,
    setCurrentGroupMembers: state.setCurrentGroupMembers,
    currentGroupMembers: state.currentGroupMembers,
  }));

  useEffect(() => {
    const getGroupsMembers = async () => {
      setLoading(true);
      try {
        const serverResponse = await fetch(
          `http://localhost:5000/groups/getGroupMembers/${selectedGroup._id}`,
          {
            method: "GET",
            withCredentials: true,
            credentials: "include",
          }
        );
        const data = await serverResponse.json();
        if (!serverResponse.ok) {
          setCurrentGroupMembers([]);
          throw new Error(data.message);
        }
        // console.log(data);
        // console.log(selectedGroup);
        setCurrentGroupMembers(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getGroupsMembers();
    // eslint-disable-next-line
  }, [selectedGroup]);

  return { loading };
};
