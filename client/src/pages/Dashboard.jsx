import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
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
import PageWrapper from "../components/PageWrapper";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const userRes = await axios.get("https://skillmatch-backend-cwdm.onrender.com/api/auth/me", {
          headers: { Authorization: `${token}` },
        });
        setUser(userRes.data.user);

        const connectionsRes = await axios.get(
          "https://skillmatch-backend-cwdm.onrender.com/api/connections/my",
          {
            headers: { Authorization: `${token}` },
          }
        );
        setConnectionsCount(connectionsRes.data.connections.length);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <PageWrapper 
      loading={loading}
      loadingTitle="Loading Dashboard..."
      loadingSubtitle="Fetching your profile and connections"
      noContainer={true}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          py: 4,
          px: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: { xs: "3rem", md: "6rem" },
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
          }}
        >
          {dashboardCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
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
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(0,9,66,0.9)",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                >
                  <Box sx={{ mb: 2 }}>{card.icon}</Box>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Typography variant="h5" sx={{ color: "white", fontWeight: 800, mb: 1, textAlign: "center" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "white", fontWeight: 400, textAlign: "center" }}>
                    {card.description}
                  </Typography>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default Dashboard;
