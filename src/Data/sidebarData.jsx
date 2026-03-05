import {
    Home,
    FileText,
    Plus,
    Edit3,
    Mail,
    Calculator,
    Users,
    Settings,
    Shield,
    User,
    BarChart3,
    Eye
} from "lucide-react";
import { hasPermission } from "../Helper/hasPermission";

/**
 * A custom hook that generates a role-aware sidebar navigation structure.
 * It filters both top-level links and nested sub-links based on the logged-in user's role.
 */
export default function useSidebarData() {
    // Get the current user's role from the Redux store

    // Define the complete sidebar structure with required roles for each item
    const allSidebarItems = [
        {
            label: "Dashboard",
            path: "", // It's good practice to provide a full base path
            icon: Home,
            iconColor: "text-blue-500",
            requiredRole: "user", // Any logged-in user can see the dashboard
        },
        {
            label: "Projects",
            icon: FileText,
            iconColor: "text-green-500",
            requiredRole: "superadmin", // Only superadmins can manage projects
            sublinks: [
                {
                    label: "All Projects",
                    path: "projects",
                    icon: Eye,
                    iconColor: "text-cyan-500",
                    requiredRole: "superadmin",
                },
                {
                    label: "Create Project",
                    path: "projects/create",
                    icon: Plus,
                    iconColor: "text-emerald-500",
                    requiredRole: "superadmin",
                },
            ],
        },
        {
            label: "Categories",
            path: "categories",
            icon: FileText,
            iconColor: "text-yellow-500",
            requiredRole: "superadmin",
        },

        {
            label: "User Management",
            path: "users",
            icon: Users,
            iconColor: "text-teal-500",
            requiredRole: "superadmin",
        },
        {
            label: "Analytics",
            path: "analytics",
            icon: BarChart3,
            iconColor: "text-indigo-500",
            requiredRole: "superadmin",
        },
        {
            label: "Profile Settings",
            path: "profile-settings",
            icon: User,
            iconColor: "text-gray-500",
            requiredRole: "user",
        },
        {
            label: "Change Password",
            path: "change-password",
            icon: Settings,
            iconColor: "text-gray-600",
            requiredRole: "user",
        },
    ];

    // 1. First, filter the top-level items based on the user's role.
    const accessibleTopLevelItems = allSidebarItems.filter((item) => {
        return hasPermission(item.requiredRole);
    });

    // 2. Next, map over the accessible items to also filter their sub-links.
    const finalSidebarItems = accessibleTopLevelItems.map((item) => {
        // If the item has sub-links, filter them
        if (item.sublinks && Array.isArray(item.sublinks)) {
            const accessibleSublinks = item.sublinks.filter((sublink) => {
                return hasPermission(sublink.requiredRole);
            });
            // Return a new item object with the filtered sub-links
            return { ...item, sublinks: accessibleSublinks };
        }
        // If there are no sub-links, return the item as is
        return item;
    });

    return finalSidebarItems;
}
