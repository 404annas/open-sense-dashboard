"use client"

import { forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const Input = forwardRef(
    (
        {
            id,
            label,
            type = "text",
            placeholder,
            helperText,
            error,
            leftIcon,
            rightIcon,
            disabled = false,
            readOnly = false,
            required = false,
            className = "",
            containerClassName = "",
            labelClassName = "",
            inputClassName = "",
            helperClassName = "",
            errorClassName = "",
            showPasswordToggle = false,
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = useState(false)
        const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`
        const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`block text-sm font-medium text-text-normal mb-1 ${labelClassName} ${disabled ? "opacity-60" : ""}`}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                            {typeof leftIcon === "string" ? (
                                <span className="text-text-light ">{leftIcon}</span>
                            ) : (
                                <span className="text-text-light ">{leftIcon}</span>
                            )}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}

                        className={`block w-full rounded-md border border-gray-400 shadow-sm 
                focus:ring-primary focus:ring focus:outline-none px-3 bg-white
              disabled:bg-gray-100 disabled:text-text-light disabled:cursor-not-allowed py-3
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20" : ""}
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon || (showPasswordToggle && type === "password") ? "pr-10" : ""}
              ${inputClassName}
              ${className}`}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readOnly}
                        required={required}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                        {...props}
                    />

                    {rightIcon && !showPasswordToggle && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            {typeof rightIcon === "string" ? (
                                <span className="text-text-light">{rightIcon}</span>
                            ) : (
                                <span className="text-text-light">{rightIcon}</span>
                            )}
                        </div>
                    )}

                    {showPasswordToggle && type === "password" && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    )}
                </div>

                {helperText && !error && (
                    <p id={`${inputId}-helper`} className={`mt-1 text-xs text-text-light ${helperClassName}`}>
                        {helperText}
                    </p>
                )}

                {error && (
                    <p id={`${inputId}-error`} className={`mt-1 text-xs text-red-500 ${errorClassName}`}>
                        {error}
                    </p>
                )}
            </div>
        )
    },
)

Input.displayName = "Input"

export default Input
