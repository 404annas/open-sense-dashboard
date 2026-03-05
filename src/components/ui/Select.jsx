"use client"

import { forwardRef, useState, useRef, useEffect } from "react"
import { ChevronDown, Search, Check, X } from "lucide-react"

const Select = forwardRef(
    (
        {
            id,
            label,
            options = [],
            value,
            onChange,
            placeholder = "Select an option",
            searchPlaceholder = "Search options...",
            helperText,
            error,
            disabled = false,
            required = false,
            multiple = false,
            searchable = true,
            clearable = false,
            loading = false,
            maxHeight = "200px",
            className = "",
            containerClassName = "",
            labelClassName = "",
            helperClassName = "",
            errorClassName = "",
            renderOption,
            renderValue,
            noOptionsText = "No options found",
            ...props
        },
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState(false)
        const [searchTerm, setSearchTerm] = useState("")
        const [highlightedIndex, setHighlightedIndex] = useState(-1)
        const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`

        const dropdownRef = useRef(null)
        const searchInputRef = useRef(null)
        const optionsRef = useRef([])

        // Filter options based on search term
        const filteredOptions = searchable && options
            ? options.filter((option) => option?.label?.toLowerCase().includes(searchTerm?.toLowerCase()))
            : options

        // Get selected option(s)
        const selectedOptions = multiple
            ? options.filter((option) => value?.includes(option.value))
            : options.find((option) => option.value === value)

        // Handle click outside to close dropdown
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false)
                    setSearchTerm("")
                    setHighlightedIndex(-1)
                }
            }

            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }, [])

        // Focus search input when dropdown opens
        useEffect(() => {
            if (isOpen && searchable && searchInputRef.current) {
                searchInputRef.current.focus()
            }
        }, [isOpen, searchable])

        // Handle keyboard navigation
        useEffect(() => {
            const handleKeyDown = (event) => {
                if (!isOpen) return

                switch (event.key) {
                    case "ArrowDown":
                        event.preventDefault()
                        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
                        break
                    case "ArrowUp":
                        event.preventDefault()
                        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
                        break
                    case "Enter":
                        event.preventDefault()
                        if (highlightedIndex >= 0) {
                            handleOptionSelect(filteredOptions[highlightedIndex])
                        }
                        break
                    case "Escape":
                        setIsOpen(false)
                        setSearchTerm("")
                        setHighlightedIndex(-1)
                        break
                }
            }

            document.addEventListener("keydown", handleKeyDown)
            return () => document.removeEventListener("keydown", handleKeyDown)
        }, [isOpen, highlightedIndex, filteredOptions])

        // Scroll highlighted option into view
        useEffect(() => {
            if (highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
                optionsRef.current[highlightedIndex].scrollIntoView({
                    block: "nearest",
                    behavior: "smooth",
                })
            }
        }, [highlightedIndex])

        const handleToggleDropdown = () => {
            if (disabled) return
            setIsOpen(!isOpen)
            if (!isOpen) {
                setSearchTerm("")
                setHighlightedIndex(-1)
            }
        }

        const handleOptionSelect = (option) => {
            if (multiple) {
                const newValue = value?.includes(option.value)
                    ? value.filter((v) => v !== option.value)
                    : [...(value || []), option.value]
                onChange?.({ target: { value: newValue, name: props.name } })
            } else {
                onChange?.({ target: { value: option.value, name: props.name } })
                setIsOpen(false)
                setSearchTerm("")
            }
            setHighlightedIndex(-1)
        }

        const handleClear = (e) => {
            e.stopPropagation()
            onChange?.({ target: { value: multiple ? [] : "", name: props.name } })
        }

        const handleRemoveOption = (optionValue, e) => {
            e.stopPropagation()
            if (multiple) {
                const newValue = value.filter((v) => v !== optionValue)
                onChange?.({ target: { value: newValue, name: props.name } })
            }
        }

        const getDisplayValue = () => {
            if (multiple) {
                if (!selectedOptions || selectedOptions.length === 0) return placeholder
                if (selectedOptions.length === 1) return selectedOptions[0].label
                return `${selectedOptions.length} items selected`
            }
            return selectedOptions?.label || placeholder
        }

        const highlightMatch = (text, search) => {
            if (!search) return text
            const regex = new RegExp(`(${search})`, "gi")
            const parts = text.split(regex)
            return parts.map((part, index) =>
                regex.test(part) ? (
                    <mark key={index} className="bg-yellow-200 text-text-dark">
                        {part}
                    </mark>
                ) : (
                    part
                ),
            )
        }

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className={`block text-sm font-medium text-text-normal mb-2 ${labelClassName} ${disabled ? "opacity-60" : ""}`}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative min-w-40" ref={dropdownRef}>
                    {/* Select Trigger */}
                    <button
                        ref={ref}
                        id={selectId}
                        type="button"
                        className={`relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary
              disabled:bg-gray-100 disabled:text-text-light disabled:cursor-not-allowed
              transition-all duration-200 hover:border-gray-400
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20" : ""}
              ${isOpen ? "ring-2 ring-primary ring-opacity-20 border-primary" : ""}
              ${className}`}
                        onClick={handleToggleDropdown}
                        disabled={disabled}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        aria-invalid={error ? "true" : "false"}
                        {...props}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1 min-w-0">
                                {multiple && selectedOptions && selectedOptions.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 max-w-full">
                                        {selectedOptions.slice(0, 2).map((option) => (
                                            <span
                                                key={option.value}
                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary max-w-[120px]"
                                            >
                                                <span className="truncate">{option.label}</span>
                                                <button
                                                    type="button"
                                                    className="ml-1 hover:text-primary/80"
                                                    onClick={(e) => handleRemoveOption(option.value, e)}
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </span>
                                        ))}
                                        {selectedOptions.length > 2 && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                                +{selectedOptions.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span
                                        className={`block truncate ${(!multiple && !selectedOptions) ||
                                            (multiple && (!selectedOptions || selectedOptions.length === 0))
                                            ? "text-text-light"
                                            : "text-text-dark"
                                            }`}
                                    >
                                        {renderValue ? renderValue(selectedOptions) : getDisplayValue()}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-1">
                                {clearable && ((multiple && selectedOptions?.length > 0) || (!multiple && selectedOptions)) && (
                                    <button
                                        type="button"
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                        onClick={handleClear}
                                    >
                                        <X className="size-4 text-gray-400" />
                                    </button>
                                )}
                                <ChevronDown
                                    className={`size-5 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                                        }`}
                                />
                            </div>
                        </div>
                    </button>

                    {/* Dropdown */}
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {/* Search Input */}
                            {searchable && (
                                <div className="p-3 border-b border-gray-100">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                            placeholder={searchPlaceholder}
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value)
                                                setHighlightedIndex(-1)
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Options List */}
                            <div className="max-h-60 overflow-auto py-1" style={{ maxHeight }}>
                                {loading ? (
                                    <div className="px-3 py-8 text-center">
                                        <div className="inline-flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                            <span className="text-sm text-text-light">Loading...</span>
                                        </div>
                                    </div>
                                ) : filteredOptions.length === 0 ? (
                                    <div className="px-3 py-8 text-center">
                                        <span className="text-sm text-text-light">{noOptionsText}</span>
                                    </div>
                                ) : (
                                    filteredOptions.map((option, index) => {
                                        const isSelected = multiple ? value?.includes(option.value) : value === option.value
                                        const isHighlighted = index === highlightedIndex

                                        return (
                                            <button
                                                key={option.value}
                                                ref={(el) => (optionsRef.current[index] = el)}
                                                type="button"
                                                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150 flex items-center justify-between
                          ${isHighlighted ? "bg-primary/10" : "hover:bg-gray-50"}
                          ${isSelected ? "text-primary bg-primary/5" : "text-text-dark"}
                        `}
                                                onClick={() => handleOptionSelect(option)}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    {renderOption ? (
                                                        renderOption(option, { isSelected, isHighlighted, searchTerm })
                                                    ) : (
                                                        <div>
                                                            <div className="font-medium">{highlightMatch(option.label, searchTerm)}</div>
                                                            {option.description && (
                                                                <div className="text-xs text-text-light mt-1">
                                                                    {highlightMatch(option.description, searchTerm)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {isSelected && <Check className="size-4 text-primary flex-shrink-0 ml-2" />}
                                            </button>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {helperText && !error && <p className={`mt-2 text-xs text-text-light ${helperClassName}`}>{helperText}</p>}

                {error && <p className={`mt-2 text-xs text-red-500 ${errorClassName}`}>{error}</p>}
            </div>
        )
    },
)

Select.displayName = "Select"

export default Select
