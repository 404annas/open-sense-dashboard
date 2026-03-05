// File: src/constants/userConstants.js
export const USER_ROLE_OPTIONS = [
    { value: "", label: "All Roles" },
    { value: "superadmin", label: "Superadmin" },
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "author", label: "Author" },
    { value: "reader", label: "Reader" },
];

// You might also centralize assignableRoles logic here or keep it in CreateUserForm if it's dynamic based on current user.
// For now, just the main roleOptions.
