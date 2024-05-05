import {
  CardContent,
  Card,
  IconButton,
  Typography,
  CardHeader,
  Stack,
  Menu,
  MenuItem,
  Skeleton,
  CardActions,
  Collapse,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useData from "../../../../../../hooks/useData";
import { useState } from "react";
import {
  useEditTasklistMutation,
  useRemoveTasklistMutation,
} from "../../../../../../services/tasklists";
import {
  useAddTaskMutation,
  useEditTaskMutation,
  useRemoveTaskMutation,
} from "../../../../../../services/tasks";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteIcon from "@mui/icons-material/Delete";
import NoTasks from "../../../../../../assets/no-tasks.png";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { useOutletContext } from "react-router-dom";
import { useTaskModal } from "../../../../../../hooks/useTaskModal";
import { useTasklistModal } from "../../../../../../hooks/useTasklistModal";

const ITEM_HEIGHT = 48;

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const TasklistCard = ({
  tasklist,
  handleClose,
  handleClick,
  anchorEl,
  current,
  parent,
}) => {
  const [, myOrderView] = useOutletContext();
  const { data, setData } = useData();
  const [expanded, setExpanded] = useState(false);
  const [taskIcon, setTaskIcon] = useState(null);
  const [loader, setLoader] = useState(false);

  const { setTaskModalConfigs, TaskModal } = useTaskModal();
  const { setTasklistModalConfigs, TasklistModal } = useTasklistModal();

  const [addTask, { isLoading: addTaskLoading }] = useAddTaskMutation();

  const [editTask, { isLoading: editTaskLoading }] = useEditTaskMutation();

  const [deleteTask, { isLoading: deleteTaskLoading }] =
    useRemoveTaskMutation();

  const [editTaskList, { isLoading: tasklistLoading }] =
    useEditTasklistMutation();

  const [removeTaskList, { isLoading: removeTasklistLoading }] =
    useRemoveTasklistMutation();

  const markTaskAsCompleted = async (taskId, tasklistId) => {
    setLoader(true);
    const { data: editedTask } = await editTask({
      task_id: taskId,
      tasklist_id: tasklistId,
      body: {
        status: "completed",
        completed: new Date().toISOString(),
        hidden: true,
      },
    });

    const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
    const ND = tasklistDC.map((tl) => {
      if (tl.id === tasklistId) {
        if (!editedTask.parent) {
          tl.tasks = tl.tasks.filter((task) => task.id !== editedTask.id);
          tl.AllTasks = tl.AllTasks.filter((task) => task.id !== editedTask.id);
          tl.HiddenTasks.unshift(editedTask);
        } else {
          tl.tasks.forEach((task) => {
            if (task.id === editedTask.parent) {
              task.subtasks = task.subtasks.filter(
                (task) => task.id !== editedTask.id
              );
            }
          });
          tl.AllTasks = tl.AllTasks.filter((task) => task.id !== editedTask.id);
          tl.HiddenTasks.unshift(editedTask);
        }
      }
      return tl;
    });

    setData((prev) => {
      return { ...prev, tasklists: ND };
    });

    setLoader(false);
  };

  const markTaskAsUnComplete = async (taskId, tasklistId) => {
    setLoader(true);
    const { data: editedTask } = await editTask({
      task_id: taskId,
      tasklist_id: tasklistId,
      body: {
        status: "needsAction",
        hidden: false,
      },
    });

    const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
    const ND = tasklistDC.map((tl) => {
      if (tl.id === tasklistId) {
        if (!editedTask.parent) {
          tl.tasks.unshift(editedTask);
          tl.AllTasks.unshift(editedTask);
          tl.HiddenTasks = tl.HiddenTasks.filter(
            (task) => task.id !== editedTask.id
          );
        } else {
          tl.tasks.forEach((task) => {
            if (task.id === editedTask.parent) {
              task.subtasks.unshift(editedTask);
            }
          });
          tl.AllTasks.unshift(editedTask);
          tl.HiddenTasks = tl.HiddenTasks.filter(
            (task) => task.id !== editedTask.id
          );
        }
      }
      return tl;
    });

    setData((prev) => {
      return { ...prev, tasklists: ND };
    });

    setLoader(false);
  };

  const deleteCompletedTask = async (taskId, tasklistId) => {
    setLoader(true);
    await deleteTask({
      task_id: taskId,
      tasklist_id: tasklistId,
    });

    const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
    const ND = tasklistDC.map((tl, index) => {
      if (tl.id === tasklistId) {
        const deletedTask = tasklistDC[index].AllTasks.find(
          (task) => task.id === taskId
        );

        if (!deletedTask?.parent) {
          tl.tasks = tl.tasks.filter((task) => task.id !== taskId);
          tl.AllTasks = tl.AllTasks.filter((task) => task.id !== taskId);
          tl.HiddenTasks = tl.HiddenTasks.filter((task) => task.id !== taskId);
        } else {
          tl.tasks.forEach((task) => {
            if (task.id === deletedTask.parent) {
              task.subtasks = task.subtasks.filter(
                (task) => task.id !== taskId
              );
            }
          });
          tl.AllTasks = tl.AllTasks.filter((task) => task.id !== taskId);
          tl.HiddenTasks = tl.HiddenTasks.filter((task) => task.id !== taskId);
        }
      }
      return tl;
    });

    setData((prev) => {
      return { ...prev, tasklists: ND };
    });

    setLoader(false);
  };

  const taskListOptions = [
    {
      title: "Rename list",
      action: () => {
        setTasklistModalConfigs((prev) => {
          return {
            ...prev,
            openModal: true,
            title: "Rename list",
            prefilledData: { fieldValue: current.title },
            handleSubmit: async (name) => {
              setLoader(true);
              const tasklist = await editTaskList({
                tasklist_id: current.id,
                body: {
                  title: name,
                },
              });
              const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
              const ND = tasklistDC.map((tl) => {
                if (tl.id === tasklist.data.id) {
                  tl.title = tasklist.data.title;
                }
                return tl;
              });
              setData((prev) => {
                return { ...prev, tasklists: ND };
              });
              setLoader(false);
            },
            handleClose: () => handleClose(),
          };
        });
        handleClose();
      },
    },
    {
      title: "Delete list",
      action: async () => {
        setLoader(true);
        await removeTaskList(current.id);

        const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
        const ND = tasklistDC.filter((tl) => {
          if (tl.id !== current.id) {
            return tl;
          }
        });

        setData((prev) => {
          return { ...prev, tasklists: ND };
        });
        setLoader(false);
        handleClose();
      },
    },
  ];
  const taskOptions = [
    {
      title: "Edit",
      icon: <EditIcon />,
      action: () => {
        setTaskModalConfigs((prev) => {
          return {
            ...prev,
            openModal: true,
            lockTasklist: true,
            prefilledData: {
              current: current,
              parent: parent,
              title: parent.title,
              notes: parent.notes,
            },
            handleSubmit: async ({ title, notes, tasklist_id, parent }) => {
              setLoader(true);
              const { data: editedTask } = await editTask({
                task_id: parent.id,
                tasklist_id: tasklist_id,
                body: {
                  title,
                  notes,
                },
              });

              const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
              const ND = tasklistDC.map((tl) => {
                if (tl.id === tasklist_id) {
                  if (!editedTask.parent) {
                    tl.tasks = tl.tasks.map((task) => {
                      if (task.id === editedTask.id) {
                        task.title = editedTask.title;
                        task.notes = editedTask.notes;
                      }
                      return task;
                    });
                  } else {
                    tl.tasks.forEach((task) => {
                      if (task.id === editedTask.parent) {
                        task.subtasks = task.subtasks.map((task) => {
                          if (task.id === editedTask.id) {
                            task.title = editedTask.title;
                            task.notes = editedTask.notes;
                          }
                          return task;
                        });
                      }
                    });
                  }
                  tl.AllTasks = tl.AllTasks.map((task) => {
                    if (task.id === editedTask.id) {
                      task.title = editedTask.title;
                      task.notes = editedTask.notes;
                    }
                    return task;
                  });
                }
                return tl;
              });

              setData((prev) => {
                return { ...prev, tasklists: ND };
              });
              setLoader(false);
            },
            handleClose: () => handleClose(),
          };
        });
        handleClose();
      },
    },
    {
      title: "Add a subtask",
      icon: <SubdirectoryArrowRightIcon />,
      action: () => {
        setTaskModalConfigs((prev) => {
          return {
            ...prev,
            openModal: true,
            lockTasklist: true,
            prefilledData: {
              current: current,
              parent: parent,
            },
            handleSubmit: async ({ title, notes, tasklist_id, parent }) => {
              setLoader(true);
              const { data: newTask } = await addTask({
                tasklist_id: tasklist_id,
                body: {
                  title,
                  notes,
                },
                params: {
                  parent: parent.id,
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
                        if (!task.subtasks) {
                          task.subtasks = [];
                          task.subtasks.unshift(newTask);
                        } else {
                          task.subtasks.unshift(newTask);
                        }
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
              setLoader(false);
            },
            handleClose: () => handleClose(),
          };
        });
        handleClose();
      },
    },
    {
      title: "Delete",
      icon: <DeleteIcon />,
      action: async () => {
        setLoader(true);
        await deleteTask({
          task_id: parent.id,
          tasklist_id: current.id,
        });

        const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
        const ND = tasklistDC.map((tl) => {
          if (tl.id === current.id) {
            if (!parent.parent) {
              tl.tasks = tl.tasks.filter((task) => task.id !== parent.id);
              tl.AllTasks = tl.AllTasks.filter((task) => task.id !== parent.id);
              tl.HiddenTasks = tl.HiddenTasks.filter(
                (task) => task.id !== parent.id
              );
            } else {
              tl.tasks.forEach((task) => {
                if (task.id === parent.parent) {
                  task.subtasks = task.subtasks.filter(
                    (task) => task.id !== parent.id
                  );
                }
              });
              tl.AllTasks = tl.AllTasks.filter((task) => task.id !== parent.id);
              tl.HiddenTasks = tl.HiddenTasks.filter(
                (task) => task.id !== parent.id
              );
            }
          }
          return tl;
        });

        setData((prev) => {
          return { ...prev, tasklists: ND };
        });

        setLoader(false);
        handleClose();
      },
    },
  ];
  const subtaskOptions = [
    {
      title: "Edit",
      icon: <EditIcon />,
      action: () => {
        setTaskModalConfigs((prev) => {
          return {
            ...prev,
            openModal: true,
            lockTasklist: true,
            prefilledData: {
              current: current,
              parent: parent,
              title: parent.title,
              notes: parent.notes,
            },
            handleSubmit: async ({ title, notes, tasklist_id, parent }) => {
              setLoader(true);
              const { data: editedTask } = await editTask({
                task_id: parent.id,
                tasklist_id: tasklist_id,
                body: {
                  title,
                  notes,
                },
                params: {
                  parent: parent.parent,
                },
              });

              const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
              const ND = tasklistDC.map((tl) => {
                if (tl.id === tasklist_id) {
                  if (!editedTask.parent) {
                    tl.tasks = tl.tasks.map((task) => {
                      if (task.id === editedTask.id) {
                        task = editedTask;
                      }
                      return task;
                    });
                  } else {
                    tl.tasks.forEach((task) => {
                      if (task.id === editedTask.parent) {
                        task.subtasks = task.subtasks.map((task) => {
                          if (task.id === editedTask.id) {
                            task = editedTask;
                          }
                          return task;
                        });
                      }
                    });
                  }
                  tl.AllTasks = tl.AllTasks.map((task) => {
                    if (task.id === editedTask.id) {
                      task = editedTask;
                    }
                    return task;
                  });
                }
                return tl;
              });

              setData((prev) => {
                return { ...prev, tasklists: ND };
              });
              setLoader(false);
            },
            handleClose: () => handleClose(),
          };
        });
        handleClose();
      },
    },
    {
      title: "Delete",
      icon: <DeleteIcon />,
      action: async () => {
        setLoader(true);
        await deleteTask({
          task_id: parent.id,
          tasklist_id: current.id,
        });

        const tasklistDC = JSON.parse(JSON.stringify(data.tasklists));
        const ND = tasklistDC.map((tl) => {
          if (tl.id === current.id) {
            if (!parent.parent) {
              tl.tasks = tl.tasks.filter((task) => task.id !== parent.id);
              tl.AllTasks = tl.AllTasks.filter((task) => task.id !== parent.id);
              tl.HiddenTasks = tl.HiddenTasks.filter(
                (task) => task.id !== parent.id
              );
            } else {
              tl.tasks.forEach((task) => {
                if (task.id === parent.parent) {
                  task.subtasks = task.subtasks.filter(
                    (task) => task.id !== parent.id
                  );
                }
              });
              tl.AllTasks = tl.AllTasks.filter((task) => task.id !== parent.id);
              tl.HiddenTasks = tl.HiddenTasks.filter(
                (task) => task.id !== parent.id
              );
            }
          }
          return tl;
        });

        setData((prev) => {
          return { ...prev, tasklists: ND };
        });

        setLoader(false);
        handleClose();
      },
    },
  ];

  const openTaskList = anchorEl?.id === "list";
  const openTask = anchorEl?.id === "menu";
  const openSubTask = anchorEl?.id === "submenu";

  return (
    <>
      {TaskModal}
      {TasklistModal}
      {openTaskList && (
        <Menu
          anchorEl={anchorEl}
          open={openTaskList}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              boxShadow:
                "0px 8px 10px 1px rgba(0, 0, 0, .14), 0px 3px 14px 2px rgba(0, 0, 0, .12), 0px 5px 5px -3px rgba(0, 0, 0, .2)",
              borderRadius: "10px",
            },
          }}
        >
          {taskListOptions
            .filter((option) => {
              if (tasklist.title === "My Tasks") {
                if (option.title !== "Delete list") {
                  return option;
                }
              } else {
                return option;
              }
            })
            .map((option) => {
              return (
                <MenuItem key={option.title} onClick={option.action}>
                  {option.title}
                </MenuItem>
              );
            })}
        </Menu>
      )}

      {openTask && (
        <Menu
          anchorEl={anchorEl}
          open={openTask}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              boxShadow:
                "0px 8px 10px 1px rgba(0, 0, 0, .14), 0px 3px 14px 2px rgba(0, 0, 0, .12), 0px 5px 5px -3px rgba(0, 0, 0, .2)",
              borderRadius: "10px",
            },
          }}
        >
          {taskOptions.map((option) => {
            return (
              <Stack direction={"row"} key={option.title}>
                {option.icon}
                <MenuItem onClick={option.action}>{option.title}</MenuItem>
              </Stack>
            );
          })}
        </Menu>
      )}

      {openSubTask && (
        <Menu
          anchorEl={anchorEl}
          open={openSubTask}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              boxShadow:
                "0px 8px 10px 1px rgba(0, 0, 0, .14), 0px 3px 14px 2px rgba(0, 0, 0, .12), 0px 5px 5px -3px rgba(0, 0, 0, .2)",
              borderRadius: "10px",
            },
          }}
        >
          {subtaskOptions.map((option) => {
            return (
              <Stack direction={"row"} key={option.title}>
                {option.icon}
                <MenuItem onClick={option.action}>{option.title}</MenuItem>
              </Stack>
            );
          })}
        </Menu>
      )}

      <Card
        key={tasklist.id}
        sx={{
          borderColor: "#f1f3f4",
          borderRadius: "16px",
          borderStyle: "solid",
          borderWidth: "1px",
          flexShrink: 1,
          flexGrow: 1,
          margin: "4px",
          maxWidth: "350px",
          minWidth: "300px",
          height: "fit-content",
          overflow: "clip",
        }}
      >
        <CardHeader
          action={
            <IconButton
              id={"list"}
              aria-label="settings"
              onClick={(event) => handleClick(event, tasklist)}
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={tasklist.title}
        />

        <CardContent>
          {!loader && (
            <Box
              sx={{
                color: "rgb(26,115,232)",
                borderRadius: "20px",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "rgb(231 241 255)",
                  borderRadius: "20px",
                },
              }}
              onClick={() => {
                setTaskModalConfigs((prev) => {
                  return {
                    ...prev,
                    openModal: true,
                    lockTasklist: true,
                    prefilledData: {
                      current: tasklist,
                    },
                    handleSubmit: async ({ title, notes, tasklist_id }) => {
                      const { data: newTask } = await addTask({
                        tasklist_id: tasklist_id,
                        body: {
                          title,
                          notes,
                        },
                      });

                      const tasklistDC = JSON.parse(
                        JSON.stringify(data.tasklists)
                      );
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
              key={`add-task-${tasklist.id}`}
            >
              <Typography variant="h6" color="rgb(26,115,232)">
                <Stack direction={"row"} alignItems={"center"}>
                  <IconButton size="small">
                    <AddTaskIcon
                      sx={{
                        color: "rgb(26,115,232)",
                      }}
                    />
                  </IconButton>
                  Add a task
                </Stack>
              </Typography>
            </Box>
          )}

          {!tasklist.tasks ||
            (loader && (
              <>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
              </>
            ))}

          {!loader && !tasklist?.tasks?.length && (
            <Stack alignItems={"center"}>
              <img
                src={NoTasks}
                style={{
                  width: "104px",
                  margin: "10px",
                }}
              />
              <Typography>No tasks yet</Typography>
              <Typography variant="caption" textAlign={"center"}>
                Add your to-dos and keep track of them across Google Workspace
              </Typography>
            </Stack>
          )}

          {!loader &&
            tasklist[myOrderView ? "tasks" : "AllTasks"]
              ?.filter((task) => !task.hidden)
              .map((task) => {
                return (
                  <>
                    <Box
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgb(242 243 243)",
                        },
                      }}
                      key={task.id}
                    >
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        margin={"10px 0"}
                      >
                        <Stack direction={"column"}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            sx={{
                              "&:hover #menu": {
                                display: "flex",
                              },
                            }}
                          >
                            <IconButton
                              size="small"
                              component="button"
                              onClick={(e) =>
                                markTaskAsCompleted(task.id, tasklist.id)
                              }
                              onMouseEnter={() => setTaskIcon(task.id)}
                              onMouseLeave={() => setTaskIcon(null)}
                            >
                              {taskIcon === task.id ? (
                                <CheckIcon />
                              ) : (
                                <RadioButtonUncheckedIcon />
                              )}
                            </IconButton>

                            {task.title}
                            <IconButton
                              id="menu"
                              size="small"
                              component="button"
                              onClick={(event) =>
                                handleClick(event, tasklist, task)
                              }
                              sx={{
                                marginLeft: "auto",
                                display: "none",
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Stack>
                          <Typography variant="caption" margin={"0 0 5px 35px"}>
                            {task.notes}
                          </Typography>
                        </Stack>
                      </Typography>
                    </Box>
                    {task?.subtasks
                      ?.filter((subtask) => !subtask.hidden)
                      .map((subtask) => {
                        return (
                          <Box
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgb(242 243 243)",
                              },
                            }}
                            key={subtask.id}
                          >
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              margin={"10px 0 10px 30px"}
                            >
                              <Stack direction={"column"}>
                                <Stack
                                  direction={"row"}
                                  alignItems={"center"}
                                  sx={{
                                    "&:hover #submenu": {
                                      display: "flex",
                                    },
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    component="button"
                                    onClick={() =>
                                      markTaskAsCompleted(
                                        subtask.id,
                                        tasklist.id
                                      )
                                    }
                                    onMouseEnter={() => setTaskIcon(subtask.id)}
                                    onMouseLeave={() => setTaskIcon(null)}
                                  >
                                    {taskIcon === subtask.id ||
                                    taskIcon === task.id ? (
                                      <CheckIcon color="info" />
                                    ) : (
                                      <RadioButtonUncheckedIcon />
                                    )}
                                  </IconButton>

                                  {subtask.title}
                                  <IconButton
                                    id="submenu"
                                    size="small"
                                    component="button"
                                    onClick={(event) =>
                                      handleClick(event, tasklist, subtask)
                                    }
                                    sx={{
                                      marginLeft: "auto",
                                      display: "none",
                                    }}
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                </Stack>
                                <Typography
                                  variant="caption"
                                  margin={"0 0 5px 35px"}
                                >
                                  {subtask.notes}
                                </Typography>
                              </Stack>
                            </Typography>
                          </Box>
                        );
                      })}
                  </>
                );
              })}
        </CardContent>

        {tasklist?.HiddenTasks?.length > 0 && (
          <>
            <CardActions disableSpacing>
              <Typography>Completed ({tasklist.HiddenTasks.length})</Typography>
              <ExpandMore
                expand={expanded}
                onClick={() => setExpanded((prev) => !prev)}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                {loader && (
                  <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                  </>
                )}
                {!loader &&
                  tasklist?.HiddenTasks?.map((task) => {
                    return (
                      <Box
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgb(242 243 243)",
                          },
                        }}
                        key={task.id}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          margin={"10px 0 10px 30px"}
                        >
                          <Stack direction={"column"}>
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              sx={{
                                "&:hover #hiddenMenu": {
                                  display: "flex",
                                },
                              }}
                            >
                              <IconButton
                                size="small"
                                component="button"
                                onClick={() =>
                                  markTaskAsUnComplete(task.id, tasklist.id)
                                }
                              >
                                <CheckIcon color="info" />
                              </IconButton>

                              <Typography
                                sx={{
                                  textDecoration: "line-through",
                                }}
                              >
                                {task.title}
                              </Typography>
                              <IconButton
                                id="hiddenMenu"
                                size="small"
                                component="button"
                                onClick={(e) => {
                                  deleteCompletedTask(task.id, tasklist.id);
                                }}
                                sx={{
                                  marginLeft: "auto",
                                  display: "none",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                            <Typography
                              variant="caption"
                              margin={"0 0 5px 35px"}
                            >
                              {task.notes}
                            </Typography>
                          </Stack>
                        </Typography>
                      </Box>
                    );
                  })}
              </CardContent>
            </Collapse>
          </>
        )}
      </Card>
    </>
  );
};
export default TasklistCard;
