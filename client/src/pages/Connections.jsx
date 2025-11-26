import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `${token}` };

  const fetchAll = async () => {
    try {
      const res = await axios.get('https://skillmatch-backend-cwdm.onrender.com/api/connections/my', { headers });
      setConnections(res.data.connections);

      const incomingReqs = await axios.get('https://skillmatch-backend-cwdm.onrender.com/api/connections/incoming', { headers });
      setIncoming(incomingReqs.data.requests);

      const sentReqs = await axios.get('https://skillmatch-backend-cwdm.onrender.com/api/connections/sent', { headers });
      setSent(sentReqs.data.requests);
    } catch (err) {
      console.error('Failed to fetch connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const sendRequest = async () => {
    if (!searchUser.trim()) {
      setError('Please enter a username');
      return;
    }
  
    try {
      await axios.post(
        'https://skillmatch-backend-cwdm.onrender.com/api/connections/send',
        { toUserName: searchUser },
        { headers }
      );
      setError("");
      setSearchUser('');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    }
  };
  
  const respondToRequest = async (requestId, status) => {
    try {
      await axios.post(`https://skillmatch-backend-cwdm.onrender.com/api/connections/respond/${requestId}`, { status }, { headers });
      setError("");
      fetchAll();
    } catch (err) {
      setError('Failed to respond to request');
    }
  };

  const removeRequest = async (removeId) => {
    try {
      await axios.delete(`https://skillmatch-backend-cwdm.onrender.com/api/connections/remove/${removeId}`, { headers })
      setError("");
      fetchAll();
    }
    catch (err) {
      setError('Failed to remove connection.');
    }
  };


  const goToChatRoom = async (otherUserId) => {
    try {

      const res = await axios.post(
        `https://skillmatch-backend-cwdm.onrender.com/api/chat/username/${otherUserId}`,
        {},
        { headers }
      );
      const roomId = res.data.roomId || res.data.room._id;
      if (roomId) {
        navigate(`/chat/${roomId}`);
      } else {
        setError('Could not find or create chat room.');
      }
    } catch (err) {
      setError('Could not find or create chat room.');
    }
  };

  return (
    <PageWrapper 
      loading={loading}
      loadingTitle="Loading Connections..."
      loadingSubtitle="Fetching your connections and requests"
      title="Connections"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ textAlign: 'center', marginBottom: 16 }}
        >
          <Typography color="error.main">{error}</Typography>
        </motion.div>
      )}

      {/* Active Connections */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          Connected Users ({connections.length})
        </Typography>
        <Grid container spacing={3} mb={6} justifyContent="center">
          {connections.map((conn, index) => (
            <Grid item xs={12} sm={6} md={4} key={conn._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
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
                      {conn.name}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                      {conn.email}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => goToChatRoom(conn._id)}
                        sx={{ 
                          backgroundColor: '#00cc44',
                          '&:hover': { backgroundColor: '#00aa33' }
                        }}
                      >
                        Chat
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedUserId(conn._id);
                          setOpenDialog(true);
                        }}
                        sx={{ borderColor: '#ff4444', color: '#ff4444' }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 4 }} />

      {/* Incoming Requests */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
          Incoming Requests ({incoming.length})
        </Typography>
        <Grid container spacing={3} mb={6}>
          {incoming.map((req, index) => (
            <Grid item xs={12} sm={6} md={4} key={req._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
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
                      {req.fromUser.name}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                      {req.fromUser.email}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => respondToRequest(req._id, 'accepted')}
                        sx={{ 
                          backgroundColor: '#00cc44',
                          '&:hover': { backgroundColor: '#00aa33' }
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => respondToRequest(req._id, 'rejected')}
                        sx={{ borderColor: '#ff4444', color: '#ff4444' }}
                      >
                        Reject
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 4 }} />

      {/* Send Request */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
          Send Connection Request
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <TextField
            label="Enter username"
            variant="outlined"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            sx={{
              width: { xs: '100%', sm: '400px' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00cc44',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={sendRequest}
            sx={{ 
              width: { xs: '100%', sm: '400px' },
              backgroundColor: '#00cc44',
              '&:hover': { backgroundColor: '#00aa33' },
              fontWeight: 'bold',
              fontSize: '1.1rem',
              py: 1.5,
              mb: 3
            }}
          >
            Send Request
          </Button>
        </Box>
      </motion.div>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 4 }} />

      {/* Sent Requests as Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
          Sent Requests ({sent.length})
        </Typography>
        {sent.length === 0 ? (
          <Typography color="text.secondary">No sent requests.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ background: 'none', boxShadow: 'none', maxWidth: 700, margin: '0 auto' }}>
            <Table size="small" sx={{ minWidth: 300 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sent.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{req.toUser.name}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{req.toUser.email}</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>Pending</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </motion.div>

      {/* Remove Connection Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Remove Connection</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this connection?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              removeRequest(selectedUserId);
              setOpenDialog(false);
            }}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default Connections;
