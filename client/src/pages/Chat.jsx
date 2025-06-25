import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';
import FadeLoader from '../components/FadeLoader';

import axios from 'axios';

const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `${token}` };

  const fetchMessages = async () => {

    try {
        const chatRes = await axios.get(`http://localhost:5000/api/chat/${roomId}`, {
            headers,
          });
          setMessages(chatRes.data.messages || []);
        } catch (err) {
          console.error('Error fetching chat data:', err);
        }
  };

  const fetchChatData = async () => {
    try {
      const userRes = await axios.get('http://localhost:5000/api/auth/me', {
        headers,
      });

      setUserId(userRes.data.user._id);

      const chatRes = await axios.get(`http://localhost:5000/api/chat/${roomId}`, {
        headers,
      });

      setMessages(chatRes.data.messages || []);
    } catch (err) {
      console.error('Error fetching chat data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
  }, [roomId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    formData.append('text', newMessage);
    if (file) formData.append('attachment', file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/chat/${roomId}/send`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      fetchMessages();
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage('');
      setFile(null);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Message sending failed.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Chat Room</Typography>
      {loading ? <FadeLoader /> : (
        <>
          <Divider sx={{ my: 2 }} />

          <Box mb={4} sx={{ minHeight: '300px' }}>
            {messages.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No messages in this chat room yet.
              </Typography>
            ) : (
                messages.map((msg) => (
                    <Card
                      key={msg._id}
                      sx={{
                        mb: 2,
                        backgroundColor: msg.sender._id === userId ? '#e3f2fd' : '#f5f5f5',
                        textAlign: msg.sender._id === userId ? 'right' : 'left'
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {msg.sender._id === userId ? 'You' : msg.sender.name}
                        </Typography>
                  
                        {msg.text && (
                          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {msg.text}
                          </Typography>
                        )}
                  
                        {msg.attachment && msg.attachment.filetype.startsWith('image/') && (
                          <Box mt={1}>
                            <img
                              src={`http://localhost:5000${msg.attachment.url}`}
                              alt={msg.attachment.filename}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                borderRadius: '8px',
                                marginTop: '8px'
                              }}
                            />
                          </Box>
                        )}
                  
                        {msg.attachment && !msg.attachment.filetype.startsWith('image/') && (
                          <Box mt={1}>
                            <a
                              href={`http://localhost:5000${msg.attachment.url}`}
                              download={msg.attachment.filename}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {msg.attachment.filename}
                            </a>
                          </Box>
                        )}
                  
                        <Typography variant="caption" color="text.secondary">
                          {new Date(msg.createdAt).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Message Input */}
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              fullWidth
              variant="outlined"
              label="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="*"
            />
            
            <Button variant="contained" onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Chat;
