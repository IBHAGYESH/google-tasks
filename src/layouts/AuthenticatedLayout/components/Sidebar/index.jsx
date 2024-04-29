import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import {
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Collapse,
  Checkbox,
  Skeleton,
} from "@mui/material";

import plus from "../../../../assets/plus.png";

import { useAddTasklistMutation } from "../../../../services/tasklists";
import { useAddTaskMutation } from "../../../../services/tasks";
import { useState } from "react";
import useData from "../../../../hooks/useData";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const LIST = [
  {
    id: 1,
    title: "All tasks",
    path: "/",
    icon: <CheckCircleOutlineOutlinedIcon />,
  },
  {
    id: 2,
    title: "Starred",
    path: "/starred",
    icon: <StarBorderOutlinedIcon />,
  },
];

const Sidebar = ({ openDrawer, setTaskModalData, setCommonModalData }) => {
  const navigate = useNavigate();
  const { data, setData } = useData();
  const [openDrawerList, setOpenDrawerList] = useState(true);

  const [addTask, { data: task, isLoading: addTaskLoading }] =
    useAddTaskMutation();

  const [addTaskList, { data: tasklist, isLoading: tasklistLoading }] =
    useAddTasklistMutation();

  const handleToggle = (item) => () => {
    const newData = JSON.parse(JSON.stringify(data.tasklists));

    const NewDT = newData.map((tasklist) => {
      if (tasklist.id === item.id) {
        if (tasklist.checked) {
          tasklist.checked = false;
        } else {
          tasklist.checked = true;
        }

        if (tasklist.hidden) {
          tasklist.hidden = false;
        } else {
          tasklist.hidden = true;
        }
      }
      return tasklist;
    });

    setData((prev) => {
      return { ...prev, tasklists: NewDT };
    });
  };
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          backgroundColor: "#F8F9FA",
        },
      }}
      variant="persistent"
      anchor="left"
      open={openDrawer}
    >
      <Toolbar />
      <Divider />
      <Button
        onClick={() => {
          setTaskModalData((prev) => {
            return {
              ...prev,
              open: true,
              handleSubmit: async ({ title, notes, tasklist_id }) => {
                const { data: newTask } = await addTask({
                  tasklist_id: tasklist_id,
                  body: {
                    title,
                    notes,
                  },
                });

                const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
                const ND = tasklistDC.map((tl) => {
                  if (tl.id === tasklist_id) {
                    if (!newTask.parent) {
                      tl.tasks.unshift(newTask);
                      tl.AllTasks.unshift(newTask);
                    } else {
                      tl.tasks.forEach((task) => {
                        if (task.id === newTask.parent) {
                          task.subtasks.unshift(newTask);
                        }
                      });
                      tl.AllTasks.unshift(newTask);
                    }
                  }
                  return tl;
                });

                setData((prev) => {
                  return { ...prev, tasklists: ND };
                });
              },
            };
          });
        }}
        disableRipple
        sx={{
          color: "black",
          margin: "15px 0 15px 5px",
          width: "fit-content",
          height: "48px",
          backgroundColor: "white",
          borderRadius: "24px 24px 24px 24px",
          boxShadow:
            "0 1px 2px 0 rgba(60, 64, 67, .3), 0 1px 3px 1px rgba(60, 64, 67, .15);",
          padding: "2px 24px 2px 20px",
          letterSpacing: ".0178571429em",
          fontSize: ".875rem",
          fontWeight: "500",
        }}
      >
        <img src={plus} />
        create
      </Button>

      <List>
        {LIST.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton disableRipple onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItemButton
          onClick={() => setOpenDrawerList(!openDrawerList)}
          disableRipple
        >
          <ListItemText primary="Lists" />
          {openDrawerList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDrawerList} timeout="auto" unmountOnExit>
          <List component="div" disablePadding={true} dense={true}>
            {!data.tasklists.length && (
              <Skeleton
                variant="rectangular"
                width={"90%"}
                height={100}
                sx={{
                  borderRadius: "10px",
                  margin: "5px",
                }}
              />
            )}
            {data.tasklists.map((item) => (
              <ListItem
                key={item.id}
                disablePadding={true}
                dense={true}
                disableGutters={true}
              >
                <ListItemButton onClick={handleToggle(item)} disableRipple>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={item.checked}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton
            disableRipple
            onClick={() =>
              setCommonModalData((prev) => {
                return {
                  ...prev,
                  title: "Create new list",
                  open: true,
                  handleSubmit: async (name) => {
                    const { data: tasklist } = await addTaskList({
                      title: name,
                    });

                    const TLSC = JSON.parse(JSON.stringify(tasklist));
                    TLSC.checked = true;

                    setData((prev) => {
                      return {
                        ...prev,
                        tasklists: [...prev.tasklists, TLSC],
                      };
                    });
                  },
                };
              })
            }
          >
            <ListItemIcon>
              <AddOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Create new list"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};
export default Sidebar;
