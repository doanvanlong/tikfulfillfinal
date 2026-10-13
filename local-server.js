// Local test server using Node.js built-ins; no npm dependencies.
// Bind to loopback only. Never expose this server to the internet.
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {URL} = require('node:url');
const root = __dirname;
function loadEnv(){
 const file=path.join(root,'.env');
 if(!fs.existsSync(file)) { console.error('Missing .env. Copy .env.example to .env and fill credentials.'); process.exit(1); }
 for (const line of fs.readFileSync(file,'utf8').split(/\r?\n/)) {
  const m=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
  if(!m || Object.hasOwn(process.env,m[1])) continue;
  let v=m[2]; if((v[0]==='"'&&v.at(-1)==='"')||(v[0]==="'"&&v.at(-1)==="'"))v=v.slice(1,-1);
  process.env[m[1]]=v;
 }
}
loadEnv();
process.env.LOCAL_DEV_NO_AUTH='1';
const google = require('./api/google.js');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.csv':'text/csv; charset=utf-8'};
const safeFiles={'/':'index.html','/index.html':'index.html','/sheets-api.js':'sheets-api.js','/templates/tiktok-fs.xlsx':'templates/tiktok-fs.xlsx','/templates/tiktok-presstify.csv':'templates/tiktok-presstify.csv'};
const port=Number(process.env.PORT)||3000;
http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://127.0.0.1');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(url.pathname==='/api/google'){
   req.query=Object.fromEntries(url.searchParams.entries());
   if(req.method==='POST'||req.method==='PUT'){
    let body='';
    for await(const chunk of req){body+=chunk;if(body.length>1024*1024){res.writeHead(413);res.end('Payload too large');return}}
    try{req.body=JSON.parse(body||'{}')}catch{res.writeHead(400);res.end('Invalid JSON');return}
   }
   return google(req,res);
  }
  const name=safeFiles[url.pathname];
  if(!name){res.writeHead(404);res.end('Not found');return}
  res.setHeader('Content-Type',types[path.extname(name)]||'application/octet-stream');
  res.end(fs.readFileSync(path.join(root,name)));
 }catch(err){console.error('Request failed:',err.message);if(!res.headersSent)res.writeHead(500);res.end('Internal server error')}
}).listen(port,'127.0.0.1',()=>console.log(`TikFulfill available at http://127.0.0.1:${port}`));
