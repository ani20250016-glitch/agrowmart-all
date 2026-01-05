import React, { useState, useEffect } from "react";

const ProfileInputField = React.memo(
  ({ label, name, value, onChange, readOnly = false }) => {
    return (
      <div className="flex flex-col space-y-2">
        <label htmlFor={name} className="text-gray-700 font-medium">
          {label}
        </label>
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`
            w-full p-3 border rounded-lg focus:outline-none 
            ${
              readOnly
                ? "bg-gray-100 cursor-not-allowed text-gray-500 border-gray-300"
                : "bg-white border-gray-400 focus:border-green-600 focus:ring-1 focus:ring-green-600"
            }
          `}
        />
      </div>
    );
  }
);

// Define the initial state for the profile form
const initialProfileData = {
  fullName: "Admin User",
  email: "admin@agroplatform.com",
  phone: "+91 0000000000",
  role: "Super Admin", // This is likely read-only
  profilePhotoUrl: null, // Placeholder for the green icon
};

const AdminProfile = () => {
  const [profile, setProfile] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false); // State to track if changes have been made

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Remove all non-digit characters except + at start
      let cleaned = value.replace(/[^\d+]/g, "");

      // Ensure it starts with +91
      if (!cleaned.startsWith("+91")) {
        cleaned = "+91" + cleaned.replace(/^\+?/, "");
      }

      // Add a space after +91 if missing
      if (!cleaned.startsWith("+91 ")) {
        cleaned = "+91 " + cleaned.slice(3).trim();
      }

      // Limit to +91 + 10 digits
      cleaned = cleaned.slice(0, 14); // "+91 " + 10 digits = 14 chars max

      setProfile((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setIsEditing(true);
  };

  // Function to handle form submission (Save Changes)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profile.fullName.trim()) {
      alert("Full name is required");
      return;
    }

    // Validate phone: must start with +91, optional space, then exactly 10 digits
    const phonePattern = /^\+91\s?\d{10}$/;
    if (!phonePattern.test(profile.phone)) {
      alert("Invalid phone number.");
      return;
    }

    console.log("Profile Saved:", profile);
    alert("Profile updated successfully");
    setIsEditing(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert("Only JPG, PNG or GIF allowed");
      return;
    }

    const photoURL = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      profilePhotoUrl: photoURL,
    }));
    setIsEditing(true);
  };

  useEffect(() => {
    const warnUser = (e) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", warnUser);
    return () => window.removeEventListener("beforeunload", warnUser);
  }, [isEditing]);

  // The main component render
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-6 lg:p-8">
      {/* Profile Card Container */}
      <div className="w-full max-w-6xl bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h1>

        {/* Photo Section */}
        <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200 mb-6">
          {/* Circular Photo/Icon */}
          <div className="w-30 h-30 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-[green] flex items-center justify-center text-white">
              {/* Person Icon */}
              <div className="w-30 h-30 flex-shrink-0">
                {profile.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[green] flex items-center justify-center text-white">
                    {/* Default person icon */}
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Change Photo Button & Info */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <span className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Change Photo
              </span>
              <input
                id="photo-upload"
                type="file"
                className="hidden"
                accept=".jpg,.png,.gif"
                onChange={handlePhotoChange}
              />
            </label>
            <p className="text-xs text-gray-500">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <ProfileInputField
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
            />

            {/* Email (Read-Only) */}
            <ProfileInputField
              label="Email"
              name="email"
              value={profile.email}
              readOnly={true}
            />

            {/* Phone */}
            <ProfileInputField
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />

            {/* Role */}
            <ProfileInputField
              label="Role"
              name="role"
              value={profile.role}
              readOnly={true}
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => {
                setProfile(initialProfileData);
                setIsEditing(false);
              }}
              className="px-6 py-3 rounded-lg border border-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isEditing}
              className={`
              px-6 py-3 rounded-lg font-semibold
              ${
                isEditing
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
