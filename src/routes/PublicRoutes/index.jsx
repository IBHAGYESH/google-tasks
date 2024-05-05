import { Navigate } from "react-router-dom";

import LazyLoadComponent from "../../utils/LazyLoadComponent.jsx";
import PublicLayout from "../../layouts/PublicLayout";
import { PUBLIC_ROUTES } from "./menuList.js";
import { lazy } from "react";

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
        path: PUBLIC_ROUTES.authentication.actionPath.login,
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
