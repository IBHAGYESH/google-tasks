import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import { useRoutes } from "react-router-dom";
import useAuth from "./hooks/useAuth.js";

function App() {
  const authenticatedRoutes = useRoutes(AuthenticatedRoutes);
  const publicRoutes = useRoutes(PublicRoutes);

  const { auth } = useAuth();

  return (
    <>
      {auth.sessionLoaded ? (
        auth.access_token ? (
          authenticatedRoutes
        ) : (
          publicRoutes
        )
      ) : (
        <>Loading</>
      )}
    </>
  );
}

export default App;
