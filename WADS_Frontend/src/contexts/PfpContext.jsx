import { createContext, useContext, useState } from "react";

const PfpContext = createContext();

export const PfpProvider = ({ children }) => {
  const [profilePicture, setProfilePicture] = useState("");

  const updatePfp = (newPfpUrl) => {
    setProfilePicture(newPfpUrl);
  };

  return (
    <PfpContext.Provider value={{ profilePicture, updatePfp }}>
      {children}
    </PfpContext.Provider>
  );
};

export const usePfpContext = () => {
  const context = useContext(PfpContext);
  if (!context) throw new Error("usePfpContext must be used inside PfpProvider");
  return context;
};
