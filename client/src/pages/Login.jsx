import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("https://skillmatch-backend-cwdm.onrender.com/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          variants={fadeIn(0)}
          initial="hidden"
          animate="visible"
          style={{ textAlign: "center" }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "200px",
              lineHeight: 1.2,
              letterSpacing: "-12px",
              textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
              fontWeight: 700,
              mb: -2,
            }}
          >
            <Box component="span" sx={{ color: "white" }}>
              skill
            </Box>
            <Box component="span" sx={{ color: "#4AFA7B" }}>
              Match
            </Box>
          </Typography>
        </motion.div>

        <motion.div
          variants={fadeIn(0.3)}
          initial="hidden"
          animate="visible"
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontSize: "64px",
              letterSpacing: "-1.92px",
              fontWeight: 700,
            }}
          >
            connect. learn. evolve.
          </Typography>
        </motion.div>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: "946px",
            mx: "auto",
          }}
        >
          <motion.div
            variants={fadeIn(0.4)}
            initial="hidden"
            animate="visible"
          >
            {error && (
              <Typography color="error" sx={{ mb: 2, fontWeight: 500 }}>
                {error}
              </Typography>
            )}
          </motion.div>

          <motion.div variants={fadeIn(0.5)} initial="hidden" animate="visible">
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#d9d9d9", mb: 1, fontWeight: 500 }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div variants={fadeIn(0.6)} initial="hidden" animate="visible">
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ color: "#d9d9d9", mb: 1, fontWeight: 500 }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  },
                }}
              />
            </Box>
          </motion.div>

          <motion.div variants={fadeIn(0.7)} initial="hidden" animate="visible">
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "184px",
                height: "66px",
                borderRadius: 2,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 500,
                mb: 3,
                bgcolor: "#0A1172",
                "&:hover": {
                  bgcolor: "#050A47",
                },
              }}
            >
              Login
            </Button>
          </motion.div>

          <motion.div variants={fadeIn(0.8)} initial="hidden" animate="visible">
            <Typography
              variant="body1"
              sx={{ color: "white", fontWeight: 500 }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                underline="always"
                sx={{ color: "white", cursor: "pointer" }}
              >
                Register here
              </Link>
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
