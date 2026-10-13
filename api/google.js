// Vercel Node.js function. All OAuth secrets remain in Vercel Environment Variables.
const crypto = require('node:crypto');
const env = (k) => (process.env[k] || '').trim();
const respond = (res, code, body) => {res.statusCode=code;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));};
function sameKey(a,b){const x=Buffer.from(a||''), y=Buffer.from(b||'');return x.length===y.length && crypto.timingSafeEqual(x,y);}
module.exports=async function handler(req,res){
  if(!['GET','PUT','POST'].includes(req.method)) return respond(res,405,{error:{message:'Method not allowed'}});
  const admin=env('APP_ACCESS_KEY');
  const localOnly=process.env.LOCAL_DEV_NO_AUTH==='1' && process.env.VERCEL!=='1' && ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket?.remoteAddress);
  if(!localOnly && (!admin || !sameKey(req.headers['x-access-key'],admin))) return respond(res,401,{error:{message:'Mã truy cập không hợp lệ hoặc server chưa được cấu hình'}});
  const clientId=env('GOOGLE_CLIENT_ID'), clientSecret=env('GOOGLE_CLIENT_SECRET'), refreshToken=env('GOOGLE_REFRESH_TOKEN'), spreadsheet=env('GOOGLE_SPREADSHEET_ID');
  if(!clientId||!clientSecret||!refreshToken||!spreadsheet) return respond(res,503,{error:{message:'Thiếu biến môi trường Google tại Vercel'}});
  if(req.query.action==='status') return respond(res,200,{ok:true,sheetName:env('GOOGLE_SHEET_NAME')||'Orders',sheetUrl:`https://docs.google.com/spreadsheets/d/${encodeURIComponent(spreadsheet)}/edit`});
  const path=String(req.query.path||'');
  // Only Google Sheets spreadsheet metadata, values and batchUpdate operations.
  if(!/^\/?(?:\?(?:fields|includeGridData)=|:batchUpdate(?:\?|$)|\/values(?:\/|:batchUpdate(?:\?|$)))/.test(path) || path.includes('://') || path.length>1600) return respond(res,400,{error:{message:'API path is not permitted'}});
  try{
    const tokenResp=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:clientId,client_secret:clientSecret,refresh_token:refreshToken,grant_type:'refresh_token'})});
    const tokenData=await tokenResp.json();
    if(!tokenResp.ok || !tokenData.access_token) return respond(res,502,{error:{message:'Không làm mới được Google access token. Hãy kiểm tra refresh token và quyền Sheets.'}});
    const url='https://sheets.googleapis.com/v4/spreadsheets/'+encodeURIComponent(spreadsheet)+path;
    let requestBody=req.body;
    if(typeof requestBody==='string'){try{requestBody=JSON.parse(requestBody)}catch{return respond(res,400,{error:{message:'Invalid JSON'}})}}
    const upstream=await fetch(url,{method:req.method,headers:{'Authorization':'Bearer '+tokenData.access_token,...(req.method!=='GET'?{'Content-Type':'application/json'}:{})},body:req.method==='GET'?undefined:JSON.stringify(requestBody||{})});
    const data=await upstream.json().catch(()=>({error:{message:'No response from Sheets API'}}));
    return respond(res,upstream.status,data);
  }catch(e){return respond(res,502,{error:{message:'Không kết nối được Google Sheets API từ server'}})}
};
