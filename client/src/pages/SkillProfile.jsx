import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Container,
  Card,
  CardContent,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import FadeLoader from '../components/FadeLoader';

const SkillProfile = () => {
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [bio, setBio] = useState('')
  const [teachInput, setTeachInput] = useState('');
  const [learnInput, setLearnInput] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [pendingSkill, setPendingSkill] = useState('');
  const [pendingType, setPendingType] = useState('teach');
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const profileRes = await axios.get('http://localhost:5000/api/skillProfile/me', {
          headers: { Authorization: `${token}` }
        });
        console.log(profileRes);
        if (profileRes.data.profile) {
          console.log(profileRes.data.profile.skillsToTeach);
          setSkillsToTeach(profileRes.data.profile.skillsToTeach || []);
          setSkillsToLearn(profileRes.data.profile.skillsToLearn || []);
          setBio(profileRes.data.profile.bio || '');
        }

        const skillRes = await axios.get('http://localhost:5000/api/skill');
        setAllSkills(skillRes.data.skills);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    console.log(skillsToLearn);
    console.log(skillsToTeach);
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/skillProfile/update', {
        skillsToTeach: skillsToTeach,
        skillsToLearn: skillsToLearn,
        bio: bio,
      }, {
        headers: { Authorization: `${token}` }
      });
      setError("");
      setSuccess('Profile updated!');
    } catch (err) {
      setSuccess("");
      setError('Failed to update profile.');
    }
  };

  
  const handleDeleteSkill = async (skillId, type) => {
    if (type === 'teach') {
      setSkillsToTeach(skillsToTeach.filter(skill => skill._id !== skillId));
    } else if (type === 'learn') {
      setSkillsToLearn(skillsToLearn.filter(skill => skill._id !== skillId));
    }
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/skillProfile/update', {
        skillsToTeach: skillsToTeach,
        skillsToLearn: skillsToLearn,
        bio: bio,
      }, {
        headers: { Authorization: `${token}` }
      })
  }catch (err) {
    setSuccess("");
    setError('Failed to update profile.');
  }};

  const requestAddSkill = (value, type) => {
    setPendingSkill(value);
    setPendingType(type);
    setOpenDialog(true);
  };

  const confirmAddSkill = () => {
    navigate('/addSkill', { state: { value: pendingSkill, type: pendingType } });
  };
  

  return (
    <Container maxWidth="md">
      {loading ? <FadeLoader /> : (
        <Box my={4}>
          <Typography variant="h4" gutterBottom>Your Skill Profile</Typography>

          {/* Teach Section */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Skills You Can Teach</Typography>
              <Autocomplete
                options={allSkills}
                getOptionLabel={(option) => option.name}
                value={skillsToTeach.find(s => s._id === teachInput) || null}
                onChange={(e, value) => {
                  if (value && !skillsToTeach.includes(value)) {
                    if (allSkills.includes(value)) {
                      setSkillsToTeach([...skillsToTeach, value]);
                    } else {
                      requestAddSkill(value, 'teach');
                    }
                  }
                  setTeachInput(value ? value._id : '');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select skill to teach" fullWidth />
                )}
              />
              <Box mt={2}>
              {skillsToTeach.map(skill => (
                <Chip
                  key={skill._id}
                  label={skill.name}
                  onDelete={() => handleDeleteSkill(skill._id, 'teach')}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
              </Box>
            </CardContent>
          </Card>

          {/* Learn Section */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Skills You Want to Learn</Typography>
              <Autocomplete
                options={allSkills}
                getOptionLabel={(option) => option.name}
                value={skillsToLearn.find(s => s._id === learnInput) || null}
                onChange={(e, value) => {
                  if (value && !skillsToLearn.includes(value)) {
                    console.log(value);
                    if (allSkills.includes(value)) {
                      setSkillsToLearn([...skillsToLearn, value]);
                    } else {
                      requestAddSkill(value, 'learn');
                    }
                  }
                  setLearnInput(value ? value._id : '');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select skill to learn" fullWidth />
                )}
              />
              <Box mt={2}>
              {skillsToLearn.map(skill => (
                <Chip
                  key={skill._id}
                  label={skill.name}
                  onDelete={() => handleDeleteSkill(skill._id, 'learn')}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Your Bio</Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Write a short summary about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </CardContent>
          </Card>

          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {success && <Typography color="primary" sx={{ mb: 2 }}>{success}</Typography>}

          <Button variant="contained" onClick={handleSubmit}>Save Profile</Button>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>New Skill</DialogTitle>
          <DialogContent>
            <DialogContentText>
              The skill "{pendingSkill}" doesn't exist. Do you want to add it?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={confirmAddSkill} variant="contained">Add Skill</Button>
          </DialogActions>
        </Dialog>
        </Box>
      )}
    </Container>
  );
};

export default SkillProfile;
