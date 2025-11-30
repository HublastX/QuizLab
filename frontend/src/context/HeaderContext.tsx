// context/HeaderContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type HeaderVariant = "default" | "dashboard";

interface HeaderContextType {
  variant: HeaderVariant;
  userName: string;
  setHeaderVariant: (variant: HeaderVariant) => void;
  setUserName: (name: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<HeaderVariant>("default");
  const [userName, setUserName] = useState("");

  return (
    <HeaderContext.Provider value={{ variant, userName, setHeaderVariant: setVariant, setUserName }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}