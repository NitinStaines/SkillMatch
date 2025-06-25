import { useEffect, useState } from 'react';
import { Typography, Container, Box, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [skillProfile, setSkillProfile] = useState(null);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
    const token = localStorage.getItem('token');
  
      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `${token}` }
        });
        setUser(userRes.data.user);
  
        const profileRes = await axios.get('http://localhost:5000/api/skillProfile/me', {
          headers: { Authorization: `${token}` }
        });
        setSkillProfile(profileRes.data.profile);
  
        const connectionsRes = await axios.get('http://localhost:5000/api/connections/my', {
          headers: { Authorization: `${token}` }
        });
        setConnectionsCount(connectionsRes.data.connections.length);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>{user ? `Welcome back, ${user.name}` : 'Loading...'}</Typography>
        {user && (
          <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Your Profile Summary</Typography>
            <Typography><strong>Name:</strong> {user.name}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            {skillProfile && (
              <>
                <Typography><strong>Bio:</strong> {skillProfile.bio || 'No bio added'}</Typography>
                <Typography><strong>Skills to Teach:</strong> {skillProfile.skillsToTeach.map(s => s.name).join(', ') || 'None'}</Typography>
                <Typography><strong>Skills to Learn:</strong> {skillProfile.skillsToLearn.map(s => s.name).join(', ') || 'None'}</Typography>
              </>
            )}
            <Typography><strong>Connections:</strong> {connectionsCount}</Typography>
          </CardContent>
        </Card>
        
        )}

        <Box mt={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Card onClick={() => navigate('/skillProfile')} sx={{ cursor: 'pointer' }}>
                    <CardContent>
                    <Typography variant="h6">Skill Profile</Typography>
                    <Typography>View and edit your skill profile</Typography>
                    </CardContent>
                </Card>
            </Grid>


            <Grid item xs={12} sm={4}>
            <Card onClick={() => navigate('/connections')} sx={{ cursor: 'pointer' }}>
                <CardContent>
                <Typography variant="h6">Connections</Typography>
                <Typography>View your matches and requests</Typography>
                </CardContent>
            </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card onClick={() => navigate('/chatRooms')} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant="h6">Messages</Typography>
                  <Typography>Open your chat rooms</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
