require('dotenv').config();
const mongoose = require('mongoose');
const Snippet = require('../src/models/Snippet');

const languages = ['javascript','typescript','python','go','java','cpp','rust','sql','bash'];
const tagsPool = ['auth','db','api','ui','utils','performance','security','testing','script','cli'];

function sample(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function genCode(lang, i){
  if(lang==='javascript' || lang==='typescript'){
    return `function example${i}(a, b) {\n  return a + b;\n}\n\nconsole.log(example${i}(1,2));`;
  }
  if(lang==='python') return `def example${i}(a, b):\n    return a + b\n\nprint(example${i}(1,2))`;
  if(lang==='go') return `package main\nimport "fmt"\nfunc main(){ fmt.Println(1+2) }`;
  if(lang==='sql') return `-- Example query\nSELECT * FROM users WHERE id = ${i};`;
  if(lang==='bash') return `#!/bin/bash\necho $((1 + 2))`;
  if(lang==='rust') return `fn main(){ println!("{}", 1+2); }`;
  return `// ${lang} example ${i}\nfn main() {}`;
}

async function seed(){
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to mongo');
  await Snippet.deleteMany({});
  const items = [];
  for(let i=1;i<=100;i++){
    const language = sample(languages);
    const tags = [];
    const tcount = 1 + Math.floor(Math.random()*3);
    for(let j=0;j<tcount;j++) tags.push(sample(tagsPool));
    const title = `${language} snippet ${i}`;
    const description = `A small ${language} snippet for ${tags.join(', ')}`;
    const code = genCode(language, i);
    items.push({ title, description, lang: language, tags, code });
  }
  await Snippet.insertMany(items);
  console.log('Inserted 100 snippets');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
