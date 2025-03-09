import { useState } from 'react';
import { Container, TextField, Typography,Box, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import './App.css'
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try{
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));  
    }catch(error){
      setError('Failed to generate reply. Something went wrong. Please try again later.');
      console.error(error);
    }finally{
      setLoading(false);
    }
  }
  return (
    <Container maxWidth="sm" sx={{py:4}}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator 
      </Typography>
      <Box sx={{mt: 3}}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{mb: 2}}
          />
        <FormControl fullWidth sx={{mb: 2}}>
          <InputLabel>
            Tone (Optional)
          </InputLabel>
          <Select
            value={tone || ''}
            label={"Tone (Optional)"}
            onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="aggrasive">Aggressive</MenuItem>
              <MenuItem value="sarcastic">Sarcastic</MenuItem>
            </Select>
        </FormControl>
        <Button
        
          variant='contained'
          color='primary'
          disabled={!emailContent || loading}
          onClick={handleSubmit}
          fullWidth
          >
          {!loading ?"Generate Reply": <CircularProgress size={24}/>}
        </Button>
      </Box>

      {error && (
        <Typography  color='error' sx={{mt: 2}}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{mt: 3}}>
          <Typography variant='h6' component='h2' gutterBottom>
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={generatedReply}
            disabled
            />
          <Button
            variant='contained'
            color='primary'
            fullWidth
            sx={{mt: 2}}
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >Copy to Clipboard</Button>
        </Box>
      )}
    </Container>
  )
}

export default App
