import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import LazyLoadComponent from "../../utils/LazyLoadComponent";

import { SCOPE_ROUTES } from "./menuList";
import { lazy } from "react";

const Dashboard = lazy(() => import("../../pages/Dashboard"));
const Starred = lazy(() => import("../../pages/Starred"));
const NotFound = lazy(() => import("../../pages/NotFound"));

const AuthenticatedRoutes = [
  {
    path: "/",
    element: LazyLoadComponent(<AuthenticatedLayout />),
    children: [
      {
        index: true,
        element: LazyLoadComponent(<Dashboard />),
      },
      {
        path: "starred",
        element: LazyLoadComponent(<Starred />),
      },
      {
        path: "*",
        element: LazyLoadComponent(<NotFound />),
      },
    ],
  },
];

export default AuthenticatedRoutes;
