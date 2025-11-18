import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeWatcher } from "@/components/theme-watcher";
import Header from "@/layout/Header";
import LoadingProvider from "@/context/LoadingProvider";
import { HomeProvider } from "@/context/Home";
import VLibras from "@/components/VLibras";
import ColorModeProvider from "@/context/ColorModeProvider";

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
                <HomeProvider>
                    <Header />
                    <ThemeWatcher />
                    <main className="h-full relative overflow-hidden">
                        <LoadingProvider>
                            <ColorModeProvider>
                                <div className="h-full overflow-auto flex flex-col p-4 bg-layout-background text-layout-foreground">
                                    <VLibras />
                                    {children}
                                </div>
                            </ColorModeProvider>
                        </LoadingProvider>
                    </main>
                </HomeProvider>
            </body>
        </html>
    );
}
