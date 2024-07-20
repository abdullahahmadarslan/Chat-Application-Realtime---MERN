import React from "react";
import { useAuth } from "../context/AuthContext";

const WelcomeScreen = () => {
  const { userAuth } = useAuth();
  return (
    <div
      className="chat-body d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundColor: "#f0f8ff", // Light blue background
        height: "100vh",
      }}
    >
      <div className="text-center container-fluid mb-5">
        <img
          src={`${process.env.PUBLIC_URL}/welcome.png`} // Assuming you have an avatarUrl field in userAuth
          alt={`welcome`}
          className="img-fluid rounded-circle animate-bounce"
        />
        <h1
          className="display-4 mb-3"
          style={{ fontWeight: "600", color: "#333" }}
        >
          Welcome, {userAuth ? userAuth.firstName : "Guest"}{" "}
          {useAuth ? userAuth.lastName : ""}!
        </h1>
        <p className="lead" style={{ color: "#555" }}>
          We are excited to have you here. Let’s start chatting!
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
