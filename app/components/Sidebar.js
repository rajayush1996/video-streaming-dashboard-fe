"use client";
import Link from "next/link";
import { Button, Select } from "@mantine/core";
import AppToggle from "./AppToggle";

export default function Sidebar({ appName, setAppName }) {
  return (
    <div className="w-1/4 h-screen bg-[#0f172a] text-white fixed top-0 left-0 flex flex-col px-6 py-8 space-y-8 shadow-lg font-[Poppins]">
      {/* App Switcher Dropdown */}
      <AppToggle appName={appName} setAppName={setAppName} />


      {/* Navigation Buttons */}
      <nav className="flex flex-col gap-4">
        <NavItem href="/videos" text="Video Management" />
        <NavItem href="/blogs" text="Blog Management" />
        <NavItem href="/users" text="User Management" />
        <NavItem href="/settings" text="Settings" />
        <NavItem href="/logout" text="Logout" />
      </nav>
    </div>
  );
}

const NavItem = ({ href, text }) => (
  <div className="w-full">
    <Link href={href} className="block w-full no-underline">
      <Button
        fullWidth
        radius="md"
        size="md"
        styles={{
          root: {
            backgroundColor: "#334155",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            padding: "12px",
            borderRadius: "10px",
            transition: "all 0.2s ease",
            fontFamily: "Poppins, sans-serif",
          },
          rootHovered: {
            backgroundColor: "#60a5fa",
          },
        }}
      >
        {text}
      </Button>
    </Link>
  </div>
);
