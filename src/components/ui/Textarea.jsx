"use client"

import { forwardRef } from "react"

const Textarea = forwardRef(
    (
        {
            id,
            label,
            placeholder,
            helperText,
            error,
            disabled = false,
            readOnly = false,
            required = false,
            rows = 4, // A common and useful prop for textareas
            className = "",
            containerClassName = "",
            labelClassName = "",
            textareaClassName = "", // Renamed from inputClassName for clarity
            helperClassName = "",
            errorClassName = "",
            ...props
        },
        ref,
    ) => {
        // Generate a unique ID if not provided, for label-textarea linking
        const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className={`block text-sm font-medium text-text-normal mb-1 ${labelClassName} ${disabled ? "opacity-60" : ""}`}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                {/* 
                  The 'relative' container for icons is removed as it's not a common
                  pattern for multi-line textareas.
                */}
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows} // Control the visible height of the textarea
                    className={`block bg-white w-full rounded-md border border-gray-400 shadow-sm 
              focus:ring-primary focus:ring focus:outline-none px-3 py-2
              disabled:bg-gray-100 disabled:text-text-light disabled:cursor-not-allowed
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20" : ""}
              ${textareaClassName}
              ${className}`}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
                    {...props}
                />

                {helperText && !error && (
                    <p id={`${textareaId}-helper`} className={`mt-1 text-xs text-text-light ${helperClassName}`}>
                        {helperText}
                    </p>
                )}

                {error && (
                    <p id={`${textareaId}-error`} className={`mt-1 text-xs text-red-500 ${errorClassName}`}>
                        {error}
                    </p>
                )}
            </div>
        )
    },
)

Textarea.displayName = "Textarea"

export default Textarea