import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  Grid,
  Divider,
  Button
} from '@mui/material';
import axios from 'axios';
import FadeLoader from '../components/FadeLoader';

const Match = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `${token}` };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/match', {
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Skill Match Suggestions
      </Typography>

      {loading ? (
        <FadeLoader />
      ) : matches.length === 0 ? (
        <Box mt={4} textAlign="center">
          <Typography variant="body1">No matches found yet. Try updating your skill profile.</Typography>
          <Button variant="contained" color="primary" href="/profile" sx={{ mt: 2 }}>
            Go to Profile
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {matches.map((match) => (
            <Grid item xs={12} sm={6} md={4} key={match.user._id}>
              <Card sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{match.user.name}</Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Match Score: <strong>{match.matchPercentage}</strong>
                    </Typography>

                    <Box sx={{ maxHeight: 60, overflowY: 'auto', mb: 1 }}>
                    <Typography variant="body2">You can learn from them:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {match.canLearnFromThem.map(skill => (
                        <Chip key={skill._id} label={skill.name} size="small" color="primary" />
                        ))}
                    </Box>
                    </Box>

                    <Box sx={{ maxHeight: 60, overflowY: 'auto', mb: 2 }}>
                    <Typography variant="body2">You can teach them:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {match.canTeachThem && match.canTeachThem.length > 0 ? (
                            match.canTeachThem.map(skill => (
                            <Chip key={skill._id} label={skill.name} size="small" sx={{ backgroundColor: 'green', color: 'white' }} />
                            ))
                        ) : (
                            <Typography variant="caption">No skills to teach them.</Typography>
                        )}
                    </Box>
                    </Box>
                </CardContent>

                <Box sx={{ px: 2, pb: 2 }}>
                    <Button variant="outlined" fullWidth>
                    Send Connection Request
                    </Button>
                </Box>
                </Card>

            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Match;
