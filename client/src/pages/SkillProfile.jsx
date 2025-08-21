import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, Button, Chip, Container,
  Card, CardContent, Autocomplete, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";
import FadeLoader from '../components/FadeLoader';
import { useNavigate } from 'react-router-dom';

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
});

const SkillProfile = () => {
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [bio, setBio] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingSkill, setPendingSkill] = useState('');
  const [pendingType, setPendingType] = useState('teach');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, section: '' });

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get('https://skillmatch-backend-cwdm.onrender.com/api/skillProfile/me', {
          headers: { Authorization: token }
        });
        const skillRes = await axios.get('https://skillmatch-backend-cwdm.onrender.com/api/skill');
        const profile = profileRes.data.profile;

        setSkillsToTeach(profile.skillsToTeach || []);
        setSkillsToLearn(profile.skillsToLearn || []);
        setBio(profile.bio || '');
        setAllSkills(skillRes.data.skills || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put('https://skillmatch-backend-cwdm.onrender.com/api/skillProfile/update', {
        skillsToTeach,
        skillsToLearn,
        bio
      }, {
        headers: { Authorization: token }
      });
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError('Failed to update profile.');
      setSuccess('');
    }
  };

  const handleDeleteSkill = (id, type) => {
    if (type === 'teach') {
      setSkillsToTeach(skillsToTeach.filter(skill => skill._id !== id));
    } else {
      setSkillsToLearn(skillsToLearn.filter(skill => skill._id !== id));
    }
  };

  const requestAddSkill = (value, type) => {
    setPendingSkill(value);
    setPendingType(type);
    setOpenDialog(true);
  };

  const confirmAddSkill = () => {
    navigate('/addSkill', { state: { value: pendingSkill, type: pendingType } });
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
          color: "white",
          py: 8,
          transition: 'filter 0.3s ease',
          filter: editDialog.open ? 'blur(5px)' : 'none',
        }}
      >
        <Container maxWidth="md">
          {loading ? <FadeLoader /> : (
            <motion.div variants={fadeIn(0.3)} initial="hidden" animate="visible">
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
                Your <span style={{ color: "#4caf50" }}>Skill Profile</span>
              </Typography>

              {/* TEACH */}
              <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)", mb: 4 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "white",
                mr: 2,
              }}
            >
              Your skills:
            </Typography>
                    <IconButton onClick={() => setEditDialog({ open: true, section: 'teach' })}>
                      <EditIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Box>
                  <Box mt={2}>
                    {skillsToTeach.map(skill => (
                      <Chip
                        key={skill._id}
                        label={skill.name}
                        onDelete={() => handleDeleteSkill(skill._id, 'teach')}
                        sx={{ mr: 1, mb: 1, bgcolor: "#4caf50", color: "white" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* LEARN */}
              <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)", mb: 4 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "white",
                mr: 2,
              }}
            >
              Skills you want to learn:
            </Typography>
                    <IconButton onClick={() => setEditDialog({ open: true, section: 'learn' })}>
                      <EditIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Box>
                  <Box mt={2}>
                    {skillsToLearn.map(skill => (
                      <Chip
                        key={skill._id}
                        label={skill.name}
                        onDelete={() => handleDeleteSkill(skill._id, 'learn')}
                        sx={{ mr: 1, mb: 1, bgcolor: "#2196f3", color: "white" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* BIO */}
              <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)", mb: 4 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "white",
                mr: 2,
              }}
            >
              Your bio:
            </Typography>
                    <IconButton onClick={() => setEditDialog({ open: true, section: 'bio' })}>
                      <EditIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Box>
                  <Typography sx={{
                fontWeight: 300,
                color: "white",
                mr: 2,
              }}>{bio || "No bio provided yet."}</Typography>
                </CardContent>
              </Card>

              {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
              {success && <Typography color="success.main" sx={{ mb: 2 }}>{success}</Typography>}

              <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#4caf50" }}>
                Save Profile
              </Button>
            </motion.div>
          )}
        </Container>
      </Box>

      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, section: '' })}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #e0f7fa 100%)",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#0A1172" }}>
          Edit {editDialog.section === 'bio' ? 'Bio' : `Skills to ${editDialog.section === 'teach' ? 'Teach' : 'Learn'}`}
        </DialogTitle>

        <DialogContent>
          {editDialog.section === 'bio' ? (
            <TextField
              fullWidth
              multiline
              minRows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              sx={{ mt: 2 }}
            />
          ) : (
            <Autocomplete
              options={allSkills}
              getOptionLabel={(option) => option.name}
              onChange={(e, value) => {
                if (value && !(editDialog.section === 'teach' ? skillsToTeach : skillsToLearn).some(s => s._id === value._id)) {
                  if (allSkills.includes(value)) {
                    if (editDialog.section === 'teach') {
                      setSkillsToTeach([...skillsToTeach, value]);
                    } else {
                      setSkillsToLearn([...skillsToLearn, value]);
                    }
                  } else {
                    requestAddSkill(value, editDialog.section);
                  }
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Add skill" fullWidth sx={{ mt: 2 }} />
              )}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3 }}>
          <Button onClick={() => setEditDialog({ open: false, section: '' })} sx={{ color: "#0A1172" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: "#4CAF50",
              color: "#fff",
              '&:hover': {
                backgroundColor: '#45a045',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* SKILL ADD DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>New Skill</DialogTitle>
        <DialogContent>
          This skill "{pendingSkill}" doesn't exist. Do you want to add it?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmAddSkill}>Add Skill</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SkillProfile;
