import { Box } from "@mui/material";
import React from "react";

import Loading from "./Loading";

const LazyLoadComponent = (component, authRoute = true) => {
  return (
    <React.Suspense
      fallback={
        <Box
          width="100%"
          height={authRoute ? "100vh" : "100%"}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Loading />
        </Box>
      }
    >
      {component}
    </React.Suspense>
  );
};
export default LazyLoadComponent;
