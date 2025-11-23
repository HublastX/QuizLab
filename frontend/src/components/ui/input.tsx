"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const baseStyles =
    "block w-full rounded-xl border-solid bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-colors duration-150";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    baseStyles,
                    "border-border placeholder:text-muted focus:border-primary focus:bg-surface-strong focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";
