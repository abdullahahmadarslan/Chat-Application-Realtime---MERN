import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineLogin } from "react-icons/md";
import { useLogin } from "../../hooks/useLogin";

const LoginPage = () => {
  const { loading, login } = useLogin();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      await login(loginData.email, loginData.password);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="d-flex vh-100 vw-100  justify-content-center align-items-center">
      <div className="col-md-4 col-lg-3 p-5 shadow bg-body h-55 rounded-4 ">
        <h2 className="text-center mb-4 border-bottom border-dark p-2 ">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email Here..."
              value={loginData.email}
              onChange={handleChange}
              style={{ height: "55px" }}
              autoComplete="off"
            />
          </div>

          <div className="form-group mb-5">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter Password Here..."
              value={loginData.password}
              onChange={handleChange}
              style={{ height: "55px" }}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="btn btn-light btn-block"
            disabled={loading}
          >
            {!loading ? (
              <MdOutlineLogin style={{ fontSize: "30px", width: "50px" }} />
            ) : (
              <div
                className="spinner-border text-muted"
                style={{ fontSize: "30px" }}
              ></div>
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>Don't have an account yet?</span>
          <NavLink
            to="/signup"
            className="text-decoration-none custom-margin-left"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
