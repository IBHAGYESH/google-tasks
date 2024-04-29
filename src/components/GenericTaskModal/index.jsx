import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import SubjectIcon from "@mui/icons-material/Subject";
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

const GenericTaskModal = ({
  open,
  handleClose,
  handleSubmit,
  prefilledData,
  tasklists,
}) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (!current && prefilledData?.current && open) {
      setCurrent(prefilledData.current.id);
    }
    if (!current && !prefilledData.current && tasklists.length && open) {
      setCurrent(tasklists[0].id);
    }
    return () => {
      if (title) {
        setTitle("");
      }
      if (notes) {
        setNotes("");
      }
    };
  }, [tasklists, prefilledData, current, setCurrent, open]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
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
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={current}
            disabled={prefilledData.lockCurrent}
            label="Tasklist"
            onChange={(e) => setCurrent(e.target.value)}
            variant="standard"
          >
            {tasklists.map((tl) => (
              <MenuItem key={tl?.id} value={tl?.id}>
                {tl?.title}
              </MenuItem>
            ))}
          </Select>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box sx={{ flexFlow: 1 }} />
            <Box>
              <Button
                variant="contained"
                onClick={() => {
                  handleSubmit({
                    title: title,
                    notes: notes,
                    tasklist_id: current,
                    parent: prefilledData?.parent?.id,
                  });
                  handleClose();
                  setTitle("");
                  setNotes("");
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
};

export default GenericTaskModal;
