import { Stack, Skeleton, Typography } from "@mui/material";
import { useState } from "react";

import useData from "../../../../hooks/useData";

import GenericTasklistModal from "../../../../components/GenericTasklistModal";
import TasklistCard from "./components/TasklistCard";
import GenericTaskModal from "../../../../components/GenericTaskModal";
import AllListsHidden from "../../../../assets/all-task-lists-hidden.png";

const grid = 8;
const drawerWidth = 240;

const getListStyleTasklist = (isDraggingOver) => ({
  // background: isDraggingOver ? "#FFD6F1" : "#FF99DD",
  display: "flex",
  padding: grid,
  // overflow: "auto",
  // height: "100%",
  // width: "100%",
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Kanban = () => {
  const { data, setData } = useData();
  const [current, setCurrent] = useState(null);
  const [parent, setParent] = useState(null);

  const [taskModalData, setTaskModalData] = useState({
    open: false,
    prefilledData: {},
    handleSubmit: () => {},
  });
  const [commonModalData, setCommonModalData] = useState({
    open: false,
    title: "",
    prefilledData: "",
    handleSubmit: () => {},
  });

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

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const tasklists = reorder(
      data?.tasklists,
      result.source.index,
      result.destination.index
    );

    setData((prev) => {
      return { ...prev, tasklists: tasklists };
    });
  };

  return (
    <>
      <GenericTaskModal
        open={taskModalData.open}
        prefilledData={taskModalData.prefilledData}
        handleClose={() =>
          setTaskModalData((prev) => {
            return {
              ...prev,
              open: false,
            };
          })
        }
        handleSubmit={taskModalData.handleSubmit}
        tasklists={data.tasklists}
      />
      <GenericTasklistModal
        title={commonModalData.title}
        open={commonModalData.open}
        prefilledData={commonModalData.prefilledData}
        handleClose={() =>
          setCommonModalData((prev) => {
            return {
              ...prev,
              open: false,
            };
          })
        }
        handleSubmit={commonModalData.handleSubmit}
      />
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
                handleClose={handleClose}
                handleClick={handleClick}
                anchorEl={anchorEl}
                current={current}
                parent={parent}
                tasklist={tasklist}
                setCommonModalData={setCommonModalData}
                setTaskModalData={setTaskModalData}
              />
            );
          })}
      </Stack>
    </>
  );
};
export default Kanban;
