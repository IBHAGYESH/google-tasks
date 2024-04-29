import CircularProgress from "@mui/material/CircularProgress";

import { FullSizeCenteredFlexBox } from "../utils/styled";

function Loading() {
  return (
    <FullSizeCenteredFlexBox>
      <CircularProgress />
    </FullSizeCenteredFlexBox>
  );
}

export default Loading;
