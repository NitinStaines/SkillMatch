import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

const PageWrapper = ({ 
  children, 
  title, 
  loading = false, 
  loadingTitle = "Loading...",
  loadingSubtitle = "Please wait while we process your request",
  noContainer = false,
  fullWidth = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Box
        sx={{
          background: "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        
        {noContainer ? (
          children
        ) : (
          <Container maxWidth={fullWidth ? false : "lg"} sx={{ flexGrow: 1, py: 4, textAlign: 'center' }}>
            {title && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography variant="h4" fontWeight="bold" mb={4}>
                  {title}
                </Typography>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    gap: '2rem'
                  }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <div style={{
                        width: '80px',
                        height: '80px',
                        border: '4px solid rgba(0, 204, 68, 0.2)',
                        borderTop: '4px solid #00cc44',
                        borderRadius: '50%',
                        animation: 'spin 2s linear infinite'
                      }} />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Typography variant="h5" color="white" fontWeight="bold">
                        {loadingTitle}
                      </Typography>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Typography variant="body1" color="rgba(255,255,255,0.7)">
                        {loadingSubtitle}
                      </Typography>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        )}
      </Box>
    </motion.div>
  );
};

export default PageWrapper; 