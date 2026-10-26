const fs = require('fs');
let data;
try {
  const text = fs.readFileSync('./server.js','utf8');
  const m = text.match(/const restaurants = (\[.*?\]);\s*\n\s*const enriched/s);
  if (m) data = JSON.parse(m[1]);
} catch(e){ console.log(e) }
function makeLinks(lat,lng){
  return { google: `https://maps.google.com/?q=${lat},${lng}`, waze: `https://waze.com/ul?ll=${lat},${lng}`, apple: `https://maps.apple.com/?q=${lat},${lng}` }
}
if (data){
  const enriched = data.map(r=>({...r, links: makeLinks(r.lat,r.lng)}));
  const groups = {};
  enriched.forEach(r=>{ const slug = r.town.toLowerCase().replace(/ /g,'-'); groups[slug]=groups[slug]||[]; groups[slug].push(r); });
  fs.mkdirSync('api/eat', {recursive:true});
  Object.entries(groups).forEach(([slug, items])=>{ fs.writeFileSync(`api/eat/${slug}.json`, JSON.stringify({town: slug, count: items.length, results: items}, null, 2)); console.log(`Wrote api/eat/${slug}.json - ${items.length}`); });
}
