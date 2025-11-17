'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface HomeContextType {
  isInHome: boolean;
  currentPath: string;
  isInRouteGroup: boolean;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [isInHome, setIsInHome] = useState<boolean>(false);
  const [isInRouteGroup, setIsInRouteGroup] = useState<boolean>(false);

  useEffect(() => {

    const pathSegments = pathname.split('/').filter(segment => segment);
    
    const isHomePage = pathname === '/' || pathSegments[pathSegments.length - 1] === 'home';

    const hasHomeInPath = pathSegments.includes('home');
    
    setIsInHome(isHomePage || hasHomeInPath);

    setIsInRouteGroup(pathSegments.length > 0 && pathSegments[0] !== 'home');

  }, [pathname]);

  const value: HomeContextType = {
    isInHome,
    currentPath: pathname,
    isInRouteGroup
  };

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useHome deve ser usado dentro de um HomeProvider');
  }
  return context;
};