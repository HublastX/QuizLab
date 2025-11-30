// app/(home)/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHeader } from "@/context/HeaderContext";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { setHeaderVariant, setUserName } = useHeader();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const user = localStorage.getItem("user_name");

        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            setHeaderVariant("dashboard");
            setUserName(user || "Usuário");
        }
    }, [router, setHeaderVariant, setUserName]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}