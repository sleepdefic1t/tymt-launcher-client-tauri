import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getConstTymtLinks, IConstTymtLinks } from "../const/tymtConsts";

interface ConstVarContextType {
  constTymtLinks: IConstTymtLinks;
  setConstTymtLinks: (_: IConstTymtLinks) => void;
}

const ConstVarContext = createContext<ConstVarContextType | undefined>(undefined);

export const ConstVarProvider = ({ children }: { children: ReactNode }) => {
  const [constTymtLinks, setConstTymtLinks] = useState<IConstTymtLinks>(null);

  useEffect(() => {
    getConstTymtLinks()
      .then(setConstTymtLinks)
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return <ConstVarContext.Provider value={{ constTymtLinks, setConstTymtLinks }}>{children}</ConstVarContext.Provider>;
};

export const useConstVar = (): ConstVarContextType => {
  const context = useContext(ConstVarContext);
  if (!context) {
    throw new Error("useConstVar must be used within a ConstVarProvider");
  }
  return context;
};
