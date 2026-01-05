import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Header({ open, setOpen, activePage, setActivePage }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  /* 🔹 SEARCHABLE MODULES (ADDED – SAFE, NO SIDEBAR IMPORT) */
  const searchableModules = [
    { label: "Dashboard", path: "/dashboard" },

    { label: "Users › Customers", path: "/customers" },
    { label: "Users › Sellers", path: "/sellers" },
    { label: "Users › Delivery Partners", path: "/delivery" },

    { label: "Products › All Products", path: "/products" },
    { label: "Products › Deleted Products", path: "/deletedproducts" },

    { label: "Orders", path: "/orders" },
    { label: "Categories", path: "/categories" },
    { label: "Market Rates", path: "/market-rates" },
    { label: "Weather Settings", path: "/weather-settings" },
    { label: "Websites", path: "/websites" },
    { label: "Offers", path: "/offers" },
    { label: "Admins", path: "/admins" },
    { label: "Tickets / Support", path: "/support" },
    { label: "Payments", path: "/payment" },
    { label: "Settings", path: "/settings" },
  ];

  const filteredResults = searchableModules.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => e.preventDefault();

  return (
    <>
      <nav
        className="bg-[#f6ffd9] px-4 py-3 flex justify-between items-center duration-500 fixed top-0 shadow-md z-40"
        style={{
          left: isMobile ? "0" : open ? "240px" : "64px",
          width: isMobile ? "100%" : `calc(100% - ${open ? 240 : 64}px)`,
        }}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3 text-lg">
          {isMobile && (
            <CiMenuFries
              size={26}
              className="text-[green] cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          )}
          <span className="font-semibold text-black">{activePage}</span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6 relative">
          {/* DESKTOP SEARCH */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="relative w-56">
              <FaSearch className="absolute left-3 top-2.5 text-green-700" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-1 bg-white rounded-lg shadow outline-none text-sm"
              />

              {searchValue && (
                <div className="absolute top-9 left-0 w-full bg-white shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          navigate(item.path);
                          setActivePage(item.label);
                          setSearchValue("");
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-green-100 text-sm"
                      >
                        {item.label}
                      </div>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </form>
          )}

          {/* MOBILE SEARCH ICON */}
          {isMobile && (
            <FaSearch
              className="text-[green] cursor-pointer"
              onClick={() => setSearchOpen(true)}
            />
          )}

          {/* NOTIFICATION */}
          <FaBell
           className="w-5 h-5 sm:w-6 sm:h-6 text-[green] cursor-pointer"
            onClick={() => {
              setActivePage("Notifications");
              navigate("/notifications");
            }}
          />

          {/* PROFILE */}
        <div className="relative" ref={profileRef}>
           <FaUserCircle 
           className="w-7 h-7 sm:w-8 sm:h-8 text-[green] cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg border z-50">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    setActivePage("Profile");
                    navigate("/profile");
                  }}
                  className="flex gap-2 w-full px-4 py-2 hover:bg-green-600 hover:text-white"
                >
                  <FaUser /> Profile
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    localStorage.removeItem("authToken");
                    sessionStorage.removeItem("authToken");
                    setActivePage("");
                    navigate("/login", { replace: true });
                  }}
                  className="flex gap-2 w-full px-4 py-2 hover:bg-red-600 hover:text-white text-red-600"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH OVERLAY */}
      {isMobile && searchOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="flex items-center p-4 bg-[#f6ffd9] gap-2">
            <FaArrowLeft
              className="cursor-pointer text-green-700"
              onClick={() => setSearchOpen(false)}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-3 py-2 border rounded"
            />
            {searchValue && (
              <FaTimes
                className="cursor-pointer"
                onClick={() => setSearchValue("")}
              />
            )}
          </div>

          <div className="p-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setActivePage(item.label);
                    setSearchOpen(false);
                    setSearchValue("");
                  }}
                  className="p-2 rounded hover:bg-green-100 cursor-pointer"
                >
                  {item.label}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No results found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
