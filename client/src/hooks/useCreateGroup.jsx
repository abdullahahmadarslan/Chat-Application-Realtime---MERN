import { useCallback, useState } from "react";
import useStore from "../stores/useStore";
import { toast } from "react-toastify";

export const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);

  //states
  const {
    participants,
    groupName,
    setParticipants,
    setGroupName,
    setGroupsArray,
  } = useStore((state) => ({
    participants: state.participants,
    groupName: state.groupName,
    setParticipants: state.setParticipants,
    setGroupName: state.setGroupName,
    setGroupsArray: state.setGroupsArray,
  }));

  const createGroup = useCallback(
    async (profilePicture) => {
      // console.log(profilePicture);
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
              profilePicture,
            }),
            credentials: "include",
            withCredentials: true,
          }
        );
        console.log(profilePicture);
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
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [groupName, participants, setGroupsArray, setGroupName, setParticipants]
  );

  return { loading, createGroup };
};
