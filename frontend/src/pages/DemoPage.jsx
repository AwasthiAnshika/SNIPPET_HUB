import { useState } from 'react'
import { 
  Container, Box, Typography, Chip, Grid, TextField, Button, 
  Card, CardContent, CardActions, IconButton, Tooltip, AppBar, 
  Toolbar, Link as MuiLink 
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LoginIcon from '@mui/icons-material/Login'

const demoSnippets = [
  {
    _id: '1',
    title: 'JavaScript Array Sort',
    description: 'Sort an array of numbers in ascending order',
    language: 'javascript',
    tags: ['array', 'sort', 'utils'],
    code: `const arr = [3, 1, 4, 1, 5, 9, 2, 6];
const sorted = arr.sort((a, b) => a - b);
console.log(sorted); // [1, 1, 2, 3, 4, 5, 6, 9]`,
    avgRating: 4.5,
    ratingCount: 12
  },
  {
    _id: '2',
    title: 'Python List Comprehension',
    description: 'Create a new list by filtering and transforming',
    language: 'python',
    tags: ['python', 'list', 'functional'],
    code: `numbers = [1, 2, 3, 4, 5, 6]
squared = [x**2 for x in numbers if x % 2 == 0]
print(squared)  # [4, 16, 36]`,
    avgRating: 4.8,
    ratingCount: 18
  },
  {
    _id: '3',
    title: 'React useState Hook',
    description: 'Manage component state with the useState hook',
    language: 'javascript',
    tags: ['react', 'hooks', 'state'],
    code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
    avgRating: 5.0,
    ratingCount: 45
  },
  {
    _id: '4',
    title: 'Go HTTP Server',
    description: 'Simple HTTP server in Go',
    language: 'go',
    tags: ['go', 'http', 'server'],
    code: `package main
import (
  "fmt"
  "net/http"
)
func hello(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "Hello, World!")
}
func main() {
  http.HandleFunc("/", hello)
  http.ListenAndServe(":8080", nil)
}`,
    avgRating: 4.3,
    ratingCount: 8
  }
]

function SnippetCard({ snippet, isLoggedIn }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [rating, setRating] = useState(null)

  return (
    <Card sx={{ mb: 2, boxShadow: 1, '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{snippet.title}</Typography>
        <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
          📌 {snippet.language.toUpperCase()} • {snippet.tags.join(', ')}
        </Typography>
        <Box component="pre" sx={{ 
          backgroundColor: '#f6f8fa', 
          p: 1.5, 
          mt: 1.5, 
          maxHeight: 180, 
          overflow: 'auto',
          fontSize: '0.85rem',
          borderRadius: 1,
          border: '1px solid #e1e4e8'
        }}>
          {snippet.code.split('\n').slice(0, 12).join('\n')}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
          <StarIcon sx={{ fontSize: 18, color: '#ffc107', mr: 0.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {snippet.avgRating.toFixed(1)} ({snippet.ratingCount} ratings)
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined">View Full</Button>
        {isLoggedIn ? (
          <>
            <Tooltip title={isFavorited ? "Remove Favorite" : "Add Favorite"}>
              <IconButton 
                size="small" 
                onClick={() => setIsFavorited(!isFavorited)}
                sx={{ color: isFavorited ? '#e91e63' : 'inherit' }}
              >
                {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Rate this snippet">
              <IconButton 
                size="small"
                onClick={() => setRating(rating === 5 ? null : 5)}
                sx={{ color: rating ? '#ffc107' : 'inherit' }}
              >
                {rating ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Typography variant="caption" sx={{ ml: 1, color: '#999' }}>
            Login to rate & favorite
          </Typography>
        )}
      </CardActions>
    </Card>
  )
}

export default function DemoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSnippets = demoSnippets.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.includes(searchQuery.toLowerCase()))
  )

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
            startIcon={<LoginIcon />}
            onClick={() => setIsLoggedIn(!isLoggedIn)}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
            Intelligent Code Snippet Search
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip label="React.js" color="primary" variant="outlined" />
            <Chip label="Node.js" color="primary" variant="outlined" />
            <Chip label="Express.js" color="primary" variant="outlined" />
            <Chip label="MongoDB" color="primary" variant="outlined" />
            <Chip label="OpenAI API" color="primary" variant="outlined" />
          </Box>
          <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
            A production-ready web application for searching and managing code snippets with AI-powered suggestions.
          </Typography>
        </Box>

        {/* Features Section */}
        <Box sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>✨ Key Features</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>🔍 Search</Typography>
                <Typography variant="caption">Search 100+ snippets across 9+ languages</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>⭐ Rate</Typography>
                <Typography variant="caption">Rate snippets 1-5 stars (logged-in users)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>❤️ Favorite</Typography>
                <Typography variant="caption">Save favorite snippets for quick access</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>🤖 AI Suggestions</Typography>
                <Typography variant="caption">OpenAI-powered query refinement</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Search & Results */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Search Bar */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search by language, tag or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                variant="outlined"
                sx={{ backgroundColor: 'white' }}
              />
              <Button variant="contained" sx={{ px: 3 }}>
                Search
              </Button>
            </Box>

            {/* Snippet Cards */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
                {filteredSnippets.length} snippets found
              </Typography>
              {filteredSnippets.length > 0 ? (
                filteredSnippets.map(snippet => (
                  <SnippetCard 
                    key={snippet._id} 
                    snippet={snippet} 
                    isLoggedIn={isLoggedIn}
                  />
                ))
              ) : (
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    No snippets match your search. Try another query!
                  </Typography>
                </Card>
              )}
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* AI Suggestions Card */}
            <Card sx={{ mb: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🤖 AI Suggestions
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                  Get OpenAI-powered suggestions to refine your search and find the best snippets.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="small"
                  onClick={() => alert('OpenAI API integration enabled!')}
                >
                  Get Smart Suggestions
                </Button>
              </CardContent>
            </Card>

            {/* Tech Stack Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🛠️ Tech Stack
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption"><strong>Frontend:</strong> React, Vite, MUI</Typography>
                  <Typography variant="caption"><strong>Backend:</strong> Node.js, Express, MongoDB</Typography>
                  <Typography variant="caption"><strong>Cache:</strong> Redis</Typography>
                  <Typography variant="caption"><strong>Auth:</strong> JWT + bcrypt</Typography>
                  <Typography variant="caption"><strong>AI:</strong> OpenAI API</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Login Status Card */}
            <Card sx={{ backgroundColor: isLoggedIn ? '#e8f5e9' : '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {isLoggedIn ? '✅ Logged In' : '🔒 Not Logged In'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                  {isLoggedIn 
                    ? 'You can now rate and favorite snippets!' 
                    : 'Login to unlock rating and favorites features'
                  }
                </Typography>
                <Button 
                  size="small" 
                  variant={isLoggedIn ? 'outlined' : 'contained'}
                  onClick={() => setIsLoggedIn(!isLoggedIn)}
                >
                  {isLoggedIn ? 'Logout' : 'Login / Register'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #eee', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#999' }}>
            Demo page • Backend running on http://localhost:4000 • Frontend on http://localhost:5173
          </Typography>
        </Box>
      </Container>
    </>
  )
}
