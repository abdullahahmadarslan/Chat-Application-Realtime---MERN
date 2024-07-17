import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineLogin } from "react-icons/md";
import { useSignup } from "../../hooks/useSignup";

const SignupPage = () => {
  const { signup, loading } = useSignup();

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    gender: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    try {
      // console.log(signupData)
      event.preventDefault();
      await signup(signupData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex vh-100 vw-100 justify-content-center align-items-center">
      <div
        className="col-md-6 col-lg-3 p-5 shadow bg-body rounded-4 mt-5"
        style={{ height: "87%" }}
      >
        <h2 className="text-center mb-4 border-bottom border-dark p-2">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="Enter First Name"
              value={signupData.firstName}
              onChange={handleChange}
              style={{ height: "37px" }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="Enter Last Name"
              value={signupData.lastName}
              onChange={handleChange}
              style={{ height: "37px" }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              name="userName"
              className="form-control"
              placeholder="Enter Username"
              value={signupData.userName}
              onChange={handleChange}
              style={{ height: "37px" }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Enter Phone"
              value={signupData.phone}
              onChange={handleChange}
              style={{ height: "37px" }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email"
              value={signupData.email}
              onChange={handleChange}
              style={{ height: "37px" }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter Password"
              value={signupData.password}
              onChange={handleChange}
              style={{ height: "37px" }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="cpassword"
              className="form-control"
              placeholder="Confirm Password"
              value={signupData.cpassword}
              onChange={handleChange}
              style={{ height: "37px" }}
            />
          </div>
          <div className="form-group mb-4">
            <label>Gender</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="male"
                value="male"
                checked={signupData.gender === "male"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="male">
                Male
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="female"
                value="female"
                checked={signupData.gender === "female"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="female">
                Female
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-light btn- block"
            disabled={loading}
          >
            {!loading ? (
              <MdOutlineLogin style={{ fontSize: "30px", width: "50px" }} />
            ) : (
              <div class="spinner-border text-muted" style={{ fontSize: "30px" }}></div>
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="text-decoration-none ml-2"
            style={{ marginLeft: "5px" }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
