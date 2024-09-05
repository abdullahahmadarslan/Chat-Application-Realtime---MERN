import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export const useLogout = () => {
  const [loading, setLoading] = useState();
  const { setUserAuth } = useAuth();

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const serverResponse = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await serverResponse.json();
      if (!serverResponse.ok) {
        throw new Error(data.message);
      }
      // else
      localStorage.removeItem("user");
      setUserAuth(null);
      toast.success("Logged Out Successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [setUserAuth]);

  return { loading, logout };
};
