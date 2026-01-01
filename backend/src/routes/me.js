const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');
const Snippet = require('../models/Snippet');

router.get('/favorites', auth, async (req, res, next)=>{
  try{
    const page = parseInt(req.query.page||'1');
    const limit = Math.min(50, parseInt(req.query.limit||'20'));
    
    const favs = await Favorite.find({ userId: req.user._id }).lean();
    const ids = favs.map(f=>f.snippetId);
    const total = ids.length;
    
    const snippets = await Snippet.find({ _id: { $in: ids } })
      .skip((page-1)*limit)
      .limit(limit)
      .lean();
    
    res.json({ total, page, limit, items: snippets });
  }catch(e){ next(e); }
});

module.exports = router;
