// src/components/NavItem.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function NavItem({
  item,
  isCollapsed,
  isActive,
  isSubActive,
  isOpen,
  onClick,
}) {
  const hasSublinks = item.sublinks && item.sublinks.length > 0;

  return (
    <li className="transition-colors duration-200">
      <div
        onClick={onClick}
        className={`flex items-center w-full text-sm p-2.5 rounded-lg cursor-pointer transition-all duration-200
          ${isCollapsed ? "justify-center" : ""}
          ${
            isActive || isSubActive
              ? "text-primary bg-primary/10"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          }
        `}
      >
        <item.icon
          className={`size-5 transition-colors duration-200 ${
            isActive || isSubActive ? "text-primary" : "text-gray-400"
          }`}
          strokeWidth={isActive || isSubActive ? 2.5 : 2}
        />

        {!isCollapsed && (
          <span className="ml-4 font-medium flex-1">{item.label}</span>
        )}

        {!isCollapsed && hasSublinks && (
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {/* Submenu with Smooth Animation */}
      {!isCollapsed && hasSublinks && (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="ml-5 pl-4 border-l border-gray-200 overflow-hidden"
            >
              {item.sublinks.map((sublink, subIdx) => {
                const isSublinkActive =
                  location.pathname === `/dashboard/${sublink.path}`;
                return (
                  <li key={subIdx} className="pt-2">
                    <Link
                      to={sublink.path}
                      className={`flex items-center w-full p-2 text-sm rounded-md transition-colors duration-200
                        ${
                          isSublinkActive
                            ? "text-primary font-medium"
                            : "text-gray-500 hover:text-primary"
                        }
                      `}
                    >
                      <span className="w-1.5 h-1.5 rounded-full mr-4 ${isSublinkActive ? 'bg-primary' : 'bg-gray-300'}"></span>
                      <span>{sublink.label}</span>
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}
