// --- START OF FILE: src/Helper/ProtectedRoutes.jsx ---
import React from 'react';
import { Navigate } from 'react-router-dom';
// IMPORTANT: Make sure this path is correct for your project
import { hasPermission } from '../Helper/hasPermission';
import getRole from './getRole';

const ProtectedRoutes = ({ requiredRole, children }) => {


    // 4. Check for permission using the correct role.
    if (!hasPermission(requiredRole)) {
        // If permission is denied, redirect to a dedicated "Not Found" or "Unauthorized" page.
        // Make sure you have a route for '/dashboard/not-found' that renders your NotFound component.
        return <Navigate to="/dashboard/not-found" replace />;
    }

    // 5. If all checks pass, render the child components (the actual page).
    return children;
};

export default ProtectedRoutes;
// --- END OF FILE: src/Helper/ProtectedRoutes.jsx ---