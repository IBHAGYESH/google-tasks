import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    access_token: null,
    sessionLoaded: false,
  });

  useEffect(() => {
    // fetch session data from server if jwt present in the local storage
    if (localStorage.getItem("x-app-token") && !auth.access_token) {
      setAuth((prev) => {
        return {
          ...prev,
          access_token: localStorage.getItem("x-app-token"),
          sessionLoaded: true,
        };
      });
    }
    if (!localStorage.getItem("x-app-token") && !auth.access_token) {
      setAuth((prev) => {
        return {
          ...prev,
          sessionLoaded: true,
        };
      });
    }
  }, [auth.access_token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
