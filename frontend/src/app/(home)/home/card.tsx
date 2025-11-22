import Link from "next/link";
import React from "react";
import { CiAlarmOn } from "react-icons/ci";

export default function HomeCard({
    title,
    icon,
    description,
    href,
    ariaLabel,
    color,
    variant,
}: {
    title?: string;
    icon?: React.ReactNode;
    description?: string;
    href: string;
    ariaLabel?: string;
    color?: "create" | "ranking" | "play";
    variant?: "defaut" | "theme";
}) {
    const label =
        ariaLabel || `${title}${description ? ` - ${description}` : ""}`;
    const colorClasses = {
        create: "category-create",
        ranking: "category-ranking",
        play: "category-play",
    };

    const variantClasses = {
        defaut: "",
        theme: "max-h-27 min-w-100 hover:bg-layout-theme-hover w-full",
    };

    const colorKey: keyof typeof colorClasses = color ?? "play";
    const variantKey: keyof typeof variantClasses = variant ?? "defaut";

    const colorBorderClass = {
        create: "border-category-create",
        ranking: "border-category-ranking",
        play: "border-category-play",
    };

    return (
        <Link
            href={href}
            className={`${variantClasses[variantKey]} ${colorBorderClass[colorKey]} bg-layout-card items-center p-4 rounded-lg shadow-md h-35 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:shadow-lg transition-all duration-200 border `}
            aria-label={label}
            role="button"
            tabIndex={0}
        >
            <div
                className='flex items-center space-x-2 mb-2'
            >
                {icon && variant != "theme" && (
                    <span aria-hidden="true" className="shrink-0 text-center">
                        {React.isValidElement(icon)
                            ? React.cloneElement(
                                  icon as React.ReactElement<{
                                      className?: string;
                                      strokeWidth?: number;
                                  }>,
                                  {
                                      className: `size-6 ${colorClasses[colorKey]} text-center center`,
                                      strokeWidth: 1,
                                  }
                              )
                            : icon}
                    </span>
                )}
                {title && (
                    <h2
                        className='text-xl font-medium'
                    >
                        {title}
                        {description && variant == "theme" && (
                            <div className="text-sm font-normal mt-3">
                                <p className=" leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        )}
                    </h2>
                )}
            </div>
            {description && variant != "theme" && (
                <div>
                    <p className=" leading-relaxed">{description}</p>
                </div>
            )}
        </Link>
    );
}
