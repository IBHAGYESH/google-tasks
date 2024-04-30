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

const filterOptions = [
  {
    title: "Today",
    id: "today",
  },
  {
    title: "Tomorrow",
    id: "tomorrow",
  },
  {
    title: "This Week",
    id: "this-week",
  },
  {
    title: "Next Week",
    id: "next-week",
  },
  {
    title: "Month",
    id: "this-month",
  },
];
const objectsEqual = (o1, o2) =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

const arraysEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

const filterByDateRange = (data, range) => {
  const today = new Date();
  const start = new Date();
  const end = new Date();

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "tomorrow":
      start.setDate(today.getDate() + 1);
      end.setDate(start.getDate() + 1);
      break;
    case "this-week":
      start.setDate(today.getDate() - today.getDay());
      end.setDate(start.getDate() + 6);
      break;
    case "next-week":
      start.setDate(today.getDate() - today.getDay() + 7);
      end.setDate(start.getDate() + 6);
      break;
    case "this-month":
      start.setDate(1);
      end.setMonth(today.getMonth() + 1, 0);
      break;
    default:
      return data;
  }

  return data.filter((item) => {
    const date = new Date(item.updated);
    return date >= start && date <= end;
  });
};

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
  const [currentFilter, setCurrentFilter] = useState(filterOptions[0].id);
  const [myOrderView, setMyOrderView] = useState(true);
  const { data: tasklists, isLoading: tasklistsLoading } =
    useGetTasklistsQuery();

  const [getTasks] = useLazyGetTasksQuery();

  useEffect(() => {
    if (!tasklistsLoading && tasklists?.items) {
      (async () => {
        const TASKLISTS = [];
        const TASKS = [];
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
          tasks.forEach((task) => {
            TASKS.push(task);
            allTasksOfTasklist.push(JSON.parse(JSON.stringify(task)));
            if (task.hidden) {
              hiddenTasksOfTasklist.push(JSON.parse(JSON.stringify(task)));
            }
          });

          const HASH_MAP = {};
          for (let i = 0; i < tasks.length; i++) {
            if (!tasks[i].parent && !tasks[i].hidden) {
              HASH_MAP[tasks[i].id] = tasks[i];
            }
          }

          for (let j = 0; j < tasks.length; j++) {
            if (tasks[j].parent && !tasks[j].hidden) {
              if (!HASH_MAP[tasks[j].parent].subtasks) {
                HASH_MAP[tasks[j].parent].subtasks = [];
                HASH_MAP[tasks[j].parent].subtasks.push(tasks[j]);
              } else {
                HASH_MAP[tasks[j].parent].subtasks.push(tasks[j]);
              }
            }
          }

          const structuredTasks = Object.values(HASH_MAP);

          const cloneData = JSON.parse(JSON.stringify(tasklists.items));
          cloneData.map((taskL) => {
            if (taskL.id === tasklist.id) {
              taskL.checked = true;
              taskL.tasks = structuredTasks;
              taskL.AllTasks = allTasksOfTasklist;
              taskL.AllTasksBak = allTasksOfTasklist;
              taskL.HiddenTasks = hiddenTasksOfTasklist;
              TASKLISTS.push(taskL);
            }
            return taskL;
          });
        }
        setData((prev) => {
          return {
            ...prev,
            tasklists: TASKLISTS,
            tasks: TASKS,
          };
        });
      })();
    }
  }, [setData, tasklists, tasklistsLoading, getTasks]);

  useEffect(() => {
    (async () => {
      if (!myOrderView) {
        console.log("1", currentFilter);
        for await (const tasklist of data.tasklists) {
          const tasks = tasklist.AllTasks;

          let taskToSet;

          if (myOrderView) {
            taskToSet = tasklist.AllTasksBak;
          } else {
            taskToSet = filterByDateRange(tasks, currentFilter);
          }
          console.log({ tasks, taskToSet }, "taskToSet", tasklist.title);
          if (!arraysEqual(tasks, taskToSet)) {
            console.log("2", currentFilter);

            const cloneData = JSON.parse(JSON.stringify(data.tasklists));
            const TASKLISTS = cloneData.map((taskL) => {
              if (taskL.id === tasklist.id) {
                taskL.AllTasks = JSON.parse(JSON.stringify(taskToSet));
              }
              return taskL;
            });
            console.log("3", currentFilter);

            setData((prev) => {
              return {
                ...prev,
                tasklists: TASKLISTS,
              };
            });
          }
        }
      }
    })();
  }, [currentFilter, data.tasklists, myOrderView, setData]);

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
      <Header
        setOpenDrawer={setOpenDrawer}
        view={view}
        setView={setView}
        filterOptions={filterOptions}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        myOrderView={myOrderView}
        setMyOrderView={setMyOrderView}
      />
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
        <Outlet context={[view, myOrderView]} />
      </Main>
    </Box>
  );
};
export default AuthenticatedLayout;
