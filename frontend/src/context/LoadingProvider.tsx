"use client";
import React, { ReactNode, useState, useCallback, useRef, createContext, useContext } from "react";
import LoadingScreen from "@/layout/LoadingScreen";

interface LoadingContextType {
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoadingContext() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error(
            "useLoadingContext must be used within LoadingProvider"
        );
    }
    return context;
}

export default function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const loadingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const showLoading = useCallback(() => {
        setIsLoading(true);
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }
    }, []);

    const hideLoading = useCallback(() => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }
        loadingTimeoutRef.current = setTimeout(() => {
            setIsLoading(false);
        }, 300);
    }, []);

    return (
        <LoadingContext.Provider
            value={{ isLoading, showLoading, hideLoading }}
        >
            <div className="relative h-full w-full">
                {isLoading && <LoadingScreen />}
                <div
                    className={
                        isLoading
                            ? "opacity-0 pointer-events-none transition-opacity duration-300"
                            : "opacity-100 h-full transition-opacity duration-300"
                    }
                >
                    {children}
                </div>
            </div>
        </LoadingContext.Provider>
    );
}