import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);
  const {
    participants,
    groupName,
    setParticipants,
    setGroupName,
    setGroupsArray,
  } = useAuth();
  const createGroup = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/message/group/createGroup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupName,
            participants,
          }),
          credentials: "include",
          withCredentials: true,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setGroupsArray((prevGroups) => {
        return prevGroups.length > 0
          ? [...prevGroups, data.newGroup]
          : [data.newGroup];
      });
      toast.success("Group created successfully!");
      setGroupName("");
      setParticipants([]);
    } catch (error) {
      toast.error("useCreateGroup: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, createGroup };
};
