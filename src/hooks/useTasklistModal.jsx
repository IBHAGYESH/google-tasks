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

export const useTasklistModal = () => {
  const [fieldValue, setFieldValue] = useState("");

  const [tasklistModalConfigs, setTasklistModalConfigs] = useState({
    title: "",
    openModal: false,
    handleSubmit: () => {},
    handleClose: () => {},
    prefilledData: null,
  });

  useEffect(() => {
    if (!fieldValue && tasklistModalConfigs.prefilledData) {
      setFieldValue(tasklistModalConfigs.prefilledData.fieldValue);
    }
  }, [fieldValue, tasklistModalConfigs.prefilledData]);

  const TasklistModal = (
    <div>
      <Modal
        open={tasklistModalConfigs.openModal}
        onClose={() => {
          tasklistModalConfigs?.handleClose();
          setTasklistModalConfigs((prev) => ({
            ...prev,
            openModal: false,
            handleSubmit: () => {},
            handleClose: () => {},
            prefilledData: null,
          }));
          setFieldValue("");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display={"flex"} flexDirection={"column"}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {tasklistModalConfigs.title}
          </Typography>
          <TextField
            variant="filled"
            onChange={(e) => setFieldValue(e.target.value)}
            value={fieldValue}
          />
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box sx={{ flexFlow: 1 }} />
            <Box>
              <Button
                onClick={() => {
                  tasklistModalConfigs?.handleClose();
                  setTasklistModalConfigs((prev) => ({
                    ...prev,
                    openModal: false,
                    handleSubmit: () => {},
                    handleClose: () => {},
                    prefilledData: null,
                  }));
                  setFieldValue("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  tasklistModalConfigs.handleSubmit(fieldValue);
                  tasklistModalConfigs?.handleClose();
                  setTasklistModalConfigs((prev) => ({
                    ...prev,
                    openModal: false,
                    handleSubmit: () => {},
                    handleClose: () => {},
                    prefilledData: null,
                  }));
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

  return { setTasklistModalConfigs, TasklistModal };
};
