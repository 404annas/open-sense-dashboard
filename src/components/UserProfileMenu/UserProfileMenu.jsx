// src/components/UserProfileMenu.jsx

import React from "react";
import { LogOut } from "lucide-react";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

export default function UserProfileMenu({
  isCollapsed,
  userInfo,
  onLogoutClick,
  isLoading,
  error,
  isError
}) {
  // If there's no user information, don't render anything.
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><p>Loading profile...</p></div>;
  }
  if (isError) {
    return <div className="flex items-center justify-center h-screen"><p>Error fetching profile: {error?.message}</p></div>;
  }

  // In Open Sense backend, user info has name, email, and role
  const { name, email, role } = userInfo?.user || {};

  // --- RENDER FOR COLLAPSED SIDEBAR ---
  // Shows only the avatar and a logout icon button.
  if (isCollapsed) {
    return (
      <div className="p-3 flex flex-col items-center gap-y-2">
        {/* Avatar */}
        <div className="size-9 bg-primary text-white flex items-center justify-center rounded-full font-bold text-xs shrink-0">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>

        {/* Logout Icon Button */}
        <button
          onClick={onLogoutClick}
          className="p-2 rounded-lg cursor-pointer text-red-500 hover:bg-red-50 transition-colors duration-200"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 flex items-center">
      {/* Avatar */}
      <Link to={'/dashboard/profile-settings'}>
        <div className="size-9 bg-primary text-white flex items-center justify-center rounded-full font-bold text-sm shrink-0">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>
      </Link>

      {/* User Info */}
      <div className="flex-1 ml-3 overflow-hidden">
        <p className="text-xs font-semibold text-text-normal leading-tight truncate">
          {name || email}
        </p>
        <p className="text-xs text-text-light capitalize leading-tight">
          {role || 'user'}
        </p>
      </div>

      {/* Logout Icon Button */}
      <button
        onClick={onLogoutClick}
        className="ml-2 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
        aria-label="Logout"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}
