"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const baseStyles =
    "block w-full rounded-xl border-solid bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-colors duration-150";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, suffix, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "flex w-full items-center gap-2 rounded-xl border border-solid border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-colors duration-150 focus-within:border-primary focus-within:bg-surface-strong focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary",
                    className
                )}
            >
                <input
                    ref={ref}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted file:border-0 file:bg-transparent file:text-sm file:font-medium"
                    {...props}
                />
                {suffix && (
                    <div className="flex items-center gap-2 border-l border-border pl-2 text-muted-foreground">
                        {suffix}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
