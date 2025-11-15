import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeWatcher } from "@/components/theme-watcher";
import Header from "@/layout/Header";
import LoadingProvider from "@/context/LoadingProvider";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
    display: "swap",
});

export const metadata: Metadata = {
    title: "QuizLab",
    description: "Sistema de quizzes interativo",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={poppins.variable}>
            <body className="font-sans antialiased bg-layout-background text-layout-foreground h-screen flex flex-col overflow-hidden">

                <Header />
                <ThemeWatcher />

                <main className="flex-1 relative overflow-hidden">
                    <LoadingProvider>
                        <div className="h-full overflow-auto flex flex-col p-4 bg-layout-background text-layout-foreground">
                            {children}
                        </div>
                    </LoadingProvider>
                </main>

            </body>
        </html>
    );
}
