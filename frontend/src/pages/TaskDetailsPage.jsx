import { useEffect, useState } from 'react'
import { Box, Container, Typography, Chip, Grid, TextField, Button, Card, CardContent, CardActions, IconButton, Tooltip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'
import axios from 'axios'
import { useAuth } from '../state/auth.jsx'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

function SnippetCard({ s, onView, canAct, onFavorite, onRate }){
  return (
    <Card sx={{ mb:2 }}>
      <CardContent>
        <Typography variant="h6">{s.title}</Typography>
        <Typography variant="caption">{s.language} • {s.tags?.join(', ')}</Typography>
        <Box component="pre" sx={{ backgroundColor:'#f6f8fa', p:1, mt:1, maxHeight:180, overflow:'auto' }}>{s.code.split('\n').slice(0,12).join('\n')}</Box>
        <Typography variant="body2">Rating: {s.avgRating?.toFixed(1)||0} ({s.ratingCount||0})</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=> onView(s)}>View</Button>
        {canAct ? (
          <>
            <Tooltip title="Favorite">
              <IconButton onClick={()=> onFavorite(s)}><FavoriteIcon/></IconButton>
            </Tooltip>
            <Tooltip title="Rate">
              <IconButton onClick={()=> onRate(s)}><StarIcon/></IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Login required"><span><IconButton disabled><FavoriteIcon/></IconButton></span></Tooltip>
        )}
      </CardActions>
    </Card>
  )
}

export default function TaskDetailsPage(){
  return (
    <Container sx={{ py:4 }}>
      <Typography variant="h4" sx={{mb:2}}>✅ Intelligent Code Snippet Search with AI</Typography>
      <Box sx={{ my:2 }}>
        <Chip label="React.js" sx={{ mr:1 }} />
        <Chip label="Node.js" sx={{ mr:1 }} />
        <Chip label="Express.js" sx={{ mr:1 }} />
        <Chip label="MongoDB" sx={{ mr:1 }} />
        <Chip label="OpenAI API" sx={{ mr:1 }} />
      </Box>
      <Box sx={{ mb:3 }}>
        <Typography variant="h6">Description</Typography>
        <ul>
          <li>Web app to search and view code snippets</li>
          <li>Logged-in users can rate and favorite snippets</li>
          <li>Search powered by MongoDB text index and cached in Redis</li>
          <li>AI suggestions available via OpenAI</li>
        </ul>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display:'flex', gap:1, mb:2 }}>
            <TextField fullWidth placeholder="Search code snippets..." />
            <Button variant="contained">Search</Button>
          </Box>
          <Typography variant="body2" sx={{color:'#666', p:2, backgroundColor:'#f0f0f0', borderRadius:1}}>
            Backend: Check if http://localhost:4000 is running
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p:2 }}>
            <Typography variant="h6">AI Suggestions</Typography>
            <Button sx={{ mt:2 }}>Get Suggestions</Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
