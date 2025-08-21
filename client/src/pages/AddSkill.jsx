import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Autocomplete
} from '@mui/material';

const AddSkill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { value = '', type = 'teach' } = location.state || {};

  const [skillName, setSkillName] = useState(value);
  const [category, setCategory] = useState('general');
  const [error, setError] = useState("");

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('https://skillmatch-backend-cwdm.onrender.com/api/skill/add', {
        name: skillName,
        category
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError("");
      navigate('/dashboard'); // or wherever SkillProfile is mounted
    } catch (err) {
      setError('Failed to add skill.');
    }
  };

  const categories = [
    'Programming', 'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing',
    'Design', 'UI/UX', 'Marketing', 'Finance', 'Business',
    'Language', 'Communication', 'Soft Skills', 'Music', 'Art',
    'Photography', 'Writing', 'Project Management', 'Cybersecurity',
    'Game Development', 'Engineering', 'Healthcare', 'Education',
    'Legal', 'Sports', 'Cooking', 'Miscellaneous', 'Other'
  ];
  

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Add New Skill</Typography>
            <TextField
              label="Skill Name"
              fullWidth
              margin="normal"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
            <Autocomplete
            options={categories}
            value={category}
            onChange={(e, newValue) => setCategory(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Category" />}
            fullWidth
            />
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Add Skill
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AddSkill;
