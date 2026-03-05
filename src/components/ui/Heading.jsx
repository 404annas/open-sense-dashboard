"use client"

const Heading = ({ level = 2, title, subtitle, description, actions, className = "", ...props }) => {
    const HeadingTag = `h${level}`

    const headingClasses = {
        1: "text-3xl font-bold text-text-dark",
        2: "text-2xl font-semibold text-gray-800",
        3: "text-xl font-semibold text-gray-800",
        4: "text-lg font-medium text-gray-800",
        5: "text-base font-medium text-gray-800",
        6: "text-sm font-medium text-gray-800",
    }

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${className}`} {...props}>
            <div className="flex-1 capitalize">
                <HeadingTag className={headingClasses[level]}>{title}</HeadingTag>
                {subtitle && <p className="text-sm font-medium text-gray-600 mt-1">{subtitle}</p>}
                {description && <p className="text-sm text-text-light mt-2 max-w-2xl">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
    )
}

export default Heading
