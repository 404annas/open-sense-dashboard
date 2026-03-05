"use client"

import { forwardRef } from "react"

const Button = forwardRef(
    (
        {
            children,
            variant = "primary",
            size = "md",
            icon,
            iconPosition = "left",
            fullWidth = false,
            isLoading = false,
            disabled = false,
            className = "",
            type = "button",
            ...props
        },
        ref,
    ) => {
        const variants = {
            primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/30",
            secondary: "bg-gray-800 text-white hover:bg-text-normal focus:ring-text-light/30",
            outline:
                "bg-transparent border border-gray-300 text-text-normal  hover:bg-normal-gray focus:ring-text-light/30  ",
            ghost:
                "bg-transparent text-text-normal hover:bg-gray-100 focus:ring-text-light/30 dark:text-gray-600 hover:text-white dark:hover:bg-gray-800",
            danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30",
            success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500/30",
            warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500/30",
            info: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500/30",
            light: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-text-light/30",
            dark: "bg-gray-800 text-white hover:bg-text-dark focus:ring-text-light/30",
            link: "bg-transparent text-primary hover:underline p-0 h-auto focus:ring-0",
        }

        const sizes = {
            sm: "text-xs px-2.5 py-1.5 rounded-md",
            md: "text-sm px-4 py-2 rounded-md",
            lg: "text-base px-5 py-2.5 rounded-lg",
            xl: "text-lg px-6 py-3 rounded-lg",
        }

        const baseClasses =
            "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

        const getIconClasses = () => {
            switch (size) {
                case "sm":
                    return "size-3.5"
                case "md":
                    return "size-4"
                case "lg":
                    return "size-5"
                case "xl":
                    return "size-6"
                default:
                    return "size-4"
            }
        }

        const getIconSpacing = () => {
            switch (size) {
                case "sm":
                    return "mr-1.5"
                case "md":
                    return "mr-2"
                case "lg":
                    return "mr-2.5"
                case "xl":
                    return "mr-3"
                default:
                    return "mr-2"
            }
        }

        const iconClasses = getIconClasses()
        const iconSpacing = iconPosition === "left" ? getIconSpacing() : ""
        const iconSpacingRight = iconPosition === "right" ? getIconSpacing().replace("mr-", "ml-") : ""

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled || isLoading}
                className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
                {...props}
            >
                {isLoading && (
                    <svg
                        className={`animate-spin ${iconClasses} ${iconSpacing} `}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {!isLoading && icon && iconPosition === "left" && <span className={iconSpacing}>{icon}</span>}
                {children}
                {!isLoading && icon && iconPosition === "right" && <span className={iconSpacingRight}>{icon}</span>}
            </button>
        )
    },
)

Button.displayName = "Button"

export default Button
