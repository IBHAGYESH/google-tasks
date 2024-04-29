import { Navigate } from "react-router-dom";

import LazyLoadComponent from "../../utils/LazyLoadComponent.jsx";
import PublicLayout from "../../layouts/PublicLayout";
import { ADMIN_SCOPE_ROUTES } from "./menuList.js";
import { lazy } from "react";

// const NotFound = React.lazy(() => import("../Pages/NotFound"));

const Login = lazy(() => import("../../pages/Login"));

const PublicRoutes = [
  {
    path: "/",
    element: LazyLoadComponent(<PublicLayout />),
    children: [
      {
        index: true,
        element: LazyLoadComponent(<Login />),
      },
      {
        path: ADMIN_SCOPE_ROUTES.authentication.actionPath.login,
        children: [{ index: true, element: LazyLoadComponent(<Login />) }],
      },
      {
        path: "*",
        skipLazyLoad: true,
        element: <Navigate to="/login" />,
      },
    ],
  },
];

export default PublicRoutes;
