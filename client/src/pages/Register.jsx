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
import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://skillmatch-backend-cwdm.onrender.com/api/auth/register",
        form
      );
      setError("");
      setSuccess(res.data.message);
    } catch (err) {
      setSuccess("");
      setError(err.response?.data?.message || "Registration failed.");
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
          style={{ textAlign: "center", marginBottom: "0rem" }}
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
            {success && (
              <Typography color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                {success}
              </Typography>
            )}
          </motion.div>

          <motion.div variants={fadeIn(0.5)} initial="hidden" animate="visible">
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#d9d9d9", mb: 1, fontWeight: 500 }}
              >
                Name
              </Typography>
              <TextField
                fullWidth
                placeholder="name"
                type="text"
                name="name"
                value={form.name}
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

          <motion.div variants={fadeIn(0.7)} initial="hidden" animate="visible">
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

          <motion.div variants={fadeIn(0.8)} initial="hidden" animate="visible">
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
              Register
            </Button>
          </motion.div>

          <motion.div variants={fadeIn(0.9)} initial="hidden" animate="visible">
            <Typography
              variant="body1"
              sx={{ color: "white", fontWeight: 500 }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                underline="always"
                sx={{ color: "white", cursor: "pointer" }}
              >
                Login here
              </Link>
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
