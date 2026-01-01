import { useEffect, useState } from 'react'
import { 
  Container, Box, Typography, Chip, Grid, TextField, Button, 
  Card, CardContent, CardActions, IconButton, Tooltip, AppBar, 
  Toolbar, CircularProgress, Alert, Pagination, Dialog, DialogTitle, 
  DialogContent, DialogActions
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LoginIcon from '@mui/icons-material/Login'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import axios from 'axios'
import { useAuth } from '../state/auth.jsx'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

function SnippetCard({ snippet, isLoggedIn, onRefresh }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [userRating, setUserRating] = useState(null)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ratingLoaded, setRatingLoaded] = useState(false)

  // Fetch user's existing rating
  const fetchUserRating = async () => {
    if (!isLoggedIn) return
    try {
      const res = await axios.get(`${API}/snippets/${snippet._id}/rating`)
      setUserRating(res.data.rating)
    } catch (err) {
      console.error('Error fetching rating:', err)
    } finally {
      setRatingLoaded(true)
    }
  }

  // Load rating on mount
  useEffect(() => {
    fetchUserRating()
  }, [isLoggedIn, snippet._id])

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  //favorite working
  const handleFavorite = async () => {
    if (!isLoggedIn) {
      alert('Please login to favorite')
      return
    }
    try {
      setLoading(true)
      if (isFavorited) {
        await axios.delete(`${API}/snippets/${snippet._id}/favorite`)
      } else {
        await axios.post(`${API}/snippets/${snippet._id}/favorite`)
      }
      setIsFavorited(!isFavorited)
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRate = async (value) => {
    if (!isLoggedIn) {
      alert('Please login to rate')
      return
    }
    if (userRating !== null) {
      alert('You have already rated this snippet. Your rating: ' + userRating + ' stars')
      return
    }
    try {
      setLoading(true)
      await axios.post(`${API}/snippets/${snippet._id}/rate`, { value })
      setUserRating(value)
      onRefresh()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card sx={{ mb: 2, boxShadow: 1, '&:hover': { boxShadow: 3 } }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{snippet.title}</Typography>
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
            📌 {(snippet.lang || 'unknown').toUpperCase()} • {(snippet.tags || []).join(', ') || 'N/A'}
          </Typography>
          <Box sx={{ position: 'relative', mt: 1.5 }}>
            <Box component="pre" sx={{ 
              backgroundColor: '#f6f8fa', 
              p: 1.5, 
              maxHeight: 180, 
              overflow: 'auto',
              fontSize: '0.85rem',
              borderRadius: 1,
              border: '1px solid #e1e4e8'
            }}>
              {((snippet.code || '').split('\n').slice(0, 12).join('\n'))}
            </Box>
            <Tooltip title="Copy code">
              <IconButton
                size="small"
                onClick={() => copyToClipboard(snippet.code)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(25, 118, 210, 0.9)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 1)' }
                }}
              >
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {copied && (
              <Typography variant="caption" sx={{ position: 'absolute', top: 8, right: 40, color: '#4caf50', fontWeight: 600 }}>
                ✓ Copied!
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ fontSize: 18, color: '#ffc107', mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {((snippet.avgRating || 0).toFixed(1))} ({snippet.ratingCount || 0} ratings)
              </Typography>
            </Box>
            {isLoggedIn && userRating !== null && (
              <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
                ✓ Your rating: {userRating}★
              </Typography>
            )}
          </Box>
        </CardContent>
        <CardActions sx={{ pt: 1, pb: 1.5 }}>
          <Button size="small" variant="outlined" onClick={() => setOpenDialog(true)}>View Full</Button>
          
          {/* Favorite Button */}
          {isLoggedIn && (
            <Tooltip title={isFavorited ? "Remove Favorite" : "Add Favorite"}>
              <IconButton 
                size="small" 
                onClick={handleFavorite}
                disabled={loading}
                sx={{ color: isFavorited ? '#e91e63' : 'inherit' }}
              >
                {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
          )}

          {/* 5-Star Rating */}
          {isLoggedIn ? (
            <Box 
              sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}
              onMouseLeave={() => setHoverRating(0)}
            >
              {userRating === null ? (
                <>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Tooltip key={star} title={`Rate ${star} star${star > 1 ? 's' : ''}`}>
                      <IconButton
                        size="small"
                        onClick={() => handleRate(star)}
                        disabled={loading || userRating !== null}
                        onMouseEnter={() => setHoverRating(star)}
                        sx={{
                          p: 0.5,
                          color: star <= (hoverRating || 0) ? '#ffc107' : '#bdbdbd'
                        }}
                      >
                        <StarIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  ))}
                </>
              ) : (
                <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>
                  Already rated
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="caption" sx={{ ml: 'auto', color: '#999' }}>
              Login to rate
            </Typography>
          )}
        </CardActions>
      </Card>

      {/* Full Code Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, backgroundColor: '#1976d2', color: 'white' }}>
          {snippet.title}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 2 }}>
            📌 {(snippet.lang || 'unknown').toUpperCase()} • {(snippet.tags || []).join(', ') || 'N/A'}
          </Typography>
          <Box sx={{ position: 'relative', backgroundColor: '#f6f8fa', borderRadius: 1, border: '1px solid #e1e4e8' }}>
            <Box component="pre" sx={{
              p: 2,
              overflow: 'auto',
              maxHeight: 400,
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              m: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {snippet.code || 'No code available'}
            </Box>
            <Tooltip title={copied ? "Copied!" : "Copy full code"}>
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboard(snippet.code)}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: '#1976d2'
                }}
                size="small"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <StarIcon sx={{ fontSize: 18, color: '#ffc107', mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {((snippet.avgRating || 0).toFixed(1))} ({snippet.ratingCount || 0} ratings)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default function SearchPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  const limit = 20

  const search = async (pageNum = 1) => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`${API}/snippets`, { params: { q, limit, page: pageNum } })
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
      setPage(pageNum)
    } catch (err) {
      setError('Failed to load snippets: ' + (err.response?.data?.error?.message || err.message))
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAISuggestions = async () => {
    try {
      setAiLoading(true)
      setAiError(null)
      const snippetIds = items.slice(0, 5).map(s => s._id)
      const res = await axios.post(`${API}/ai/suggest`, { 
        query: q || 'javascript code patterns',
        topSnippetIds: snippetIds
      })
      setAiSuggestions(res.data.suggestions)
    } catch (err) {
      setAiError('Failed to get AI suggestions: ' + (err.response?.data?.error?.message || err.message))
      console.error('AI error:', err)
    } finally {
      setAiLoading(false)
    }
  }

  const applySuggestion = (suggestionQuery) => {
    setQ(suggestionQuery)
    setAiSuggestions(null)
    // Will trigger search via the search button
  }

  useEffect(() => {
    search(1)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            💻 Code Snippet Search with AI
          </Typography>
          {user ? (
            <>
              <Typography variant="body2" sx={{ mr: 2 }}>👤 {user.email}</Typography>
              <Button 
                color="inherit" 
                size="small"
                onClick={() => navigate('/favorites')}
                sx={{ mr: 1 }}
              >
                ❤️ Favorites
              </Button>
              <Button 
                color="inherit" 
                size="small"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              color="inherit" 
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
            ✅ Intelligent Code Snippet Search
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip label="React.js" color="primary" variant="outlined" />
            <Chip label="Node.js" color="primary" variant="outlined" />
            <Chip label="Express.js" color="primary" variant="outlined" />
            <Chip label="MongoDB" color="primary" variant="outlined" />
            <Chip label="OpenAI API" color="primary" variant="outlined" />
          </Box>
          <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
            Search 100+ code snippets across 9+ languages with real-time filtering and AI-powered suggestions.
          </Typography>
        </Box>

        {/* Features Section */}
        <Box sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>✨ Features</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>🔍 Search</Typography>
                <Typography variant="caption">Full-text search across snippets</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>⭐ Rate</Typography>
                <Typography variant="caption">1-5 star ratings (requires login)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>❤️ Favorite</Typography>
                <Typography variant="caption">Save favorites to your profile</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>🤖 AI</Typography>
                <Typography variant="caption">OpenAI query suggestions</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Search Bar */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search snippets..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && search(1)}
                size="small"
                variant="outlined"
                sx={{ backgroundColor: 'white' }}
              />
              <Button 
                variant="contained" 
                onClick={() => search(1)}
                disabled={loading}
                sx={{ px: 3 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Box>

            {/* Error Alert */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Results */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
                {loading ? '⏳ Loading...' : `📌 ${total} snippets found (Page ${page} of ${Math.ceil(total / limit)})`}
              </Typography>
              {items.length > 0 ? (
                <>
                  {items.map(snippet => (
                    <SnippetCard 
                      key={snippet._id} 
                      snippet={snippet} 
                      isLoggedIn={!!user}
                      onRefresh={() => search(page)}
                    />
                  ))}
                  
                  {/* Pagination */}
                  {Math.ceil(total / limit) > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination 
                        count={Math.ceil(total / limit)}
                        page={page}
                        onChange={(e, newPage) => search(newPage)}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  )}
                </>
              ) : !loading && (
                <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#fafafa' }}>
                  <Typography color="textSecondary">
                    📭 No snippets found. Try a different search!
                  </Typography>
                </Card>
              )}
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* AI Card */}
            <Card sx={{ mb: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🤖 AI Suggestions
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                  {aiSuggestions ? 'Smart suggestions based on your search' : 'Get OpenAI-powered suggestions to improve your search.'}
                </Typography>
                
                {aiError && (
                  <Alert severity="error" sx={{ mb: 2, fontSize: '0.85rem' }}>
                    {aiError}
                  </Alert>
                )}

                {aiSuggestions ? (
                  <Box>
                    {/* Suggested Queries */}
                    {aiSuggestions.queries && Array.isArray(aiSuggestions.queries) && aiSuggestions.queries.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2', display: 'block', mb: 1 }}>
                          Try these searches:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                          {aiSuggestions.queries.slice(0, 5).map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outlined"
                              size="small"
                              fullWidth
                              onClick={() => {
                                applySuggestion(suggestion)
                                search(1)
                              }}
                              sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                borderColor: '#e0e0e0',
                                color: '#333',
                                '&:hover': {
                                  borderColor: '#1976d2',
                                  backgroundColor: '#f5f5f5'
                                }
                              }}
                            >
                              💡 {suggestion}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Best Match */}
                    {aiSuggestions.bestSnippetId && (
                      <Box sx={{ backgroundColor: '#f0f4ff', p: 1.5, borderRadius: 1, mb: 2, borderLeft: '4px solid #1976d2' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2', display: 'block', mb: 0.5 }}>
                          ⭐ Best Match for "{q}"
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#555', display: 'block' }}>
                          {aiSuggestions.reason || 'This snippet appears most relevant to your query.'}
                        </Typography>
                      </Box>
                    )}

                    {/* Next Steps */}
                    {aiSuggestions.nextSteps && (
                      <Box sx={{ backgroundColor: '#f9f9f9', p: 1.5, borderRadius: 1, borderLeft: '4px solid #4caf50' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4caf50', display: 'block', mb: 0.5 }}>
                          💡 Next Steps
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#555', display: 'block' }}>
                          {aiSuggestions.nextSteps}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="text"
                      size="small"
                      fullWidth
                      onClick={() => setAiSuggestions(null)}
                      sx={{ mt: 2, color: '#999' }}
                    >
                      Clear Suggestions
                    </Button>
                  </Box>
                ) : (
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="small"
                    onClick={getAISuggestions}
                    disabled={aiLoading || !q}
                    startIcon={aiLoading ? <CircularProgress size={16} /> : '✨'}
                  >
                    {aiLoading ? 'Getting suggestions...' : 'Get Suggestions'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🛠️ Tech Stack
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption"><strong>Frontend:</strong> React 18, Vite, MUI</Typography>
                  <Typography variant="caption"><strong>Backend:</strong> Node.js, Express, Mongoose</Typography>
                  <Typography variant="caption"><strong>Database:</strong> MongoDB</Typography>
                  <Typography variant="caption"><strong>Cache:</strong> Redis</Typography>
                  <Typography variant="caption"><strong>Auth:</strong> JWT + bcrypt</Typography>
                  <Typography variant="caption"><strong>AI:</strong> OpenAI API (GPT-4o-mini)</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Status */}
            <Card sx={{ backgroundColor: user ? '#e8f5e9' : '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {user ? '✅ Logged In' : '🔒 Not Logged In'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {user 
                    ? `Welcome! Rate & favorite snippets to personalize your experience.` 
                    : 'Login to rate and save favorite snippets.'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #eee', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#999' }}>
            💻 Backend: http://localhost:4000 | 🎨 Frontend: http://localhost:5173
          </Typography>
        </Box>
      </Container>
    </>
  )
}
