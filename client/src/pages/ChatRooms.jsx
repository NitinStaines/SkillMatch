import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FadeLoader from '../components/FadeLoader';

const ChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `${token}` };

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/my', {
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

  useEffect(() => {
    setCount(count + 1);
  }, []);

  console.log('debug');
  console.log(chatRooms);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Chat Rooms</Typography>
      {loading ? <FadeLoader /> : (
        chatRooms.length === 0 ? (
          <Box mt={4} textAlign="center">
            <Typography variant="body1">No chat rooms available yet.</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/connections')}
              sx={{ mt: 2 }}
            >
              Go to Connections
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2} mt={2}>
            {chatRooms.map((room, idx) => (
              <Grid item xs={12} sm={6} md={4} key={room._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Chat Room {idx + 1}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Participants: {room.participants && room.participants.length > 0
                        ? room.participants.filter(p => p && p.name).map(p => p.name).join(', ')
                        : 'N/A'}
                    </Typography> 
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/chat/${room._id}`)}
                      >
                        Open Chat
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}
    </Container>
  );
};

export default ChatRooms;
