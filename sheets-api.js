/* TikFulfill Google Sheets REST adapter. OAuth access token stays in memory only. */
(() => {
 'use strict';
 const H={Fulfillment:['Line UID','Order ID','Variant ID','Design Front','Design Back','Mockup Link','Quantity','Label Link','Status','Notes','Updated At','Print Placement'],VariantMapping:['Key','Brand','Product Type','Color','Size','Variant ID','Base Cost','Updated At'],DesignLibrary:['SKU','Product Name','Print Sides','Design Front Light','Design Back Light','Design Front Dark','Design Back Dark','Mockup Link','Updated At'],ExportHistory:['Created At','Filename','Order Count','Spreadsheet File ID','Created By'],ColorConfig:['Tone','Color','Updated At']};
 const localMode=['localhost','127.0.0.1'].includes(location.hostname);
 const state={sheetName:'Orders',accessKey:sessionStorage.getItem('tikfulfill.accessKey')||'',connected:false,localMode};
 const error=(m)=>{throw new Error(m)};
 const quote=n=>"'"+String(n).replace(/'/g,"''")+"'";
 const col=n=>{let s='';while(n>0){let m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26)}return s};
 const cell=(name,r)=>quote(name)+'!'+r;
 function configure({accessKey}){const key=String(accessKey||'').trim();if(!key)error('Nhập mã truy cập website.');state.accessKey=key;sessionStorage.setItem('tikfulfill.accessKey',key);state.connected=false;return getConfig()}
 function getConfig(){return {sheetName:state.sheetName,connected:state.connected,hasAccessKey:!!state.accessKey,localMode};}
 async function login(){if(!state.accessKey && !localMode)error('Hãy nhập mã truy cập website trước.');const r=await fetch('/api/google?action=status',{headers:{'X-Access-Key':state.accessKey},cache:'no-store'});const j=await r.json().catch(()=>({}));if(!r.ok)error(j.error?.message||'Không thể kết nối API');state.sheetName=j.sheetName||'Orders';state.sheetUrl=j.sheetUrl||'';state.connected=true;return {...getConfig(),sheetUrl:j.sheetUrl}}
 async function http(path,method='GET',payload){if(!state.connected)await login();let r;try{r=await fetch('/api/google?path='+encodeURIComponent(path),{method,cache:'no-store',headers:{'X-Access-Key':state.accessKey,...(payload?{'Content-Type':'application/json'}:{})},body:payload?JSON.stringify(payload):undefined})}catch{error('Không gọi được API Vercel. Kiểm tra deployment và mạng.')}const body=await r.json().catch(()=>({}));if(!r.ok){if(r.status===401)state.connected=false;error(body.error?.message||('Google Sheets API HTTP '+r.status))}return body}
 const enc=r=>encodeURIComponent(r);
 const read=async range=>(await http('/values/'+enc(range)+'?valueRenderOption=FORMATTED_VALUE')).values||[];
 const write=async(range,values)=>http('/values/'+enc(range)+'?valueInputOption=USER_ENTERED','PUT',{range,majorDimension:'ROWS',values});
 const append=async(range,values)=>http('/values/'+enc(range)+':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS','POST',{majorDimension:'ROWS',values});
 const batchWrite=async(data)=>http('/values:batchUpdate','POST',{valueInputOption:'USER_ENTERED',data:data.map(x=>({range:x.range,majorDimension:'ROWS',values:x.values}))});
 const str=v=>v==null?'':String(v);
 const number=v=>{let s=str(v).replace(/[^\d,.\-]/g,'');if(s.includes(',')&&s.includes('.'))s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');else s=s.replace(',','.');return Number(s)||0};
 const date=v=>{if(!v)return '';const s=str(v);if(/^\d{4}-\d{2}-\d{2}/.test(s)){const [y,m,d]=s.slice(0,10).split('-');return `${d}/${m}/${y}`}return s};
 const uuid=()=>crypto.randomUUID?.()||('uid-'+Date.now()+'-'+Math.random().toString(36).slice(2));
 let serial=Promise.resolve();function exclusive(fn){const p=serial.then(fn);serial=p.catch(()=>{});return p}
 async function ensureTab(name,heads){const meta=await http('?fields=sheets.properties.title');if(!meta.sheets?.some(s=>s.properties?.title===name))await http(':batchUpdate','POST',{requests:[{addSheet:{properties:{title:name}}}]});const first=await read(cell(name,'A1:'+col(heads.length)+'1'));if(!first.length||!first[0]?.length)await write(cell(name,'A1'),[heads]);else if(heads.some((h,i)=>str(first[0][i])!==h)){
  // One-time non-destructive schema upgrade from v13 Fulfillment A:K to v14 A:L.
  const oldHeads=heads.slice(0,-1);
  if(name==='Fulfillment'&&oldHeads.every((h,i)=>str(first[0][i])===h)&&!str(first[0][heads.length-1])){
   await write(cell(name,'L1'),[['Print Placement']]);
  }else if(name==='DesignLibrary'){
   const legacy=['SKU','Product Name','Design Front','Design Back','Print Sides','Mockup Link','Updated At'];
   if(legacy.every((h,i)=>str(first[0][i])===h)){
    const oldRows=(await read(cell(name,'A2:G')))||[];
    const migrated=oldRows.filter(r=>r.some(v=>str(v)!=='')).map(r=>[str(r[0]),str(r[1]),str(r[4]),str(r[2]),str(r[3]),str(r[2]),str(r[3]),str(r[5]),str(r[6])]);
    await write(cell(name,'A1'),[heads]);
    if(migrated.length)await write(cell(name,'A2'),migrated);
   }else error(`Cột tiêu đề tab ${name} đã thay đổi. Hãy kiểm tra trước khi ghi.`)
  }else error(`Cột tiêu đề tab ${name} đã thay đổi. Hãy kiểm tra trước khi ghi.`)
 }}
 async function initTabs(){for(const [name,heads] of Object.entries(H))await ensureTab(name,heads)}
 async function rows(name){const h=H[name],data=await read(cell(name,'A2:'+col(h.length)));return data.map((row,i)=>Object.fromEntries([...h.map((k,j)=>[k,row[j]||'']),['_row',i+2]])).filter(o=>h.some(k=>o[k]!==''))}
 // Orders schema v16: A-F unchanged, G placement, H meta, I qty, J sku,
 // K payout, L label, M shop, N FF, O FF Price, P Profit, Q Line UID.
 // Profit belongs to the order, not to each item. Only the earliest sheet row
 // gets a formula. All rows of that order contribute their individual FF Price.
 // The formula recalculates when Google Sheets users edit FF / FF Price directly.
 // The semicolon separators match the spreadsheet's Vietnamese locale.
 const profitFormula=row=>`=IF(AND(COUNTIF($B$2:$B;B${row})>0;COUNTIF($B$2:$B;B${row})=COUNTIFS($B$2:$B;B${row};$N$2:$N;"TRUE";$O$2:$O;">0"));K${row}-SUMIF($B$2:$B;B${row};$O$2:$O);"")`;
 async function ensureOrdersSchema(){
  const header=(await read(cell(state.sheetName,'A1:Q1')))[0]||[];
  const t=i=>str(header[i]).trim().toLowerCase();
  const metadata=await http('?fields=sheets.properties');
  const sheet=metadata.sheets?.find(x=>x.properties.title===state.sheetName);
  if(!sheet)error('Không tìm thấy tab Orders');
  const insert=async(index,count)=>http(':batchUpdate','POST',{requests:[{insertDimension:{range:{sheetId:sheet.properties.sheetId,dimension:'COLUMNS',startIndex:index,endIndex:index+count},inheritFromBefore:true}}]});
  // Support v14 -> v15, but never overwrite the existing Meta Order column.
  if(t(6)==='meta order'&&t(7)==='quantity'&&t(13)==='line uid'){
   await insert(6,1);await write(cell(state.sheetName,'G1'),[['Print Placement']]);
   return ensureOrdersSchema();
  }
  if(!t(6)&&t(7)==='meta order'&&t(14)==='line uid'){
   await write(cell(state.sheetName,'G1'),[['Print Placement']]);return ensureOrdersSchema();
  }
  // v15 -> v16: insert exactly two columns before O (the existing Line UID).
  if(t(6)==='print placement'&&t(7)==='meta order'&&t(13)==='ff'&&t(14)==='line uid'){
   await insert(14,2);
   await write(cell(state.sheetName,'O1:P1'),[['FF Price','Profit']]);
   return ensureOrdersSchema();
  }
  if(t(6)==='print placement'&&t(7)==='meta order'&&t(13)==='ff'&&!t(14)&&!t(15)&&t(16)==='line uid'){
   await write(cell(state.sheetName,'O1:P1'),[['FF Price','Profit']]);
   return ensureOrdersSchema();
  }
  if(t(6)==='print placement'&&t(7)==='meta order'&&t(13)==='ff'&&t(14)==='ff price'&&t(15)==='profit'&&t(16)==='line uid')return;
  error('Cấu trúc Orders không đúng. Cần N=FF, O=FF Price, P=Profit, Q=Line UID. Không ghi dữ liệu.');
 }
 async function allOrders(){
  await ensureOrdersSchema();
  const a=await read(cell(state.sheetName,'A1:Q'));
  const profitCells=(await http('/values/'+enc(cell(state.sheetName,'P1:P'))+'?valueRenderOption=FORMULA')).values||[];
  const updates=[],ids=new Set(),result=[];
  const firstRowByOrder=new Map(),groups=new Map();
  for(let i=1;i<a.length;i++){
   const r=a[i]||[],orderId=str(r[1]).trim();if(!orderId)continue;
   const row=i+1;
   if(!firstRowByOrder.has(orderId))firstRowByOrder.set(orderId,row);
   let uid=str(r[16]);
   if(!uid){uid=uuid();updates.push({range:cell(state.sheetName,`Q${row}`),values:[[uid]]})}
   if(ids.has(uid))error('Có Line UID trùng trong cột Q');ids.add(uid);
   const costRaw=str(r[14]).trim(),cost=costRaw===''?null:number(costRaw);
   const flag=str(r[13]).trim().toUpperCase()==='TRUE';
   const item={row,uid,stt:str(r[0]),id:orderId,dateUS:date(r[2]),dateVN:date(r[3]),name:str(r[4]),productURL:str(r[5]),placement:str(r[6]),variation:str(r[7]),qty:number(r[8])||1,sku:str(r[9]),price:number(r[10]),label:str(r[11]),shop:str(r[12]),flag,rawFlag:str(r[13]),ffPrice:cost,profit:null};
   result.push(item);
   if(!groups.has(orderId))groups.set(orderId,[]);
   groups.get(orderId).push(item);
  }
  for(const [orderId,lines] of groups){
   const first=lines[0],eligible=lines.every(x=>x.flag&&x.ffPrice!==null&&Number.isFinite(x.ffPrice)&&x.ffPrice>0);
   const sumCost=lines.reduce((sum,x)=>sum+(x.ffPrice||0),0);
   first.profit=eligible?first.price-sumCost:null;
   // Explicitly clear old, incorrect per-item Profit formulas/values. Do NOT
   // alter repeated raw Payout values in K: these originate from TikTok imports.
   for(const item of lines){
    const target=item.row===first.row?profitFormula(first.row):'';
    const present=str(profitCells[item.row-1]?.[0]).trim();
    if(present!==target)updates.push({range:cell(state.sheetName,`P${item.row}`),values:[[target]]});
   }
  }
  if(updates.length)await batchWrite(updates);
  return result;
 }
 const DEFAULT_COLOR_CONFIG={light:['Ash-#c8c8c8','White-#ffffff','Sport Grey-#b6b7b9','Light Blue-#b5d5e7','Light Pink-#f4c4d2','Sand-#d7cbb9'],dark:['Black-#202125','Navy-#263651','Dark Heather-#4e4e56','Dark Chocolate-#43332c','Military Green-#626a4c','Forest Green-#294f3c']};
 async function readColorConfig(){const rr=await rows('ColorConfig');if(!rr.length)return {...DEFAULT_COLOR_CONFIG,updatedAt:''};const cfg={light:[],dark:[],updatedAt:''};for(const r of rr){const tone=str(r.Tone).trim().toLowerCase(),color=str(r.Color).trim();if((tone==='light'||tone==='dark')&&color){cfg[tone].push(color);cfg.updatedAt=r['Updated At']||cfg.updatedAt}}return cfg.light.length&&cfg.dark.length?cfg:{...DEFAULT_COLOR_CONFIG,updatedAt:''}}
 async function saveColorConfig(payload){const clean={};const seen=new Set();for(const tone of ['light','dark']){const items=payload?.[tone];if(!Array.isArray(items)||!items.length||items.length>200)error('Danh sách màu '+tone+' không hợp lệ');clean[tone]=[];for(const item of items){const color=str(item).trim(),parts=color.match(/^(.*?)-\s*(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})$/),key=parts?parts[1].trim().toLowerCase():'';if(!parts||!key||color.length>80||seen.has(key))error('Tên màu hoặc mã HEX không hợp lệ/trùng: '+color);clean[tone].push(color);seen.add(key)}}await ensureTab('ColorConfig',H.ColorConfig);const all=await rows('ColorConfig');const timestamp=new Date().toISOString(),values=[...clean.light.map(x=>['Light',x,timestamp]),...clean.dark.map(x=>['Dark',x,timestamp])];const clearRange=cell('ColorConfig','A2:C'+(Math.max(all.length,values.length)+1));await http('/values/'+enc(clearRange)+':clear','POST',{});await write(cell('ColorConfig','A2'),values);return {ok:true}}
 async function data(){await initTabs();const [orders,fulfills,variants,designs,exports,config]=await Promise.all([allOrders(),rows('Fulfillment'),rows('VariantMapping'),rows('DesignLibrary'),rows('ExportHistory'),readColorConfig()]);return {orders,fulfills,variants,designs,exports:exports.reverse(),config,sheetUrl:state.sheetUrl||"",updatedAt:new Date().toISOString()}}
 async function locate(uid,orderId){
  const o=await read(cell(state.sheetName,'B2:Q'));
  const matches=[];o.forEach((r,i)=>{if(str(r[15])===str(uid)&&str(r[0])===str(orderId))matches.push(i+2)});
  if(matches.length!==1)error('Không xác định được duy nhất dòng Order; hãy đồng bộ lại trước khi sửa.');return matches[0]
 }
 async function saveOrderFields(p){
  const allowed={name:'E',productURL:'F',placement:'G',variation:'H',qty:'I',sku:'J',price:'K',label:'L',shop:'M',flag:'N',ffPrice:'O'};
  const changes=p.changes||{};let row=await locate(p.uid,p.orderId);const fields=Object.keys(changes);
  if(fields.some(k=>!allowed[k]))error('Có cột không được phép chỉnh sửa');
  if('placement' in changes&&!['Front','Back','Front+Back'].includes(changes.placement))error('Mặt in không hợp lệ');
  if('ffPrice' in changes && changes.ffPrice!=='' && (changes.ffPrice===null || !Number.isFinite(number(changes.ffPrice)) || number(changes.ffPrice)<0))error('FF Price không hợp lệ');
  const updates=fields.map(key=>({range:cell(state.sheetName,allowed[key]+row),values:[[key==='flag'?Boolean(changes[key]):key==='ffPrice'?(changes[key]===''?'':number(changes[key])):changes[key]]]}));
  // Do not put a per-item Profit formula here: allOrders() maintains one
  // group-level formula at the first row of each Order ID on the next refresh.
  if(updates.length)await batchWrite(updates);return {ok:true}
 }
 async function upsert(name,keyName,p){const heads=H[name];await ensureTab(name,heads);let all=await rows(name),key=str(p[keyName]).trim();if(!key)error('Thiếu '+keyName);let matched=all.filter(x=>str(x[keyName])===key);if(matched.length>1)error('Có khóa trùng trong tab '+name);let values=heads.map(h=>h==='Updated At'?new Date().toISOString():(name==='Fulfillment'&&h==='Print Placement'&&p[h]===undefined?str(matched[0]?.[h]||''):str(p[h]??'')));if(matched.length)await write(cell(name,`A${matched[0]._row}:${col(heads.length)}${matched[0]._row}`),[values]);else await append(cell(name,'A1:'+col(heads.length)),[values]);return {ok:true}}
 async function saveFulfillment(p){
  const row=await locate(p.uid,p.orderId);
  if(number(p.Quantity)<0)error('Quantity không hợp lệ');
  if(p['Print Placement']&&!['Front','Back','Front+Back'].includes(p['Print Placement']))error('Mặt in không hợp lệ');
  // Orders!G is the authoritative Print Placement. Legacy Fulfillment!L is only kept for compatibility.
  // Update G after a successful Fulfillment save; users editing G directly are always reflected on the web.
  const record={'Line UID':p.uid,'Order ID':p.orderId,...p};
  delete record['Print Placement'];
  await upsert('Fulfillment','Line UID',record);
  if(p['Print Placement'])await write(cell(state.sheetName,'G'+row),[[p['Print Placement']]]);
  return {ok:true};
 }
 async function saveVariant(p){for(const k of ['Brand','Product Type','Color','Size','Variant ID'])if(!str(p[k]).trim())error('Thiếu '+k);let key=[p.Brand,p['Product Type'],str(p.Color).toLowerCase(),str(p.Size).toLowerCase()].join('|');return upsert('VariantMapping','Key',{...p,Key:key,'Base Cost':number(p['Base Cost'])})}
 async function saveDesign(p){if(!str(p.SKU).trim())error('Thiếu SKU');return upsert('DesignLibrary','SKU',p)}
 async function deleteRecord(kind,key){const name=({variant:'VariantMapping',design:'DesignLibrary'})[kind];if(!name)error('Loại dữ liệu không hợp lệ');let rows0=await rows(name),k=kind==='variant'?'Key':'SKU',m=rows0.filter(r=>r[k]===key);if(m.length!==1)error('Không tìm thấy khóa duy nhất');const meta=await http('?fields=sheets.properties');const sid=meta.sheets.find(s=>s.properties.title===name)?.properties.sheetId;if(sid==null)error('Không thấy tab '+name);await http(':batchUpdate','POST',{requests:[{deleteDimension:{range:{sheetId:sid,dimension:'ROWS',startIndex:m[0]._row-1,endIndex:m[0]._row}}}]});return {ok:true}}
 async function batchSetFlag(items,value){const updates=[];for(const p of items){const n=await locate(p.uid,p.orderId);updates.push({range:cell(state.sheetName,'N'+n),values:[[Boolean(value)]]})}if(updates.length)await batchWrite(updates);return {ok:true,count:updates.length}}
 async function recordExport(p){await ensureTab('ExportHistory',H.ExportHistory);await append(cell('ExportHistory','A1:E'),[[new Date().toISOString(),str(p.filename),Number(p.count)||0,'','OAuth user']]);return {ok:true}}
 const actions={getData:data,saveColorConfig,saveOrderFields,saveFulfillment,saveVariant,saveDesign,deleteRecord,batchSetFlag,recordExport};
 window.TikSheets={configure,getConfig,login,api:(name,...args)=>{if(!actions[name])return Promise.reject(Error('API operation not supported: '+name));return exclusive(()=>actions[name](...args))}};
})();
