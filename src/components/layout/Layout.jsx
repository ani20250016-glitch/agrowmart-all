import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, ensure sidebar starts closed
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setOpen]);

  return (
    <div className="flex">
      <Sidebar
        open={open}
        setOpen={setOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div
        className={`flex-1 duration-500`}
        style={{
          marginLeft: isMobile ? "0px" : open ? "240px" : "64px", // No margin on mobile (sidebar overlays)
        }}
      >
        <Header
          open={open}
          setOpen={setOpen}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <div className="p-5 pt-18">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
