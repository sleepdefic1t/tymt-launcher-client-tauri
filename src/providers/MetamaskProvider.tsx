import React, { createContext, useContext, ReactNode, useState } from "react";

import { useSDK } from "@metamask/sdk-react";

interface MetamaskContextType {
  account?: string; // Optional, can be undefined initially
  connect: () => Promise<void>; // The connect function
  connected: boolean; // From useSDK
  connecting: boolean; // From useSDK
  chainId?: string; // From useSDK
}

const MetamaskContext = createContext<MetamaskContextType | undefined>(undefined);

export const useMetamask = () => {
  const context = useContext(MetamaskContext);
  if (!context) {
    throw new Error("useMetamask must be used within a MetamaskProvider");
  }
  return context;
};

interface MetamaskProviderProps {
  children: ReactNode;
}

export const MetamaskProvider: React.FC<MetamaskProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, /*provider,*/ chainId } = useSDK();

  const connect = async () => {
    try {
      console.log("connect");
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };

  return (
    <MetamaskContext.Provider
      value={{
        account,
        connect,
        connected,
        connecting,
        chainId,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};
