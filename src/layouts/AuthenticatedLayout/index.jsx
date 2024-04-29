import { useEffect, useState } from "react";

import { Box, Toolbar } from "@mui/material";

import { styled } from "@mui/material/styles";

import { Outlet } from "react-router-dom";

import useData from "../../hooks/useData";
import { useGetTasklistsQuery } from "../../services/tasklists";
import { useLazyGetTasksQuery } from "../../services/tasks";

import GenericTasklistModal from "../../components/GenericTasklistModal";
import GenericTaskModal from "../../components/GenericTaskModal";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AuthenticatedLayout = () => {
  const { data, setData } = useData();
  const [commonModalData, setCommonModalData] = useState({
    open: false,
    title: "",
    prefilledData: "",
    handleSubmit: () => {},
  });
  const [taskModalData, setTaskModalData] = useState({
    open: false,
    prefilledData: {},
    handleSubmit: () => {},
  });
  const [openDrawer, setOpenDrawer] = useState(true);
  const [view, setView] = useState("Kanban");

  const { data: tasklists, isLoading: tasklistsLoading } =
    useGetTasklistsQuery();

  const [getTasks] = useLazyGetTasksQuery();

  useEffect(() => {
    if (!tasklistsLoading && tasklists?.items) {
      (async () => {
        const TL = [];
        const T = [];
        for await (const tasklist of tasklists.items) {
          const allTasksOfTasklist = [];
          const hiddenTasksOfTasklist = [];
          const res = await getTasks({
            tasklist_id: tasklist.id,
            params: {
              showHidden: true,
            },
          });
          const tasks = JSON.parse(JSON.stringify(res.data.items));
          tasks
            // .sort(function (a, b) {
            //   return a.updated.localeCompare(b.updated);
            // })
            .forEach((t) => {
              T.push(t);
              allTasksOfTasklist.push(t);
              if (t.hidden) {
                hiddenTasksOfTasklist.push(t);
              }
            });

          const HM = {};
          for (let i = 0; i < tasks.length; i++) {
            if (!tasks[i].parent) {
              HM[tasks[i].id] = tasks[i];
            }
          }

          for (let j = 0; j < tasks.length; j++) {
            if (tasks[j].parent) {
              if (!HM[tasks[j].parent].subtasks) {
                HM[tasks[j].parent].subtasks = [];
                HM[tasks[j].parent].subtasks.push(tasks[j]);
              } else {
                HM[tasks[j].parent].subtasks.push(tasks[j]);
              }
            }
          }

          const structuredTasks = Object.values(HM);

          const cloneData = JSON.parse(JSON.stringify(tasklists.items));
          cloneData.map((taskl) => {
            if (taskl.id === tasklist.id) {
              taskl.checked = true;
              taskl.tasks = structuredTasks;
              taskl.AllTasks = allTasksOfTasklist;
              taskl.HiddenTasks = hiddenTasksOfTasklist;
              TL.push(taskl);
            }
            return taskl;
          });
        }
        setData((prev) => {
          return {
            ...prev,
            tasklists: TL,
            tasks: T,
          };
        });
      })();
    }
  }, [setData, tasklists, tasklistsLoading]);

  return (
    <Box sx={{ display: "flex" }}>
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
      <Header setOpenDrawer={setOpenDrawer} view={view} setView={setView} />
      <Sidebar
        openDrawer={openDrawer}
        setTaskModalData={setTaskModalData}
        setCommonModalData={setCommonModalData}
      />
      <Main
        open={openDrawer}
        sx={{
          backgroundColor: "#F8F9FA",
        }}
      >
        <Toolbar />
        <Outlet context={[view]} />
      </Main>
    </Box>
  );
};
export default AuthenticatedLayout;
