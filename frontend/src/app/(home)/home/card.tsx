import Link from "next/link";
import React from "react";

export default function HomeCard({
    title,
    icon,
    description,
    href,
    ariaLabel,
    color,
}: {
    title?: string;
    icon?: React.ReactNode;
    description?: string;
    href: string;
    ariaLabel?: string;
    color?: "create" | "ranking" | "play";
}) {
    const label =
        ariaLabel || `${title}${description ? ` - ${description}` : ""}`;
    const colorClasses = {
        create: "category-create",
        ranking: "category-ranking",
        play: "category-play",
    };

    const colorKey: keyof typeof colorClasses = color ?? "play";

    return (
        <Link
            href={href}
            className={`bg-layout-card items-center p-4 rounded-lg shadow-md h-35 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:shadow-lg transition-all duration-200 border border-${colorClasses[colorKey]}`}
            aria-label={label}
            role="button"
            tabIndex={0}
        >
            <div className="flex items-center space-x-2 mb-2">
                {icon && (
                    <span aria-hidden="true" className="shrink-0 text-center">
                        {React.isValidElement(icon)
                            ? React.cloneElement(icon as React.ReactElement<any>, {
                                  className: `size-6 text-${colorClasses[colorKey]} text-center center`,
                                  strokeWidth: 1,
                              })
                            : icon}
                    </span>
                )}
                {title && <h2 className="text-xl font-medium ">{title}</h2>}
            </div>
            {description && (
                <div>
                    <p className=" leading-relaxed">{description}</p>
                </div>
            )}
        </Link>
    );
}
