import { Box, Button, Typography, Fade } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Fade in timeout={1000}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            background: 'linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            px: 2,
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            }}
          >
            <span style={{ color: 'white' }}>skill</span>
            <span style={{ color: "#4AFA7B" }}>Match</span>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 2,
              mb: 3,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
            }}
          >
            connect. learn. evolve.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: '600px',
              mb: 5,
              px: 2,
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            SkillMatch is a peer-to-peer learning platform that connects people who want to teach and learn new skills. Build your profile, find your match, and grow together.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                backgroundColor: '#001F5C',
                color: 'white',
                px: 5,
                py: 1.8,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#003380',
                },
              }}
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: '#001F5C',
                color: 'white',
                px: 5,
                py: 1.8,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#003380',
                },
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default Home;
