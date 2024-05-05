import { Stack, Skeleton, Typography } from "@mui/material";
import { useState } from "react";

import useData from "../../../../hooks/useData";

import TasklistCard from "./components/TasklistCard";
import AllListsHidden from "../../../../assets/all-task-lists-hidden.png";

const drawerWidth = 240;

const Kanban = () => {
  const { data } = useData();
  const [current, setCurrent] = useState(null);
  const [parent, setParent] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    if (parent) {
      setParent(null);
    }
    setCurrent(null);
    setAnchorEl(null);
  };

  const handleClick = (event, tasklist, parent) => {
    if (parent) {
      setParent(parent);
    }
    setCurrent(tasklist);
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Stack direction={"row"}>
        {!data.tasklists.length && (
          <Skeleton
            variant="rectangular"
            width={`calc(100vw - ${drawerWidth + 50}px)`}
            height={300}
            sx={{
              borderRadius: "10px",
            }}
          />
        )}
        {data.tasklists.length > 0 &&
          !data.tasklists?.filter((tl) => !tl.hidden).length && (
            <Stack
              alignItems={"center"}
              justifyContent={"center"}
              width={"100%"}
              height={"80vh"}
            >
              <img
                src={AllListsHidden}
                style={{
                  width: "170px",
                }}
              />
              <Typography>All lists are hidden</Typography>
              <Typography variant="caption">
                Select any list to see your tasks
              </Typography>
            </Stack>
          )}
        {data.tasklists
          ?.filter((tl) => !tl.hidden)
          .map((tasklist) => {
            return (
              <TasklistCard
                key={tasklist.id}
                tasklist={tasklist}
                handleClose={handleClose}
                handleClick={handleClick}
                anchorEl={anchorEl}
                current={current}
                parent={parent}
              />
            );
          })}
      </Stack>
    </>
  );
};
export default Kanban;
