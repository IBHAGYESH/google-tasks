import {
  AppBar,
  Typography,
  IconButton,
  ButtonGroup,
  Box,
  Toolbar,
  Button,
  InputBase,
  Checkbox,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";

import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { googleLogout } from "@react-oauth/google";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import useAuth from "../../../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

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
    id: "month",
  },
];

const Header = ({ setOpenDrawer, view, setView }) => {
  const { resetAuth } = useAuth();
  const location = useLocation();
  const [currentFilter, setCurrentFilter] = useState(filterOptions[0].id);
  const [myOrderView, setMyOrderView] = useState(true);
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "none",
      }}
      color="inherit"
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpenDrawer((prev) => !prev)}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <img
          src={`https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${new Date().getDate()}_2x.png`}
          style={{
            width: "40px",
          }}
        />
        <Typography
          fontFamily={"Roboto, Arial, sans-serif;"}
          fontSize={"22px"}
          marginLeft={"10px"}
        >
          Calendar
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction={"row"} gap={2} alignItems={"center"}>
          <Stack direction={"row"} alignItems={"center"}>
            <Checkbox
              defaultChecked
              onChange={() => setMyOrderView((prev) => !prev)}
            />
            <Typography>Group by task list</Typography>
          </Stack>
          <Box>
            {location.pathname === "/" && (
              <ButtonGroup size="small">
                <Button
                  onClick={() => setView("Kanban")}
                  variant={view === "Kanban" ? "contained" : "outlined"}
                >
                  <SpaceDashboardOutlinedIcon />
                </Button>
                <Button
                  onClick={() => setView("List")}
                  variant={view === "List" ? "contained" : "outlined"}
                >
                  <ViewListOutlinedIcon />
                </Button>
              </ButtonGroup>
            )}
          </Box>
          <Select
            id="demo-simple-select"
            value={currentFilter}
            label={currentFilter}
            disabled={myOrderView}
            onChange={(e) => setCurrentFilter(e.target.value)}
            variant="outlined"
            size="small"
          >
            {filterOptions.map((filter) => (
              <MenuItem key={filter.id} value={filter.id}>
                {filter.title}
              </MenuItem>
            ))}
          </Select>
          <Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={() => {
                googleLogout();
                localStorage.removeItem("x-app-token");
                resetAuth();
              }}
              color="inherit"
            >
              <LogoutOutlinedIcon />
            </IconButton>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
