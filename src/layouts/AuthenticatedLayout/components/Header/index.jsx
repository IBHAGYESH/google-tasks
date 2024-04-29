import {
  AppBar,
  Typography,
  IconButton,
  ButtonGroup,
  Box,
  Toolbar,
  Button,
  InputBase,
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

const Header = ({ setOpenDrawer, view, setView }) => {
  const { resetAuth } = useAuth();
  const location = useLocation();
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
        <Box display={"flex"} alignItems={"center"}>
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
