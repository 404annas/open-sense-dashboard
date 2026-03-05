import React, { useState } from "react";
import {
    Home,
    FileText,
    Users,
    BarChart2,
    Settings,
    Calendar,
    HelpCircle,
    ChevronDown,
    Tally1,
    X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import sidebarData from "../../Data/sidebarData";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../_core/Slices/authSlice";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import UserProfileMenu from "../UserProfileMenu/UserProfileMenu"; // Adjust path if necessary

export default function Sidebar({
    setIsColapsed,
    isCollapsed,
    isMobileOpen,
    toggleSidebar,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const links = sidebarData();
    const [activeTab, setActiveTab] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const handleLogout = () => {
        setIsModalOpen(false);
        dispatch(logout()); // Clear Redux + localStorage
        navigate("/"); // Instantly go to homepage
    };

    const handleMenuClick = (item, idx) => {
        if (item.sublinks) {
            setActiveTab((prev) => (prev === idx ? null : idx));
            setIsColapsed(false);
        } else {
            navigate(`/dashboard/${item.path}`);
        }
    };


    return (
        <>
            <ConfirmModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onConfirm={handleLogout}
                confirmText={"Logout"}
                title={"Are you sure you want to logout?"}
                variant={"danger"}
            />
            <div
                className={`bg-white border-r border-gray-200 shadow-lg sidebar fixed md:relative transition-all duration-300 z-[900]
        ${isMobileOpen ? "left-0" : "left-[-100%]"} md:left-0
        ${isCollapsed ? "w-20" : "w-60"} h-screen flex flex-col`}
            >
                <div className="p-4 flex items-center justify-between sidebar">
                    <div className="flex items-center">
                        <div className="size-8 rounded-md bg-gradient-to-b from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold">
                            O
                        </div>
                        {!isCollapsed && (
                            <h1 className="ml-2 text-xl font-semibold text-gray-800">
                                Open Sense
                            </h1>
                        )}
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden cursor-pointer">
                        <X size={15} />
                    </button>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 overflow-y-auto p-2">
                    {/* ... your existing navigation ul ... */}
                    <ul className="space-y-1 cursor-default">
                        {links.map((item, idx) => (
                            <li key={idx}>
                                <div
                                    onClick={() => handleMenuClick(item, idx)}
                                    className={`flex ${isCollapsed && "justify-center"
                                        } cursor-pointer items-center w-full text-xs p-2 rounded-md  transition-colors duration-200 ${location.pathname === `/dashboard/${item.path}`
                                            ? "bg-primary/20 font-medium border-l-3 hover:bg-primary/10 text-primary"
                                            : "text-gray-500  hover:bg-gray-200 hover:text-primary transition-colors duration-300"
                                        } relative`}
                                >
                                    {item.sublinks?.some(
                                        (sub) => location.pathname === `/dashboard/${sub.path}`
                                    ) && (
                                            <Tally1
                                                className={`size-8 text-primary ${isCollapsed ? "hidden" : "absolute -left-2"
                                                    }`}
                                            />
                                        )}
                                    <item.icon
                                        className={`md:size-6 size-3 ml-1 transition-colors ${location.pathname === `/dashboard/${item.path}` ||
                                            item.sublinks?.some(
                                                (sub) => location.pathname === `/dashboard/${sub.path}`
                                            )
                                            ? item.iconColor || "text-primary"
                                            : item.iconColor || "text-text-light"
                                            }`}
                                    />
                                    {!isCollapsed && (
                                        <span className="ml-2 flex-1">{item.label}</span>
                                    )}
                                    {!isCollapsed && item.sublinks && (
                                        <ChevronDown
                                            size={20}
                                            className={`transition-transform duration-300 ${activeTab === idx ? "rotate-180" : ""
                                                }`}
                                        />
                                    )}
                                </div>

                                {!isCollapsed && item.sublinks && (
                                    <AnimatePresence>
                                        {activeTab === idx && (
                                            <motion.ul
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="pl-6 overflow-hidden"
                                            >
                                                {item.sublinks.map((sublink, subIdx) => (
                                                    <li key={subIdx} className="pt-1">
                                                        <Link
                                                            to={`${sublink.path}`}
                                                            className={`flex items-center w-full pl-4 py-2 text-xs rounded-md hover:bg-gray-100 transition-colors duration-200 ${location.pathname ===
                                                                `/dashboard/${sublink.path}`
                                                                ? "text-primary"
                                                                : "text-text-light"
                                                                }`}
                                                        >
                                                            <sublink.icon
                                                                className={`size-4 ${location.pathname ===
                                                                    `/dashboard/${sublink.path}`
                                                                    ? "text-primary"
                                                                    : sublink.iconColor || "text-text-light"
                                                                    }`}
                                                            />
                                                            <span className="ml-3">{sublink.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Profile & Logout Section */}
                <div className="mt-auto  h-20 border-t border-gray-200">
                    <UserProfileMenu
                        isLoading={false}
                        isError={false}
                        isCollapsed={isCollapsed}
                        userInfo={userInfo}
                        onLogoutClick={() => setIsModalOpen(true)}
                    />
                </div>
            </div>
        </>
    );
}
