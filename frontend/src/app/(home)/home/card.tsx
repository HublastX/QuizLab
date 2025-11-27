import Link from "next/link";
import React from "react";

export default function HomeCard({
    title,
    icon,
    description,
    href,
    ariaLabel,
    color = "play",
    variant = "defaut",
    cornerIcon,
}: {
    title?: string;
    icon?: React.ReactNode;
    description?: string;
    href: string;
    ariaLabel?: string;
    color?: "create" | "ranking" | "play";
    variant?: "defaut" | "theme";
    cornerIcon?: React.ReactNode;
}) {
    const label =
        ariaLabel || `${title}${description ? ` - ${description}` : ""}`;
    const colorClasses = {
        create: "category-create",
        ranking: "category-ranking",
        play: "category-play",
    };

    const variantClasses = {
        defaut: "relative group",
        theme: "max-h-27 min-w-100 hover:bg-layout-theme-hover w-full",
    };

    const colorKey: keyof typeof colorClasses = color;
    const variantKey: keyof typeof variantClasses = variant;

    return (
        <Link
            href={href}
            className={`${variantClasses[variantKey]} bg-layout-card items-center p-4 rounded-lg shadow-md h-35 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:shadow-lg transition-all duration-200 border hover:shadow-xl hover:border-qorange-default hover:border-2 relative`}
            aria-label={label}
            role="button"
            tabIndex={0}
        >
            <div className='flex items-center space-x-2 mb-2'>
                {icon && variant != "theme" && (
                    <span 
                        aria-hidden="true" 
                        className="shrink-0 text-center p-2 rounded-lg group-hover:text-qorange-default transition-colors duration-200"
                    >
                        {React.isValidElement(icon)
                            ? React.cloneElement(
                                  icon as React.ReactElement<{
                                      className?: string;
                                      strokeWidth?: number;
                                  }>,
                                  {
                                      className: `size-6 ${colorClasses[colorKey]} text-center center group-hover:text-qorange-default transition-colors duration-200`,
                                      strokeWidth: 1,
                                  }
                              )
                            : icon}
                    </span>
                )}
                {title && (
                    <h2 className='text-xl font-medium group-hover:text-qorange-default transition-colors duration-200'>
                        {title}
                        {description && variant == "theme" && (
                            <div className="text-sm font-normal mt-3">
                                <p className="leading-relaxed group-hover:text-qorange-default transition-colors duration-200">
                                    {description}
                                </p>
                            </div>
                        )}
                    </h2>
                )}
            </div>
            {description && variant != "theme" && (
                <div>
                    <p className="leading-relaxed group-hover:text-qorange-default transition-colors duration-200">{description}</p>
                </div>
            )}
            
            {cornerIcon && variant != "theme" && (
                <div className="absolute bottom-3 right-3">
                    <span aria-hidden="true">
                        {React.isValidElement(cornerIcon)
                            ? React.cloneElement(
                                  cornerIcon as React.ReactElement<{
                                      className?: string;
                                      size?: number;
                                  }>,
                                  {
                                      className: "size-5 group-hover:text-qorange-default transition-colors duration-200",
                                      size: 20,
                                  }
                              )
                            : cornerIcon}
                    </span>
                </div>
            )}
        </Link>
    );
}