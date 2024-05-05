import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const resetAuth = () => {
    setAuth({});
    localStorage.clear();
  };
  return { auth, setAuth, resetAuth };
};

export default useAuth;
