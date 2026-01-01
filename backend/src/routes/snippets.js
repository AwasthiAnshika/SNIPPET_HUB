const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const Snippet = require('../models/Snippet');
const Rating = require('../models/Rating');
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');
const redis = require('../lib/redisClient');

const SEARCH_TTL = parseInt(process.env.CACHE_TTL_SEARCH || '90');
const SNIPPET_TTL = parseInt(process.env.CACHE_TTL_SNIPPET || '300');

router.get('/', async (req, res, next)=>{
  try{
    const q = req.query.q || '';
    const lang = req.query.lang || req.query.language; // Support both
    const tag = req.query.tag;
    const page = parseInt(req.query.page||'1');
    const limit = Math.min(50, parseInt(req.query.limit||'10'));
    const key = `search:${q}:${lang||''}:${tag||''}:${page}:${limit}`;
    if(!req.headers.authorization){
      const cached = await redis.get(key);
      if(cached) return res.json(JSON.parse(cached));
    }

    const filter = {};
    if(lang) filter.lang = lang;
    if(tag) filter.tags = tag;

    let query;
    if(q){
      query = Snippet.find({ $text: { $search: q }, ...filter }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
    }else{
      query = Snippet.find(filter).sort({ ratingCount: -1, createdAt: -1 });
    }

    const total = await Snippet.countDocuments(q ? { $text: { $search: q }, ...filter } : filter);
    const items = await query.skip((page-1)*limit).limit(limit).lean();

    const out = { total, page, limit, items };
    if(!req.headers.authorization) await redis.set(key, JSON.stringify(out), 'EX', SEARCH_TTL);
    res.json(out);
  }catch(e){ next(e); }
});

router.get('/:id', async (req, res, next)=>{
  try{
    const id = req.params.id;
    const key = `snippet:${id}`;
    const cached = await redis.get(key);
    if(cached) return res.json(JSON.parse(cached));
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: { message: 'Invalid id', code: 'INVALID' } });
    const snip = await Snippet.findById(id).lean();
    if(!snip) return res.status(404).json({ error: { message: 'Not found', code: 'NOT_FOUND' } });
    await redis.set(key, JSON.stringify(snip), 'EX', SNIPPET_TTL);
    res.json(snip);
  }catch(e){ next(e); }
});

router.get('/:id/rating', auth, async (req, res, next)=>{
  try{
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: { message: 'Invalid id', code: 'INVALID' } });
    const rating = await Rating.findOne({ userId: req.user._id, snippetId: id }).lean();
    res.json({ rating: rating ? rating.value : null });
  }catch(e){ next(e); }
});

router.post('/:id/rate', auth, async (req, res, next)=>{
  try{
    const id = req.params.id;
    const schema = Joi.object({ value: Joi.number().integer().min(1).max(5).required() });
    const { error, value } = schema.validate(req.body);
    if(error) return res.status(400).json({ error: { message: error.message, code: 'INVALID' } });
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: { message: 'Invalid id', code: 'INVALID' } });

    let rating = await Rating.findOne({ userId: req.user._id, snippetId: id });
    if(rating){
      rating.value = value.value;
      await rating.save();
    }else{
      rating = await Rating.create({ userId: req.user._id, snippetId: id, value: value.value });
    }

    // Recalculate aggregates
    const agg = await Rating.aggregate([{ $match: { snippetId: new mongoose.Types.ObjectId(id) } }, { $group: { _id: '$snippetId', avg: { $avg: '$value' }, count: { $sum: 1 } } }]);
    const a = agg[0] || { avg: 0, count: 0 };
    await Snippet.findByIdAndUpdate(id, { avgRating: a.avg, ratingCount: a.count });

    // invalidate cache
    await redis.del(`snippet:${id}`);

    const snip = await Snippet.findById(id).lean();
    res.json({ snippet: snip, yourRating: rating.value });
  }catch(e){ next(e); }
});

router.post('/:id/favorite', auth, async (req, res, next)=>{
  try{
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: { message: 'Invalid id', code: 'INVALID' } });
    try{
      await Favorite.create({ userId: req.user._id, snippetId: id });
    }catch(e){}
    res.json({ ok: true });
  }catch(e){ next(e); }
});

router.delete('/:id/favorite', auth, async (req, res, next)=>{
  try{
    const id = req.params.id;
    await Favorite.deleteOne({ userId: req.user._id, snippetId: id });
    res.json({ ok: true });
  }catch(e){ next(e); }
});

module.exports = router;
