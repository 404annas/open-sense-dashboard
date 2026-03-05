// --- START OF FILE: src/routes.jsx ---
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./Helper/ProtectedRoutes";
import routesData from "./Data/routesData";

// Helper to render routes
const renderRoutes = (routes, parentPath = "") => {
    return routes.map((route, i) => {
        // Humne 'key' ko routeProps se alag kar liya hai.
        const { path, element, requiredRole, index, children } = route;
        const key = `${parentPath}-${path || i}`; // Make a more unique key

        const routeProps = {
            // key ab yahan nahi hai
            path: index ? undefined : path,
            index: index || false,
            element: requiredRole
                ? (
                    <ProtectedRoutes requiredRole={requiredRole}>
                        {element}
                    </ProtectedRoutes>
                )
                : element,
        };

        if (children) {
            return (
                // `key` ko seedha yahan pass kiya gaya hai
                <Route key={key} path={path} element={element}>
                    {renderRoutes(children, path)}
                </Route>
            );
        }

        // `key` ko seedha yahan pass kiya gaya hai
        return <Route key={key} {...routeProps} />;
    });
};

const AppRoutes = () => {
    const routes = routesData();

    return (
        <Suspense fallback={<div className="p-4">Loading...</div>}>
            <Routes>
                {renderRoutes(routes)}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
// --- END OF FILE: src/routes.jsx ---