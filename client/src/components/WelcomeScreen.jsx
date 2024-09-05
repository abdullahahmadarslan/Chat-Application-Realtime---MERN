import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LoadingAnimation } from "./custom/LoadingAnimation";
import { UserEditButton } from "./UserEditButton";

const WelcomeScreen = () => {
  const { userAuth, loading, setUserAuth } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userAuth = JSON.parse(localStorage.getItem("user"));
    if (userAuth) {
      setUser(userAuth);
    }
  }, [userAuth, setUserAuth]);

  if (loading || !user) {
    return <LoadingAnimation />;
  }

  return (
    <div
      className="chat-body d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundColor: "#f0f8ff", // Light blue background
        height: "100vh",
      }}
    >
      <div className="text-center container-fluid mt-5">
        <img
          src={`${process.env.PUBLIC_URL}/welcome.png`} // Assuming you have an avatarUrl field in userAuth
          alt="welcome"
          className="img-fluid rounded-circle animate-bounce"
        />
        <h1
          className="display-4 mb-3"
          style={{ fontWeight: "600", color: "#333" }}
        >
          Welcome, {user.firstName} {user.lastName}!
        </h1>
        <p className="lead" style={{ color: "#555" }}>
          We are excited to have you here at SafeChat. Let’s start chatting!
        </p>
      </div>
      <UserEditButton />
    </div>
  );
};

export default React.memo(WelcomeScreen);
