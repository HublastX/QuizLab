"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "@/layout/LoadingScreen";

export default function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [previousPath, setPreviousPath] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        if (previousPath !== pathname) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
                setPreviousPath(pathname);
            }, 700);

            return () => clearTimeout(timer);
        }
    }, [pathname, previousPath]);

    return (
        <div className="relative h-full w-full">
            {isLoading && <LoadingScreen />}
            <div className={isLoading ? "opacity-0 pointer-events-none" : "opacity-100 h-full"}>
                {children}
            </div>
        </div>
    );
}
