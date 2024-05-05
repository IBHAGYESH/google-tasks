import {
  Box,
  Button,
  Modal,
  TextField,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import useData from "./useData";

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

export const useTaskModal = () => {
  const { data } = useData();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [current, setCurrent] = useState("");

  const [taskModalConfigs, setTaskModalConfigs] = useState({
    openModal: false,
    handleSubmit: () => {},
    handleClose: () => {},
    lockTasklist: false,
    parent: null,
    prefilledData: null,
  });

  useEffect(() => {
    if (!current && taskModalConfigs.prefilledData) {
      setCurrent(taskModalConfigs.prefilledData.current.id);
    }
  }, [current, taskModalConfigs.prefilledData]);

  const TaskModal = (
    <div>
      <Modal
        open={taskModalConfigs.openModal}
        onClose={() => {
          taskModalConfigs?.handleClose();
          setTaskModalConfigs((prev) => ({
            ...prev,
            openModal: false,
            handleSubmit: () => {},
            handleClose: () => {},
            lockTasklist: false,
            parent: null,
            prefilledData: null,
          }));
          setTitle("");
          setNotes("");
          setCurrent("");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          display={"flex"}
          flexDirection={"column"}
          minHeight={"400px"}
          justifyContent={"space-between"}
        >
          <TextField
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Add title"
          />
          <TextField
            variant="filled"
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
            placeholder="Add description"
          />
          {!data.tasklists.length ? (
            <>Loading...</>
          ) : (
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={current}
              disabled={taskModalConfigs.lockTasklist}
              label="Tasklist"
              onChange={(e) => setCurrent(e.target.value)}
              variant="standard"
            >
              {data?.tasklists.map((tl) => (
                <MenuItem key={tl?.id} value={tl?.id}>
                  {tl?.title}
                </MenuItem>
              ))}
            </Select>
          )}
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box sx={{ flexFlow: 1 }} />
            <Box>
              <Button
                variant="contained"
                onClick={() => {
                  taskModalConfigs.handleSubmit({
                    title: title,
                    notes: notes,
                    tasklist_id: current,
                    parent: taskModalConfigs?.parent?.id,
                  });
                  taskModalConfigs?.handleClose();
                  setTaskModalConfigs((prev) => ({
                    ...prev,
                    openModal: false,
                    handleSubmit: () => {},
                    handleClose: () => {},
                    lockTasklist: false,
                    parent: null,
                    prefilledData: null,
                  }));
                  setTitle("");
                  setNotes("");
                  setCurrent("");
                }}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </div>
  );

  return { setTaskModalConfigs, TaskModal };
};
