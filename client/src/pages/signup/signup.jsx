import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
import { toast } from "react-toastify";
import axios from "axios";
import { extractPublicId } from "cloudinary-build-url";

function SignupPage() {
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
    profilePicture: "",
  });
  const [imgLoader, setImgLoader] = useState(false);
  const [loadingRemoveImg, setLoadingRemoveImg] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [publicId, setPublicId] = useState("");

  // handling input change
  const handleChange = useCallback((event) => {
    const name = event.target.name;
    const value =
      event.target.type === "file" ? event.target.files[0] : event.target.value;

    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // handling form submit
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        event.preventDefault();
        await signup(signupData);
      } catch (error) {
        console.log(error.message);
      }
    },
    [signup, signupData]
  );

  // handling image upload
  const handleFileUpload = useCallback(async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const acceptedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];

      if (!acceptedImageTypes.includes(fileType)) {
        toast.error(
          "Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed."
        );
        event.target.value = null; // Reset the file input
        return; // Exit the function early if the file is not an accepted image type
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      setImgLoader(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/cloudinary/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const fileUrl = response.data.url.toString();
        const publicId = extractPublicId(response.data.url);
        setSignupData((prev) => ({ ...prev, profilePicture: fileUrl }));

        // Set the selected file name and mark file as selected
        setSelectedFileName(selectedFile.name);
        setIsFileSelected(true);
        setPublicId(publicId);
      } catch (error) {
        toast.error("Error uploading image");
        console.error(error);
      } finally {
        setImgLoader(false);
        event.target.value = null;
      }
    }
  }, []);

  // removing image that got selected
  const handleRemoveFile = useCallback(async () => {
    if (publicId) {
      setLoadingRemoveImg(true);
      try {
        await axios.delete("http://localhost:5000/cloudinary/delete", {
          data: { publicId }, // Send the public ID in the request body
        });
      } catch (error) {
        toast.error("Error removing image: " + error.message);
        console.error(error);
      } finally {
        setLoadingRemoveImg(false);
      }
    }

    setSelectedFileName("");
    setIsFileSelected(false);
    setPublicId("");
    setSignupData((prev) => ({ ...prev, profilePicture: "" }));
  }, [publicId]);

  return (
    <div className="container-fluid  w-100 h-100 d-flex align-items-center justify-items-center">
      <form
        className="signup-form mx-auto "
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="signup-title">
          Create Account
          <br />
          <span>Sign up to get started!</span>
        </div>

        <input
          className="signup-input"
          name="firstName"
          placeholder="First Name"
          type="text"
          value={signupData.firstName}
          onChange={handleChange}
          autoComplete="off"
        />

        <input
          className="signup-input"
          name="lastName"
          placeholder="Last Name"
          type="text"
          value={signupData.lastName}
          onChange={handleChange}
          autoComplete="off"
        />

        <input
          className="signup-input"
          name="userName"
          placeholder="Username"
          type="text"
          value={signupData.userName}
          onChange={handleChange}
          autoComplete="off"
        />

        <input
          className="signup-input"
          name="email"
          placeholder="Email"
          type="email"
          value={signupData.email}
          onChange={handleChange}
          autoComplete="off"
        />

        <input
          className="signup-input"
          name="phone"
          placeholder="Phone"
          type="text"
          value={signupData.phone}
          onChange={handleChange}
          autoComplete="off"
        />

        <input
          className="signup-input"
          name="password"
          placeholder="Password"
          type="password"
          value={signupData.password}
          onChange={handleChange}
          autoComplete="off"
        />

        <input
          className="signup-input"
          name="cpassword"
          placeholder="Confirm Password"
          type="password"
          value={signupData.cpassword}
          onChange={handleChange}
          autoComplete="off"
        />

        <div className="signup-gender">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={signupData.gender === "male"}
              onChange={handleChange}
            />
            <span className="ms-1">Male</span>
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={signupData.gender === "female"}
              onChange={handleChange}
            />
            <span className="ms-1">Female</span>
          </label>
        </div>
        <div className="signup-avatar">
          <label>Upload Avatar</label>
          {isFileSelected ? (
            <div className="selected-file-container">
              <div className="selected-file-name">{selectedFileName}</div>
              <button
                type="button"
                className="remove-file-button"
                onClick={handleRemoveFile}
              >
                {loadingRemoveImg ? (
                  <div
                    className="spinner-border text-secondary ms-2 mt-1"
                    role="status"
                  ></div>
                ) : (
                  "✖"
                )}
              </button>
            </div>
          ) : (
            <>
              {imgLoader ? (
                <div
                  className="spinner-border text-secondary ms-2"
                  role="status"
                ></div>
              ) : (
                <input
                  className="signup-input"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={imgLoader} // Disable the input when loading
                />
              )}
            </>
          )}
        </div>

        <button
          type="submit"
          className="signup-button-confirm"
          disabled={loading}
        >
          {!loading ? "Sign Up" : "Loading..."}
        </button>

        <div className="signup-footer text-center mt-2">
          <span>Already have an account?</span>
          <NavLink
            to="/login"
            className="text-decoration-none custom-margin-left ms-2"
          >
            Login
          </NavLink>
        </div>
      </form>
    </div>
  );
}

export default React.memo(SignupPage);
