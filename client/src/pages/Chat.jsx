import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FadeLoader from "../components/FadeLoader";
import Navbar from "../components/Navbar";

const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [chatWith, setChatWith] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `${token}` };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`https://skillmatch-backend-cwdm.onrender.com/api/chat/${roomId}`, {
        headers,
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchChatData = async () => {
    try {
      const userRes = await axios.get("https://skillmatch-backend-cwdm.onrender.com/api/auth/me", {
        headers,
      });
      setUserId(userRes.data.user._id);

      const chatRes = await axios.get(`https://skillmatch-backend-cwdm.onrender.com/api/chat/${roomId}`, {
        headers,
      });

      setMessages(chatRes.data.messages || []);
      setChatWith(chatRes.data.chatWith || null);
    } catch (err) {
      console.error("Error fetching chat data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    formData.append("text", newMessage);
    if (file) formData.append("attachment", file);

    try {
      await axios.post(
        `https://skillmatch-backend-cwdm.onrender.com/api/chat/${roomId}/send`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNewMessage("");
      setFile(null);
      await fetchMessages(); // Re-fetch to ensure proper alignment
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Message sending failed.");
    }
  };

  useEffect(() => {
    fetchChatData();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{ px: 6, pt: 6, pb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "white",
              }}
            >
              {chatWith?.name || "Chat"}
            </Typography>
            {chatWith?._id && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/skillProfile/user/${chatWith._id}`)}
              >
                View Profile
              </Button>
            )}
          </Box>
        </Box>

        {/* Scrollable Message Area */}
        <Box
          sx={{
            flexGrow: 1,
            px: 6,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pb: 2,
          }}
        >
          {loading ? (
            <FadeLoader />
          ) : messages.length === 0 ? (
            <Typography color="white">No messages yet.</Typography>
          ) : (
            messages.map((msg) => (
              <Box
                key={msg._id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender._id === userId ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    maxWidth: "60%",
                    p: 2,
                    borderRadius:
                      msg.sender._id === userId
                        ? "24px 0px 0px 24px"
                        : "0px 24px 24px 0px",
                    bgcolor:
                      msg.sender._id === userId
                        ? "rgba(231, 254, 204, 0.97)"
                        : "white",
                    border: "0.5px solid rgba(128, 128, 128, 0.4)",
                    color: "black",
                  }}
                >
                  <Typography sx={{ fontSize: "16px" }}>
                    {msg.text}
                  </Typography>

                  {msg.attachment?.filetype?.startsWith("image/") && (
                    <Box mt={1}>
                      <img
                        src={`https://skillmatch-backend-cwdm.onrender.com${msg.attachment.url}`}
                        alt={msg.attachment.filename}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}

                  {msg.attachment &&
                    !msg.attachment.filetype?.startsWith("image/") && (
                      <Box mt={1}>
                        <a
                          href={`https://skillmatch-backend-cwdm.onrender.com${msg.attachment.url}`}
                          download={msg.attachment.filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "blue" }}
                        >
                          {msg.attachment.filename}
                        </a>
                      </Box>
                    )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: "12px", color: "gray" }}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </Typography>
                    {msg.sender._id === userId && (
                      <DoneAllIcon sx={{ fontSize: 16, color: "green" }} />
                    )}
                  </Box>
                </Paper>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            px: 6,
            py: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
            }}
          >
            <Button component="label" sx={{ minWidth: 0, p: 1 }}>
              <AttachFileIcon fontSize="large" />
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>

            <TextField
              fullWidth
              placeholder="Enter your message..."
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              sx={{
                mx: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  borderRadius: 1,
                },
              }}
            />

            <Button sx={{ minWidth: 0, p: 1 }} onClick={handleSendMessage}>
              <SendIcon fontSize="large" />
            </Button>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Chat;
