import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const navItems = [
  { name: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { name: "Skill Profile", icon: <PersonIcon />, path: "/skillProfile" },
  { name: "Chat Rooms", icon: <ChatIcon />, path: "/chatRooms" },
  { name: "Find Matches", icon: <SearchIcon />, path: "/match" },
  { name: "Connections", icon: <AddIcon />, path: "/connections" },
];

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay },
  },
});

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.div
      variants={fadeIn(0)}
      initial="hidden"
      animate="visible"
    >
      <AppBar
        position="static"
        sx={{
          background: "#0A1172",
          boxShadow: "none",
          padding: "0 24px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Logo */}
          <Typography
            variant="h5"
            onClick={() => isLoggedIn ? navigate("/dashboard") : navigate("/")}
            sx={{
              textDecoration: "none",
              color: "#4AFA7B",
              fontWeight: 700,
              fontSize: "28px",
              letterSpacing: "-1px",
              cursor: "pointer",
              mr: 2,
            }}
          >
            <Box component="span" sx={{ color: "white" }}>
              Skill
            </Box>
            Match
          </Typography>

          {/* Nav Links */}
          {isLoggedIn && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
                flex: 1,
              }}
            >
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.name}
                    variants={fadeIn(0.2 + index * 0.1)}
                    initial="hidden"
                    animate="visible"
                  >
                    <Button
                      startIcon={item.icon}
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: isActive ? "#4AFA7B" : "white",
                        textTransform: "none",
                        fontWeight: isActive ? 600 : 500,
                        bgcolor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                        borderRadius: "20px",
                        px: 2,
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                        },
                      }}
                    >
                      {item.name}
                    </Button>
                  </motion.div>
                );
              })}
            </Box>
          )}

          {/* Auth Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {isLoggedIn ? (
              <motion.div
                variants={fadeIn(1)}
                initial="hidden"
                animate="visible"
              >
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Logout
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  variants={fadeIn(0.8)}
                  initial="hidden"
                  animate="visible"
                >
                  <Button
                    color="inherit"
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "white",
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    Login
                  </Button>
                </motion.div>

                <motion.div
                  variants={fadeIn(0.9)}
                  initial="hidden"
                  animate="visible"
                >
                  <Button
                    color="inherit"
                    onClick={() => navigate("/register")}
                    sx={{
                      color: "white",
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    Register
                  </Button>
                </motion.div>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
