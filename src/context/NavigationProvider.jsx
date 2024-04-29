import { createContext, useState } from "react";

export const NavigationContext = createContext({});

export const NavigationProvider = ({ children }) => {
  const [refreshScopeActions, setRefreshScopeActions] = useState(true);

  return (
    <NavigationContext.Provider
      value={{ refreshScopeActions, setRefreshScopeActions }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
