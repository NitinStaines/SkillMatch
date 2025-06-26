import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: <DashboardIcon />, selected: true },
    { name: "Skill Profile", icon: <PersonIcon /> },
    { name: "Chat Rooms", icon: <ChatIcon /> },
    { name: "Find Matches", icon: <SearchIcon /> },
    { name: "Connections", icon: <AddIcon /> },
  ];

  const dashboardCards = [
    {
      title: "Skill Profile",
      description: "Manage your profile",
      icon: <PersonIcon sx={{ fontSize: 80, color: "white" }} />,
      onClick: () => navigate("/skillProfile"),
    },
    {
      title: "Connections",
      description: "Manage your connections",
      icon: <AddIcon sx={{ fontSize: 80, color: "white" }} />,
      onClick: () => navigate("/connections"),
    },
    {
      title: "Find Matches",
      description: "Find people to learn and teach",
      icon: <SearchIcon sx={{ fontSize: 80, color: "white" }} />,
      onClick: () => navigate("/match"),
    },
    {
      title: "Chat Rooms",
      description: "Message your connections",
      icon: <ChatIcon sx={{ fontSize: 80, color: "white" }} />,
      onClick: () => navigate("/chatRooms"),
    },
  ];

  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `${token}` },
        });
        setUser(userRes.data.user);

        const connectionsRes = await axios.get(
          "http://localhost:5000/api/connections/my",
          {
            headers: { Authorization: `${token}` },
          }
        );
        setConnectionsCount(connectionsRes.data.connections.length);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background:
          "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
        display: "flex",
        flexWrap: true,
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pb: 6,
        }}
      >
        <motion.div variants={fadeIn(0.6)} initial="hidden" animate="visible">
          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "6rem",
              mt: 4,
              mb: 6,
              textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
              textAlign: "center",
            }}
          >
            {user ? (
              <>
                Welcome, <span style={{ color: "#4caf50" }}>{user.name}</span>
              </>
            ) : (
              "Loading..."
            )}
          </Typography>
        </motion.div>

        <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              gap: 4,
              height: "100%",
               // Ensures vertical fill
            }}
          >
            {dashboardCards.map((card, index) => (
              <motion.div
                key={index}
                variants={fadeIn(0.7 + index * 0.2)}
                initial="hidden"
                animate="visible"
                style={{
                  flex: "1 1 calc(50% - 2rem)",
                  minWidth: "300px",
                  maxWidth: "48%",
                  display: "flex",
                }}
              >
                <Card
                  onClick={card.onClick}
                  sx={{
                    flexGrow: 1,
                    bgcolor: "rgba(0,9,66,0.8)",
                    borderRadius: "32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    cursor: "pointer",
                    width: "100%",
                    "&:hover": {
                      bgcolor: "rgba(0,9,66,0.9)",
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{card.icon}</Box>
                  <Typography variant="h5" sx={{ color: "white", fontWeight: 800, mb: 1, textAlign: "center" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "white", fontWeight: 400, textAlign: "center" }}>
                    {card.description}
                  </Typography>
                </Card>
              </motion.div>
            ))}
          </Box>

      </Container>
    </Box>
  );
};

export default Dashboard;
