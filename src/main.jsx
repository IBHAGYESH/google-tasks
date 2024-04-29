import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { DataProvider } from "./context/DataProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { CONFIGS } from "./config";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={CONFIGS.GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <DataProvider>
        <Provider store={store}>
          <BrowserRouter>
            <CssBaseline />
            <App />
          </BrowserRouter>
        </Provider>
      </DataProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
