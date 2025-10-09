"use client";

import React, { createContext, useContext, useState } from "react";

type GlobalLoadingContextType = {
  loading: boolean;
  setGlobalLoading: (value: boolean) => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export const GlobalLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setGlobalLoading] = useState(false);

  return (
    <GlobalLoadingContext.Provider value={{ loading, setGlobalLoading }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) throw new Error("useGlobalLoading must be used within GlobalLoadingProvider");
  return context;
};
