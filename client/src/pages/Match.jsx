import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Stack,
  Container,
  CircularProgress,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FadeLoader from '../components/FadeLoader';
import Navbar from '../components/Navbar';

const MAX_SKILLS_DISPLAY = 6;
const CARDS_PER_PAGE = 3;


const SkillLabel = ({ label, color }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Chip
      label={label}
      size="medium"
      sx={{
        backgroundColor: color || 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        fontSize: 14,
        height: 32,
        borderRadius: 2,
        fontWeight: 500,
      }}
    />
  </motion.div>
);


const MatchCard = ({ match, index }) => {
  const canTeach = match.canTeachThem || [];
  const canTeachDisplay = canTeach.slice(0, MAX_SKILLS_DISPLAY);
  const canTeachExtra = Math.max(0, canTeach.length - MAX_SKILLS_DISPLAY);

  const canLearn = match.canLearnFromThem || [];
  const user = match.user || null;
  const canLearnDisplay = canLearn.slice(0, MAX_SKILLS_DISPLAY);
  const canLearnExtra = Math.max(0, canLearn.length - MAX_SKILLS_DISPLAY);
  const navigate = useNavigate();

  // State for connection request feedback
  const [requestStatus, setRequestStatus] = useState(null); // 'loading', 'success', 'error'
  const [requestMessage, setRequestMessage] = useState('');

  const handleConnectionRequest = async () => {
    setRequestStatus('loading');
    setRequestMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://skillmatch-backend-cwdm.onrender.com/api/connections/send/${user._id}`,
        {},
        {
          headers: { Authorization: token }
        }
      );

      setRequestStatus('success');
      setRequestMessage(response.data.message);
      

      setTimeout(() => {
        setRequestStatus(null);
        setRequestMessage('');
      }, 3000);

    } catch (error) {
      setRequestStatus('error');
      setRequestMessage(error.response?.data?.message || 'Failed to send connection request');
      

      setTimeout(() => {
        setRequestStatus(null);
        setRequestMessage('');
      }, 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <Card
        sx={{
          backgroundColor: '#0c1a49',
          color: 'white',
          borderRadius: 4,
          padding: 3,
          width: 280,
          minHeight: 700,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              {match.user.name.split(' ')[0]} <br /> {match.user.name.split(' ')[1] || ''}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
          >
            <Box my={2} borderBottom="2px solid gray" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <Typography variant="h6" mb={2}>
              Match rate: <span style={{ color: '#00ff00', fontWeight: 'bold' }}>{match.matchPercentage}</span>
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Box>
                <Typography variant="h6" mb={1.5} fontWeight="bold">
                  You Teach:
                </Typography>
                {canTeach.length === 0 ? (
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    No skills to teach them.
                  </Typography>
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={1} mb={1}>
                    {canTeachDisplay.map((skill, skillIndex) => (
                      <motion.div
                        key={skill._id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 + skillIndex * 0.1 }}
                      >
                        <SkillLabel label={skill.name} color="#00cc44" />
                      </motion.div>
                    ))}
                    {canTeachExtra > 0 && (
                      <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>+{canTeachExtra} more</Typography>
                    )}
                  </Stack>
                )}
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <Box>
                <Typography variant="h6" mb={1.5} fontWeight="bold">
                  You Learn:
                </Typography>
                {canLearn.length === 0 ? (
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    No skills to learn from them.
                  </Typography>
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {canLearnDisplay.map((skill, skillIndex) => (
                      <motion.div
                        key={skill._id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.0 + index * 0.1 + skillIndex * 0.1 }}
                      >
                        <SkillLabel label={skill.name} />
                      </motion.div>
                    ))}
                    {canLearnExtra > 0 && (
                      <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>+{canLearnExtra} more</Typography>
                    )}
                  </Stack>
                )}
              </Box>
            </motion.div>
          </Box>
        </CardContent>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 + index * 0.1 }}
        >
          <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate(`/skillProfile/user/${user._id}`)}
              sx={{ 
                backgroundColor: '#00cc44', 
                color: 'white', 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#00aa33'
                }
              }}
            >
              View Profile
            </Button>
            
            {/* Connection Request Button */}
            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              onClick={handleConnectionRequest}
              disabled={requestStatus === 'loading'}
              sx={{ 
                backgroundColor: requestStatus === 'success' ? '#00cc44' : 
                           requestStatus === 'error' ? '#ff4444' : '#333', 
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: requestStatus === 'success' ? '#00aa33' : 
                                 requestStatus === 'error' ? '#cc3333' : '#555'
                },
                '&:disabled': {
                  backgroundColor: '#666',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              {requestStatus === 'loading' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  Sending...
                </Box>
              ) : requestStatus === 'success' ? (
                'Request Sent!'
              ) : requestStatus === 'error' ? (
                'Try Again'
              ) : (
                'Send Connection Request'
              )}
            </Button>

            {/* Feedback Message */}
            {requestMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: requestStatus === 'success' ? '#00cc44' : '#ff4444',
                    textAlign: 'center',
                    fontWeight: 'medium',
                    fontSize: '0.875rem',
                    mt: 1
                  }}
                >
                  {requestMessage}
                </Typography>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Card>
    </motion.div>
  );
};

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '2rem'
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <CircularProgress 
        size={80} 
        thickness={4}
        sx={{ 
          color: '#00cc44',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Typography variant="h5" color="white" fontWeight="bold">
        Finding your perfect matches...
      </Typography>
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <Typography variant="body1" color="rgba(255,255,255,0.7)">
        Analyzing skills and preferences
      </Typography>
    </motion.div>
  </motion.div>
);

const TopMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `${token}` };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('https://skillmatch-backend-cwdm.onrender.com/api/match', {
          headers,
        });
        setMatches(res.data.matches || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleNext = () => {
    if ((page + 1) * CARDS_PER_PAGE < matches.length) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const paginatedMatches = matches.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

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
          overflow: 'hidden',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <Container maxWidth={false} sx={{ flexGrow: 1, py: 4, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Your top matches
            </Typography>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSpinner />
              </motion.div>
            ) : matches.length === 0 ? (
              <motion.div
                key="no-matches"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box mt={4} textAlign="center">
                  <Typography variant="h6" mb={2}>
                    No matches found yet. Try updating your skill profile.
                  </Typography>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="contained" color="primary" href="/skillProfile" sx={{ mt: 2 }}>
                      Go to Profile
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="matches"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box display="flex" justifyContent="center" alignItems="center">
                  {matches.length > CARDS_PER_PAGE && (
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton sx={{ color: 'limegreen' }} onClick={handlePrev} disabled={page === 0}>
                        <ArrowBackIos />
                      </IconButton>
                    </motion.div>
                  )}

                  <Box display="flex" gap={3}>
                    {paginatedMatches.map((match, index) => (
                      <MatchCard key={match.user._id} match={match} index={index} />
                    ))}
                  </Box>

                  {matches.length > CARDS_PER_PAGE && (
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        sx={{ color: 'limegreen' }}
                        onClick={handleNext}
                        disabled={(page + 1) * CARDS_PER_PAGE >= matches.length}
                      >
                        <ArrowForwardIos />
                      </IconButton>
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </motion.div>
  );
};

export default TopMatches;
