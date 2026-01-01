import { useEffect, useState } from 'react'
import { 
  Container, Box, Typography, Button, 
  Card, CardContent, CardActions, IconButton, Tooltip, AppBar, 
  Toolbar, CircularProgress, Alert, Pagination, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import axios from 'axios'
import { useAuth } from '../state/auth.jsx'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

function SnippetCard({ snippet, isLoggedIn, onRefresh }) {
  const [isFavorited, setIsFavorited] = useState(true)
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

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      alert('Please login to unfavorite')
      return
    }
    try {
      setLoading(true)
      await axios.delete(`${API}/snippets/${snippet._id}/favorite`)
      setIsFavorited(false)
      onRefresh()
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
            <Tooltip title="Remove from Favorites">
              <IconButton 
                size="small" 
                onClick={handleFavorite}
                disabled={loading}
                sx={{ color: '#e91e63' }}
              >
                <FavoriteIcon />
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
          ) : null}
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

export default function FavoritesPage(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const limit = 20

  const fetchFavorites = async (pageNum = 1) => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`${API}/me/favorites`, { 
        params: { page: pageNum, limit } 
      })
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
      setPage(pageNum)
    } catch (err) {
      setError('Failed to load favorites: ' + (err.response?.data?.error?.message || err.message))
      console.error('Fetch favorites error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(user) fetchFavorites(1)
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const totalPages = Math.ceil(total / limit)

  if(!user) return (
    <>
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
            Back to Search
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py:4 }}>
        <Typography>🔒 Login required to view favorites</Typography>
      </Container>
    </>
  )

  return (
    <>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            💻 Code Snippet Search with AI
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>👤 {user.email}</Typography>
          <Button 
            color="inherit" 
            size="small"
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            🔍 Search
          </Button>
          <Button 
            color="inherit" 
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Title */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
            ❤️ Your Favorite Snippets
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
            Your collection of saved code snippets. Rate and manage them here.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Results */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
            {loading ? '⏳ Loading...' : `❤️ ${total} favorites (Page ${page} of ${totalPages})`}
          </Typography>
          
          {items.length > 0 ? (
            <>
              {items.map(snippet => (
                <SnippetCard 
                  key={snippet._id} 
                  snippet={snippet} 
                  isLoggedIn={!!user}
                  onRefresh={() => fetchFavorites(page)}
                />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page}
                    onChange={(e, newPage) => fetchFavorites(newPage)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : !loading && (
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#fafafa' }}>
              <Typography color="textSecondary">
                📭 No favorites yet. Search and add some snippets!
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/')}
              >
                Go to Search
              </Button>
            </Card>
          )}
        </Box>
      </Container>
    </>
  )
}
