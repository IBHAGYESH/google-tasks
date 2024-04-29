import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const GenericTasklistModal = ({
  title,
  open,
  handleClose,
  handleSubmit,
  prefilledData = "",
}) => {
  const [fieldValue, setFieldValue] = useState(prefilledData);

  useEffect(() => {
    setFieldValue(prefilledData);
    return () => {
      if (fieldValue) {
        setFieldValue("");
      }
    };
  }, [prefilledData]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display={"flex"} flexDirection={"column"}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <TextField
            variant="filled"
            onChange={(e) => setFieldValue(e.target.value)}
            value={fieldValue}
          />
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box sx={{ flexFlow: 1 }} />
            <Box>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  handleSubmit(fieldValue);
                  handleClose();
                  setFieldValue("");
                }}
              >
                Done
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default GenericTasklistModal;
