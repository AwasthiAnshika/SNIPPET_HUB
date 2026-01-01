import { useState } from 'react'
import { 
  Container, TextField, Button, Box, Typography, Card, CardContent, 
  AppBar, Toolbar, Alert, CircularProgress, Grid, Chip
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAuth } from '../state/auth.jsx'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(){
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const doLogin = async ()=>{ 
    try {
      setError(null);
      setLoading(true);
      await login(email, password); 
      navigate('/'); 
    } catch(e){
      setError('Login error: ' + (e.response?.data?.error?.message || e.message));
    } finally { setLoading(false); }
  }

  const doRegister = async ()=>{ 
    try {
      setError(null);
      setLoading(true);
      await register('User', email, password); 
      navigate('/'); 
    } catch(e){
      setError('Register error: ' + (e.response?.data?.error?.message || e.message));
    } finally { setLoading(false); }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      isRegister ? doRegister() : doLogin();
    }
  }

  return (
    <>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            💻 Code Snippet Search with AI
          </Typography>
          <Button 
            color="inherit" 
            size="small"
            onClick={() => navigate('/')}
          >
            🏠 Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 6, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
            ✅ Welcome Back!
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', mb: 3 }}>
            {isRegister 
              ? 'Create a new account to start saving and rating code snippets.' 
              : 'Login to access your favorite code snippets and personalized recommendations.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip label="🔐 Secure Login" color="primary" variant="outlined" />
            <Chip label="⭐ Rate Snippets" color="primary" variant="outlined" />
            <Chip label="❤️ Save Favorites" color="primary" variant="outlined" />
          </Box>
        </Box>

        {/* Main Card */}
        <Card sx={{ boxShadow: 3, mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Form Title */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: '#1976d2' }}>
              {isRegister ? '📝 Create Account' : '🔐 Login'}
            </Typography>

            {/* Form Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="📧 Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                variant="outlined"
                placeholder="you@example.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="🔑 Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                variant="outlined"
                placeholder="••••••••"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />

              {/* Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={isRegister ? doRegister : doLogin}
                  disabled={loading || !email || !password}
                  startIcon={loading ? <CircularProgress size={20} /> : (isRegister ? <PersonAddIcon /> : <LoginIcon />)}
                  sx={{
                    backgroundColor: '#1976d2',
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Login')}
                </Button>
              </Box>

              {/* Toggle Button */}
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError(null);
                  }}
                  disabled={loading}
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                  }}
                >
                  {isRegister ? 'Login instead' : 'Register here'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: '#e3f2fd', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                  🔍 Search
                </Typography>
                <Typography variant="caption" sx={{ color: '#555' }}>
                  Full-text search across 100+ code snippets in 9+ languages
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: '#f3e5f5', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#7b1fa2', mb: 1 }}>
                  ⭐ Rate & Save
                </Typography>
                <Typography variant="caption" sx={{ color: '#555' }}>
                  Rate snippets and save your favorites to access later
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: '#fce4ec', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#c2185b', mb: 1 }}>
                  ❤️ Favorites
                </Typography>
                <Typography variant="caption" sx={{ color: '#555' }}>
                  Manage all your favorite snippets in one place
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: '#fff3e0', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f57c00', mb: 1 }}>
                  🤖 AI Powered
                </Typography>
                <Typography variant="caption" sx={{ color: '#555' }}>
                  Get OpenAI-powered suggestions for better search results
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Demo Credentials */}
        <Card sx={{ mt: 4, backgroundColor: '#f5f5f5', boxShadow: 0 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}>
              💡 Demo Credentials
            </Typography>
            <Box sx={{ backgroundColor: '#fff', p: 2, borderRadius: 1, border: '1px solid #ddd' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontFamily: 'monospace' }}>
                <strong>Email:</strong> demo@example.com
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace' }}>
                <strong>Password:</strong> demo123
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1.5 }}>
              Or create a new account to get started!
            </Typography>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 6, pt: 3, textAlign: 'center', borderTop: '1px solid #eee' }}>
          <Typography variant="caption" sx={{ color: '#999' }}>
            💻 Backend: http://localhost:4000 | 🎨 Frontend: http://localhost:5173
          </Typography>
        </Box>
      </Container>
    </>
  )
}
