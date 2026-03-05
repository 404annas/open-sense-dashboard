"use client"

const Card = ({ children, className = "", variant = "default", padding = "sm", ...props }) => {
    const variants = {
        default: "bg-white border border-gray-200 shadow-sm",
        elevated: "bg-white border border-gray-200 shadow-md",
        bordered: "bg-white border-2 border-gray-200",
        flat: "bg-white border border-gray-100",
    }

    const paddings = {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
    }

    return (
        <div className={`rounded-lg ${variants[variant]} ${paddings[padding]} ${className}`} {...props}>
            {children}
        </div>
    )
}

const CardHeader = ({ title, subtitle, actions, className = "", ...props }) => {
    return (
        <div className={`flex items-center justify-between pb-4 border-b border-gray-200 mb-4 ${className}`} {...props}>
            <div>
                {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
                {subtitle && <p className="text-sm text-text-light mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    )
}

const CardBody = ({ children, className = "", ...props }) => {
    return (
        <div className={`${className}`} {...props}>
            {children}
        </div>
    )
}

const CardFooter = ({ children, className = "", ...props }) => {
    return (
        <div className={`pt-4 mt-4 border-t border-gray-200 ${className}`} {...props}>
            {children}
        </div>
    )
}

// Export compound component
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
