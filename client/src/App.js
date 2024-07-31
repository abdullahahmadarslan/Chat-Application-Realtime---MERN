import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/login/login";
import SignupPage from "./pages/signup/signup";
import Home from "./pages/home/Home";

// app
const App = () => {
  const { userAuth, loading } = useAuth();

  // console.log("userAuth:", userAuth);
  // console.log("loading:", loading);

  if (loading) {
    return <div>Loading...</div>; // or a spinner/loading indicator
  }
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={userAuth ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={userAuth ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={userAuth ? <Navigate to="/" /> : <SignupPage />}
        />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
