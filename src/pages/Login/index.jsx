import { Box, Button } from "@mui/material";

import googleSignIn from "../../assets/btn_google_sigin.png";
import useAuth from "../../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem("x-app-token", tokenResponse.access_token);
      setAuth((prev) => {
        return {
          ...prev,
          access_token: tokenResponse.access_token,
        };
      });
      navigate("/");
    },
    onError: (errorResponse) => console.error(errorResponse, "<<"),
    onNonOAuthError: (nonOAuthError) => console.error(nonOAuthError, "||"),
    scope:
      "https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/tasks.readonly",
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        height: "100vh",
      }}
    >
      <Button onClick={() => login()}>
        <img src={googleSignIn} width={"50%"} />
      </Button>
    </Box>
  );
};
export default Login;
