import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { WifiOff, Refresh, Login } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ServerDown = ({ onRetry, isChecking, onLogout }) => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    if (onLogout) {
      onLogout(); // Clear token and user data
    }
    navigate('/login');
  };

  const handleRetry = async () => {
    await onRetry();
    // If server comes back online, the token will be valid again
    // If not, user will stay on this page
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 3
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WifiOff 
          sx={{ 
            fontSize: 80, 
            color: '#ff4444', 
            mb: 3,
            filter: 'drop-shadow(0 4px 8px rgba(255, 68, 68, 0.3))'
          }} 
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Server Unavailable
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Typography variant="h6" color="rgba(255,255,255,0.8)" mb={2} maxWidth="500px">
          We're having trouble connecting to our servers. You have been logged out for security reasons.
        </Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.7)" mb={4} maxWidth="500px">
          Please try again when the server is back online. You'll need to log in again.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleRetry}
          disabled={isChecking}
          startIcon={isChecking ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
          sx={{
            backgroundColor: '#00cc44',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#00aa33'
            },
            '&:disabled': {
              backgroundColor: '#666',
              color: 'rgba(255,255,255,0.5)'
            }
          }}
        >
          {isChecking ? 'Checking Connection...' : 'Retry Connection'}
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleGoToLogin}
          startIcon={<Login />}
          sx={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2,
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Go to Login
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Typography variant="body2" color="rgba(255,255,255,0.6)" mt={4}>
          If the problem persists, please contact support
        </Typography>
      </motion.div>
    </Box>
  );
};

export default ServerDown;
