import React, { useCallback, useState } from "react";
import { useLogin } from "../../hooks/useLogin"; // Adjust the import path as necessary
import { NavLink } from "react-router-dom";

function LoginForm() {
  const { loading, login } = useLogin();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = useCallback((event) => {
    const name = event.target.name;
    const value = event.target.value;

    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      try {
        event.preventDefault();
        await login(loginData.email, loginData.password);
      } catch (error) {
        console.log(error.message);
      }
    },
    [login, loginData.email, loginData.password]
  );

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-title">
        Welcome,
        <br />
        <span>login to continue</span>
      </div>
      <input
        className="login-input"
        name="email"
        placeholder="Email"
        type="email"
        value={loginData.email}
        onChange={handleChange}
        autoComplete="off"
      />
      <input
        className="login-input"
        name="password"
        placeholder="Password"
        type="password"
        value={loginData.password}
        onChange={handleChange}
        autoComplete="off"
      />
      <button type="submit" className="login-button-confirm" disabled={loading}>
        {!loading ? "Let`s go →" : "Loading..."}
      </button>
      <div className="login-footer text-center mt-2">
        <span>Don't have an account yet?</span>
        <NavLink
          to="/signup"
          className="text-decoration-none custom-margin-left ms-2"
        >
          Sign Up
        </NavLink>
      </div>
    </form>
  );
}

export default React.memo(LoginForm);
