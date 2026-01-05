//Deepti Kadam: In this code add block unblock functinality in this code
import React, { useState } from "react";

export default function ProfilePage() {
  // ✅ Block / Unblock states
  const [isBlocked, setIsBlocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(""); // "block" | "unblock"

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center p-4 md:p-6">
      {/* Main Card Wrapper */}
      <div className="bg-white w-full max-w-7xl rounded-lg shadow-md p-6 md:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Profile
          </h1>

          <div className="flex gap-2 bg-gray-200 rounded-full p-1 w-full sm:w-auto">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-full w-full sm:w-auto ${
                isBlocked
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isBlocked}
              onClick={() => {
                setActionType("unblock");
                setShowConfirm(true);
              }}
            >
              Unblock
            </button>

            <button
              className={`px-4 py-2 text-sm font-medium rounded-full w-full sm:w-auto ${
                !isBlocked
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={isBlocked}
              onClick={() => {
                setActionType("block");
                setShowConfirm(true);
              }}
            >
              Block
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-lg mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://th.bing.com/th/id/OIP.YoTUWMoKovQT0gCYOYMwzwHaHa?w=181&h=181&c=7&r=0&o=7"
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">User Name</h2>
              <p className="text-sm text-gray-600">+91-888-777-0080</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <div className="bg-gray-100 px-6 py-4 rounded text-center">
              <p className="text-xs text-gray-500">Total Earning</p>
              <h3 className="font-bold text-gray-700">₹8015</h3>
            </div>

            <div className="bg-gray-100 px-6 py-4 rounded text-center">
              <p className="text-xs text-gray-500">Delivered Packages</p>
              <h3 className="font-bold text-gray-700">50</h3>
            </div>

            <div className="bg-gray-100 px-6 py-4 rounded text-center">
              <p className="text-xs text-gray-500">Member Since</p>
              <h3 className="font-bold text-gray-700">20 Nov 2025</h3>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-5">Account Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Full Name</p>
              <p className="font-medium text-gray-800">John Doe</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-800">email@example.com</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Mobile Number</p>
              <p className="font-medium text-gray-800">+91-888-777-0080</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">
                Driving License Number
              </p>
              <p className="font-medium text-gray-800">DL-000000000000</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Vehicle Number</p>
              <p className="font-medium text-gray-800">MH 12 AB 1234</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Transport Type</p>
              <p className="font-medium text-gray-800">Bike</p>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 mb-2">Document Image</p>
              <img
                src="https://tse4.mm.bing.net/th/id/OIP.LJ25TOHvPV4pcYR-z59_FgAAAA"
                alt="license"
                className="w-60 h-55 object-cover rounded"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-gray-500 mb-2">
                Vehicle Plate Image
              </p>
              <img
                src="https://tse4.mm.bing.net/th/id/OIP.LJ25TOHvPV4pcYR-z59_FgAAAA"
                alt="plate"
                className="w-60 h-55 object-cover rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CONFIRMATION POPUP */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {actionType === "block" ? "Block User" : "Unblock User"}
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {actionType === "block" ? "block" : "unblock"}
              </span>{" "}
              this user?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className={`px-4 py-2 text-sm rounded-lg text-white ${
                  actionType === "block"
                    ? "bg-red-500"
                    : "bg-green-600"
                }`}
                onClick={() => {
                  setIsBlocked(actionType === "block");
                  setShowConfirm(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
