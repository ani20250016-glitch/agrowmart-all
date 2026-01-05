import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";


import logo from "../../assets/Logo1.png";

// icons
import {
  MdMenuOpen,
  MdPayment,
  MdSupportAgent,
  MdOutlineAppShortcut,
  MdInventory,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { IoPricetagOutline } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import {
  FaUsers,
  FaProductHunt,
  FaChartLine,
  FaUserShield,
  FaStar
} from "react-icons/fa";
import { FaUserGroup, FaCircleUser, FaOpencart } from "react-icons/fa6";
import { BiSolidReport, BiCategory } from "react-icons/bi";
import { IoSettings } from "react-icons/io5";
import { WiDaySunny } from "react-icons/wi";

const menuItems = [
  {
    icons: <AiOutlineProduct size={28} />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icons: <FaUsers size={28} />,
    label: "Users",
    // Submenu items added here
    subItems: [
      { label: "Customers", path: "/customers" },
      { label: "Sellers", path: "/sellers" },
      { label: "Delivery Partners", path: "/delivery" },
    ],
  },
  {
    icons: <FaProductHunt size={28} />,
    label: "Products",

    subItems: [
      { label: "All Products", path: "/products" },
      { label: "Deleted Products", path: "/deletedproducts" },
    ],
  },
  { icons: <FaOpencart size={28} />, label: "Orders", path: "/orders" },
  { icons: <FaStar size={28} />, label: "Reviews", path: "/review" },

  { icons: <BiCategory size={28} />, label: "Categories", path: "/categories" },
  {
    icons: <FaChartLine size={28} />,
    label: "Market Rates",
    path: "/market-rates",
  },
  {
    icons: <WiDaySunny size={28} />,
    label: "Weather Settings",
    path: "/weather-settings",
  },
  { icons: <CgWebsite size={28} />, label: "Websites", path: "/websites" },
  { icons: <IoPricetagOutline size={28} />, label: "Offers", path: "/offers" },
  { icons: <FaUserShield size={28} />, label: "Admins", path: "/admins" },
  {
    icons: <MdSupportAgent size={28} />,
    label: "Tickets / Support",
    path: "/support",
  },
  {
  icons: <MdOutlineAppShortcut size={28} />,
  label: "Refer & Earn",
  path: "/refer-earn",
  },
  { icons: <MdPayment size={28} />, label: "Payments", path: "/payment" },
  { icons: <IoSettings size={28} />, label: "Settings", path: "/settings" },
];

export default function Sidebar({ open, setOpen, activePage, setActivePage }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // State to handle the Users dropdown toggle
  const [usersOpen, setUsersOpen] = useState(false);

  const [productsOpen, setProductsOpen] = useState(false);

  // Close sidebar when clicking outside (Only for Mobile)
  useEffect(() => {
    if (!isMobile || !open) return;

    const handleOutsideClick = (e) => {
      if (!e.target.closest("nav")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMobile, open, setOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setOpen]);

  useEffect(() => {
    const currentPath = window.location.pathname;

    menuItems.forEach((item) => {
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          if (sub.path === currentPath) {
            setActivePage(`${item.label} › ${sub.label}`);
          }
        });
      } else if (item.path === currentPath) {
        setActivePage(item.label);
      }
    });
     if (currentPath === "/notifications") {
    setActivePage("Notifications");
    }
    if (currentPath === "/profile") {
      setActivePage("Profile");
    }
    if (currentPath === "/logout") {
      setActivePage("Logout");
    }
    }, []);

  return (
    <nav
      className={`fixed left-0 top-0 shadow-md h-screen p-2 flex flex-col duration-500 bg-[green] text-[#fff]
        ${open ? "w-60" : "w-16"}
        ${isMobile && !open ? "transform -translate-x-full" : ""}
        ${isMobile && open ? "z-50" : "z-10"}
      `}
    >
      {/* Header */}
      <div className="px-3 py-2 h-20 flex justify-between items-center relative">

          {/* LOGO */}
          <img
            src={logo}
            alt="Logo"
            className={`${open ? "w-35" : "w-0"} rounded-md`}
          />

          {/* Desktop toggle button */}
          {!isMobile && (
            <MdMenuOpen
              size={34}
              className={`duration-500 cursor-pointer ${!open && "rotate-180"}`}
              onClick={() => setOpen(!open)}
            />
          )}

          {/* Mobile Close (X) Button */}
          {isMobile && open && (
            <FaTimes
              size={25}
              className="absolute right-3 text-white cursor-pointer"
              onClick={() => setOpen(false)}
            />
          )}
        </div>


      {/* Menu */}
      <ul className="flex-1 overflow-y-auto scrollbar-hidden">
        {menuItems.map((item, index) => (
          <div key={index}>
            <li
              onClick={() => {
                if (item.subItems) {
                  if (item.label === "Users") {
                    setUsersOpen(!usersOpen);
                    setProductsOpen(false);
                    if (!open) setOpen(true);
                    return;
                  }

                  if (item.label === "Products") {
                    setProductsOpen(!productsOpen);
                    setUsersOpen(false);
                    if (!open) setOpen(true);
                    return;
                  }
                }

                // Normal items (NO dropdown)
                setUsersOpen(false);
                setProductsOpen(false);
                setActivePage(item.label);
                navigate(item.path);
                if (isMobile) setOpen(false);
              }}
              className={`
              px-3 py-2 my-1 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group
              hover:bg-gray-100 hover:text-[#000] 
              ${
                item.subItems
                  ? item.subItems.some(
                      (sub) => activePage === `${item.label} › ${sub.label}`
                    )
                    ? "bg-[#fff] text-[green]"
                    : ""
                  : activePage === item.label
                  ? "bg-[#f6ffd9] text-[green]"
                  : ""
              }

             `}
            >
              <div>{item.icons}</div>

              <div
                className={`flex justify-between items-center w-full ${
                  !open && "hidden"
                }`}
              >
                <p className="duration-500 overflow-hidden">{item.label}</p>
                {/* Arrow Icon for Users */}
                {item.subItems &&
                  (item.label === "Users" ? (
                    usersOpen ? (
                      <MdKeyboardArrowDown />
                    ) : (
                      <MdKeyboardArrowRight />
                    )
                  ) : item.label === "Products" ? (
                    productsOpen ? (
                      <MdKeyboardArrowDown />
                    ) : (
                      <MdKeyboardArrowRight />
                    )
                  ) : null)}
              </div>

              {/* Hover label when closed (Original UI preserved) */}
              <p
                className={`${
                  open && "hidden"
                } absolute left-32 shadow-md rounded-md w-0 p-0 text-black bg-white
                   duration-300 overflow-hidden
                   group-hover:w-fit group-hover:p-2 group-hover:left-16 z-50`}
              >
                {item.label}
              </p>
            </li>

            {/* Render Subitems (Customers, Merchant, etc) */}
            {item.subItems && item.label === "Users" && usersOpen && open && (
              <div className="flex flex-col">
                {item.subItems.map((sub, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setActivePage(`Users › ${sub.label}`);
                      navigate(sub.path);
                      if (isMobile) setOpen(false);
                    }}
                    className={`
                    pl-14 py-2 my-1 rounded-md duration-300 cursor-pointer flex gap-2 items-center
                    hover:text-[#000] hover:font-bold text-sm
                    ${
                      activePage === `Users › ${sub.label}`
                        ? "text-[yellow] font-bold"
                        : "text-[#fff]"
                    }
                  `}
                  >
                    {sub.label}
                  </li>
                ))}
              </div>
            )}

            {item.subItems &&
              item.label === "Products" &&
              productsOpen &&
              open && (
                <div className="flex flex-col">
                  {item.subItems.map((sub, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setActivePage(`Products › ${sub.label}`);
                        navigate(sub.path);
                        if (isMobile) setOpen(false);
                      }}
                      className={`
                      pl-14 py-2 my-1 rounded-md duration-300 cursor-pointer flex gap-2 items-center
                      hover:text-[#000] hover:font-bold text-sm
                      ${
                        activePage === `Products › ${sub.label}`
                          ? "text-[yellow] font-bold"
                          : "text-[#fff]"
                      }
                    `}
                    >
                      {sub.label}
                    </li>
                  ))}
                </div>
              )}
          </div>
        ))}
      </ul>
    </nav>
  );
}
