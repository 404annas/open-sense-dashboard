import AuthPanel from "../Pages/AuthPanel/AuthPanel";
import VerifyOtp from "../Pages/VerifyOtp/VerifyOtp";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import ResetPasswordVerify from "../Pages/ResetPasswordVerify/ResetPasswordVerify";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import ChangePassword from "../Pages/ChangePassword/ChangePassword";
import Dashboard from "../Pages/Dashboard/Dashboard";
import DashboardHome from "../Pages/DashboardHome/DashboardHome";
import NotFound from "../Pages/NotFound/NotFound";
import ProjectsList from "../Pages/Projects/ProjectsList";
import CreateProject from "../Pages/Projects/CreateProject";
import EditProject from "../Pages/Projects/EditProject";
import Categories from "../Pages/Categories/Categories";
const routesData = () => [
    { path: "/", element: <AuthPanel /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password-verify/:email", element: <ResetPasswordVerify /> },
    { path: "/reset-password/:email", element: <ResetPassword /> },
    { path: "/signup/verify-otp/:email", element: <VerifyOtp /> },
    {
        path: "/dashboard",
        element: <Dashboard />, // layout
        requiredRole: "user",
        children: [
            {
                path: "",
                element: <DashboardHome />,
                requiredRole: "user",
            },
            {
                path: "change-password",
                element: <ChangePassword />,
                requiredRole: "user",
            },
            // {
            //     path: "profile-settings",
            //     element: <ProfilePage />,
            //     requiredRole: "user",
            // },
            {
                path: "projects",
                element: <ProjectsList />,
                requiredRole: "superadmin",
            },
            {
                path: "projects/create",
                element: <CreateProject />,
                requiredRole: "superadmin",
            },
            {
                path: "projects/edit/:id",
                element: <EditProject />,
                requiredRole: "superadmin",
            },
            {
                path: "categories",
                element: <Categories />,
                requiredRole: "superadmin",
            },

        ],
    },
    { path: "*", element: <NotFound /> },
];

export default routesData;
