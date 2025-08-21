import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';

const ChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `${token}` };
        const res = await axios.get('https://skillmatch-backend-cwdm.onrender.com/api/chat/my', {
          headers,
        });
        setChatRooms(res.data.rooms || []);
      } catch (err) {
        console.error('Error fetching chat rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <PageWrapper
      loading={loading}
      loadingTitle="Loading Chat Rooms..."
      loadingSubtitle="Fetching your conversations"
      title="Chat Rooms"
    >
      {chatRooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box mt={4} textAlign="center">
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              No chat rooms available yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/connections')}
              sx={{ mt: 2, backgroundColor: '#00cc44', '&:hover': { backgroundColor: '#00aa33' } }}
            >
              Go to Connections
            </Button>
          </Box>
        </motion.div>
      ) : (
        <Grid container spacing={3} mt={1} justifyContent="center">
          {chatRooms.map((room, idx) => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                  }
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Chat Room {idx + 1}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Participants: {room.participants && room.participants.length > 0
                        ? room.participants.filter(p => p && p.name).map(p => p.name).join(', ')
                        : 'N/A'}
                    </Typography>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/chat/${room._id}`)}
                        sx={{ 
                          backgroundColor: '#00cc44',
                          '&:hover': { backgroundColor: '#00aa33' },
                          fontWeight: 'bold'
                        }}
                      >
                        Open Chat
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </PageWrapper>
  );
};

export default ChatRooms;
