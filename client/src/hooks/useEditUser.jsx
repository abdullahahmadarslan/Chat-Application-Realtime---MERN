import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useEditUser = () => {
  const [loadingEditUser, setLoading] = useState(false);
  const { setUserAuth } = useAuth();
  const userAuth = JSON.parse(localStorage.getItem("user"));

  const editUser = async (newUserInfo, newUserAvatar) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/users/editUser/${userAuth._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newUserInfo,
            newUserAvatar,
          }),
          credentials: "include",
          withCredentials: true,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setUserAuth(data);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("User edited successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loadingEditUser, editUser };
};
