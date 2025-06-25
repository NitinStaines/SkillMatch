import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
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
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FadeLoader from '../components/FadeLoader';

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
      const res = await axios.get('http://localhost:5000/api/connections/my', { headers });
      setConnections(res.data.connections);

      const incomingReqs = await axios.get('http://localhost:5000/api/connections/incoming', { headers });
      setIncoming(incomingReqs.data.requests);

      const sentReqs = await axios.get('http://localhost:5000/api/connections/sent', { headers });
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
        'http://localhost:5000/api/connections/send',
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
      await axios.post(`http://localhost:5000/api/connections/respond/${requestId}`, { status }, { headers });
      setError("");
      fetchAll();
    } catch (err) {
      setError('Failed to respond to request');
    }
  };

  const removeRequest = async (removeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/connections/remove/${removeId}`, { headers })
      setError("");
      fetchAll();
    }
    catch (err) {
      setError('Failed to remove connection.');
    }
  };
  return (
    <Container>
      {loading ? <FadeLoader /> : (
        <>
          <Typography variant="h4" gutterBottom>Connections</Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {/* Active Connections */}
          <Typography variant="h6" mt={2}>Connected Users</Typography>
          <Grid container spacing={2} mb={4}>
            {connections.map(conn => (
              <Grid item xs={12} sm={6} key={conn._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{conn.name}</Typography>
                    <Typography>{conn.email}</Typography>
                    <Box mt={1}>
                      <Button variant="contained" size="small" onClick={() => navigate('/chat')}>
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
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider />

          {/* Incoming Requests */}
          <Typography variant="h6" mt={4}>Incoming Requests</Typography>
          <Grid container spacing={2} mb={4}>
            {incoming.map(req => (
              <Grid item xs={12} sm={6} key={req._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{req.fromUser.name}</Typography>
                    <Typography>{req.fromUser.email}</Typography>
                    <Box mt={1}>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        sx={{ mr: 1 }}
                        onClick={() => respondToRequest(req._id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => respondToRequest(req._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider />

          <Typography variant="h6" mt={4}>Send Request</Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                      label="Enter username"
                      variant="standard"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    <Button variant="contained" onClick={sendRequest}>Send Request</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>


          <Divider />

          {/* Sent Requests */}
          <Typography variant="h6" mt={4}>Sent Requests</Typography>
          <Grid container spacing={2}>
            {sent.map(req => (
              <Grid item xs={12} sm={6} key={req._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{req.toUser.name}</Typography>
                    <Typography>{req.toUser.email}</Typography>
                    <Typography variant="body2" mt={1} color="text.secondary">
                      Status: {req.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Remove Connection</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to remove this connection?</Typography>
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
        </>
      )}
    </Container>
  );
};

export default Connections;
