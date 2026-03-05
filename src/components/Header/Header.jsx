import React from "react";
import { Bell, MessageSquare, Search, Settings, Menu } from "lucide-react";
import { Link } from "react-router";
import {
  PersonOutline,
} from "@mui/icons-material";
export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button className="hover:text-black" onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-text-normal  cursor-pointer" />
        </button>
        <div className="relative w-64 max-w-full max-md:hidden">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-10 pr-4 rounded-md bg-gray-100 border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-sm"
          />
          <Search className="absolute left-3 top-2.5 size-4 text-gray-400 " />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* <button className="relative p-2 rounded-full hover:bg-gray-100">
                    <Bell className="size-5 text-text-light" />
                    <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500"></span>
                </button>
                <button className="relative p-2 rounded-full hover:bg-gray-100">
                    <MessageSquare className="size-5 text-text-light" />
                    <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500"></span>
                </button> */}
        <Link
          to={"/dashboard/profile-settings"}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <PersonOutline className="size-5 text-text-light" />
        </Link>
      </div>
    </header>
  );
}
