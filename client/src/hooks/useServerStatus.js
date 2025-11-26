import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useServerStatus = () => {
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [hasShownServerDown, setHasShownServerDown] = useState(false);

  const checkServerStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      // Try to make a simple request to check if server is available
      await axios.get('https://skillmatch-backend-cwdm.onrender.com/api/auth/health', {
        timeout: 5000 // 5 second timeout
      });
      setIsServerOnline(true);
      setHasShownServerDown(false);
    } catch (error) {
      // If we get a network error or timeout, server is down
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        setIsServerOnline(false);
        setHasShownServerDown(true);
        // Only clear token after showing server down page
        // This will be handled by the ServerDown component
      } else {
        // If we get a response (even an error), server is online
        setIsServerOnline(true);
        setHasShownServerDown(false);
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  const clearTokenAndRedirect = useCallback(() => {
    // Clear JWT token when user acknowledges server is down
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHasShownServerDown(false);
  }, []);

  useEffect(() => {
    checkServerStatus();
    
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkServerStatus, 900000);
    
    return () => clearInterval(interval);
  }, [checkServerStatus]);

  return {
    isServerOnline,
    isChecking,
    hasShownServerDown,
    checkServerStatus,
    clearTokenAndRedirect
  };
};

export default useServerStatus;
