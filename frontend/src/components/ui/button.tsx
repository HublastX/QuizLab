"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const baseStyles =
    "inline-flex items-center justify-center rounded-lg border text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles = {
    solid: "bg-primary border-transparent text-background shadow-sm hover:bg-primary-hover focus-visible:outline-primary active:scale-[0.98] active:shadow-inner",
    subtle: "bg-surface border-border text-foreground shadow-xs hover:border-border-strong hover:bg-surface-strong focus-visible:outline-primary active:scale-[0.99] active:shadow-inner",
    ghost: "border-transparent text-foreground hover:bg-surface focus-visible:outline-primary active:bg-surface-strong",
} as const;

const sizeStyles = {
    md: "h-11 min-w-[9rem] px-5 py-2.5",
    sm: "h-10 min-w-[7.5rem] px-4 py-2 text-xs",
    lg: "h-12 min-w-[10rem] px-6 py-3 text-base",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    suffix?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "solid", size = "md", className, disabled, suffix, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                    className
                )}
                disabled={disabled}
                {...props}
            >
                {children}
                {suffix && <span className="ml-2">{suffix}</span>}
            </button>
        );
    }
);

Button.displayName = "Button";