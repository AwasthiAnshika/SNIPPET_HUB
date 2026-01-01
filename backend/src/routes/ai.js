const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Snippet = require('../models/Snippet');
const Joi = require('joi');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/suggest', async (req, res, next)=>{
  try{
    const schema = Joi.object({ query: Joi.string().max(300).required(), topSnippetIds: Joi.array().items(Joi.string()).max(10) });
    const { error, value } = schema.validate(req.body);
    if(error) return res.status(400).json({ error: { message: error.message, code: 'INVALID' } });

    const snippets = [];
    if(Array.isArray(value.topSnippetIds) && value.topSnippetIds.length){
      const ids = value.topSnippetIds.slice(0,10);
      const docs = await Snippet.find({ _id: { $in: ids } }).select('title language code').lean();
      docs.forEach(d=> snippets.push({ id: d._id.toString(), title: d.title, language: d.language, excerpt: (d.code||'').split('\n').slice(0,8).join('\n') }));
    }

    // Build prompt, truncate excerpts to ~1000 chars
    const maxLen = 1200;
    const snippetText = snippets.map(s=> `Title: ${s.title}\nLang: ${s.language}\nCodeExcerpt:\n${s.excerpt.substring(0, maxLen)}`).join('\n---\n');
    const prompt = `User query: """${value.query}"""\n\nSnippets:\n${snippetText}\n\nPlease: 1) suggest improved search queries/keywords (3-6 items). 2) indicate which snippet seems most relevant and why (short). 3) give a short next steps tip for adapting the snippet. Respond JSON with keys: queries, bestSnippetId, reason, nextSteps.`;

    const aiRes = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 400 });
    const text = aiRes.choices?.[0]?.message?.content || '';
    let parsed = { raw: text };
    try{ parsed = Object.assign(parsed, JSON.parse(text)); }catch(e){}
    res.json({ suggestions: parsed, snippets });
  }catch(e){ next(e); }
});

module.exports = router;
