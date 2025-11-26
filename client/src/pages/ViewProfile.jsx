import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Chip, Container,
  Card, CardContent
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";
import FadeLoader from '../components/FadeLoader';
import { useParams } from 'react-router-dom';

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
});

const ViewProfile = () => {
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileRes = await axios.get(
        `https://skillmatch-backend-cwdm.onrender.com/api/skillProfile/user/${userId}`,
        { headers: { Authorization: token } }
        );
        const profile = profileRes.data.profile;
        console.log(profileRes.data);
        setSkillsToTeach(profile.skillsToTeach || []);
        setSkillsToLearn(profile.skillsToLearn || []);
        setBio(profile.bio || '');
        setUserName(profileRes.data.profile.user.name || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [userId]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          {loading ? <FadeLoader /> : (
            <motion.div variants={fadeIn(0.3)} initial="hidden" animate="visible">
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
                {userName ? `${userName} ` : ''}<span style={{ color: "#4caf50" }}>Skill Profile</span>
              </Typography>

              {/* TEACH */}
              <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)", mb: 4 }}>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "white", mr: 2 }}
                  >
                    Skills they can teach:
                  </Typography>
                  <Box mt={2}>
                    {skillsToTeach.map(skill => (
                      <Chip
                        key={skill._id}
                        label={skill.name}
                        sx={{ mr: 1, mb: 1, bgcolor: "#4caf50", color: "white" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* LEARN */}
              <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)", mb: 4 }}>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "white", mr: 2 }}
                  >
                    Skills they want to learn:
                  </Typography>
                  <Box mt={2}>
                    {skillsToLearn.map(skill => (
                      <Chip
                        key={skill._id}
                        label={skill.name}
                        sx={{ mr: 1, mb: 1, bgcolor: "#2196f3", color: "white" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* BIO */}
              <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)", mb: 4 }}>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "white", mr: 2 }}
                  >
                    Bio:
                  </Typography>
                  <Typography sx={{ fontWeight: 300, color: "white", mr: 2 }}>
                    {bio || "No bio provided yet."}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ViewProfile; 