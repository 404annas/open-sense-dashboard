// --- START OF FILE: src/helpers/hasPermission.js ---

// All roles in lowercase for consistent matching

import getRole from './getRole';
const ROLES = {
    admin: 1,
    user: 0
};

/**
 * Checks if a user's role meets the minimum required role.
 * @param {string} userRole - The role of the current user (e.g., 'superadmin').
 * @param {string} requiredRole - The minimum role required for access (e.g., 'editor').
 * @returns {boolean} - True if the user has sufficient permissions.
 */
export const hasPermission = (requiredRole) => {
    // **DEBUGGING LOG:** Check what values are being passed

    // If userRole is not a valid string, deny access immediately.
    const userRole = getRole()
    console.log(userRole)
    if (!userRole || typeof userRole !== 'string') {
        // console.log("Permission denied: userRole is invalid.");
        return false;
    }

    // If requiredRole is not a valid string, deny access.
    if (!requiredRole || typeof requiredRole !== 'string') {
        // console.log("Permission denied: requiredRole is invalid.");
        return false;
    }

    // **THE FIX:** Convert both roles to lowercase before comparison.
    const userLevel = ROLES[userRole.toLowerCase()] ?? -1;
    const requiredLevel = ROLES[requiredRole.toLowerCase()] ?? -1;

    // **DEBUGGING LOG:** Check the determined levels
    // console.log(`Levels: UserLevel=${userLevel}, RequiredLevel=${requiredLevel}`);

    // The user has permission if their level is greater than or equal to the required level.
    const result = userLevel >= requiredLevel;
    // console.log(`Permission granted: ${result}`);

    return result;
};


// --- END OF FILE: src/helpers/hasPermission.js ---