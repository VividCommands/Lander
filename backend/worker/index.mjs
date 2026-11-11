const origins = new Set(['https://lonware.com', 'https://www.lonware.com']);
const products = [['xKhTB','MACRO_STANDARD_PRODUCT_SECRET'],['NZ9tG','MACRO_PRO_PRODUCT_SECRET'],['i627S','MACRO_RENEW_PRODUCT_SECRET']];
const cutoffFormat = /(?:Z|[+-]\d{2}:\d{2})$/;
export function eligible(data, product, key, cutoff) {
  if (!data || data.enabled !== true || data.product_link !== product || data.license_key !== key) return false;
  if (typeof data.date !== 'string' || !cutoffFormat.test(data.date)) return false;
  const issued = Date.parse(data.date);
  return Number.isFinite(issued) && issued <= Date.now() && (product === 'i627S' || issued >= cutoff);
}
function reply(origin, body, status=200, extra={}) {
  const headers = {'Content-Type':'application/json','Cache-Control':'no-store, private','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff',...extra};
  if (origins.has(origin)) Object.assign(headers, {'Access-Control-Allow-Origin':origin,'Vary':'Origin','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'});
  return new Response(body === null ? null : JSON.stringify(body), {status,headers});
}
async function limited(request, db) {
  if (!db) throw new Error('Missing rate store');
  const peer = request.headers.get('CF-Connecting-IP');
  if (!peer) throw new Error('Missing trusted client IP');
  const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(peer));
  const id = Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const minute = Math.floor(Date.now()/60000);
  const rows = await db.batch([
    db.prepare('DELETE FROM renewal_rate WHERE minute < ?').bind(minute-2),
    db.prepare('INSERT INTO renewal_rate(identity,minute,hits) VALUES(?,?,1) ON CONFLICT(identity) DO UPDATE SET hits=CASE WHEN minute=excluded.minute THEN hits+1 ELSE 1 END, minute=excluded.minute').bind(id,minute),
    db.prepare('SELECT hits FROM renewal_rate WHERE identity=?').bind(id),
  ]);
  return rows[2].results[0].hits > 8;
}
export async function handle(request,env,providerFetch=fetch) {
  const origin=request.headers.get('Origin');
  if (new URL(request.url).pathname !== '/api/macro/renewal/verify') return reply(origin,{error:'not_found'},404);
  if (!origins.has(origin)) return reply(origin,{eligible:false,error:'forbidden'},403);
  if (request.method === 'OPTIONS') return reply(origin,null,204);
  if (request.method !== 'POST') return reply(origin,{error:'method_not_allowed'},405,{'Allow':'POST, OPTIONS'});
  const cutoff=Date.parse(env.MACRO_RENEWAL_CUTOVER_UTC);
  if (!cutoffFormat.test(env.MACRO_RENEWAL_CUTOVER_UTC || '') || !Number.isFinite(cutoff) || products.some(([id,name])=>!env[name]?.startsWith(`prod_sk_${id}_`))) return reply(origin,{eligible:false,error:'unavailable'},503);
  if (!request.headers.get('Content-Type')?.startsWith('application/json') || Number(request.headers.get('Content-Length') || 0)>2048) return reply(origin,{eligible:false,error:'invalid_request'},400);
  let key;
  try {
    const raw=await request.text();
    if (raw.length>2048) throw new Error('Body too large');
    const body=JSON.parse(raw);
    key=typeof body?.license_key === 'string' ? body.license_key.trim().toUpperCase() : '';
  } catch { return reply(origin,{eligible:false,error:'invalid_request'},400); }
  if (!/^[A-Z0-9-]{5,100}$/.test(key)) return reply(origin,{eligible:false,error:'invalid_request'},400);
  try { if (await limited(request,env.DB)) return reply(origin,{eligible:false,error:'rate_limited'},429,{'Retry-After':'60'}); }
  catch { return reply(origin,{eligible:false,error:'unavailable'},503); }
  let unavailable=false;
  for (const [product,name] of products) {
    try {
      const response=await providerFetch('https://payhip.com/api/v2/license/verify?'+new URLSearchParams({license_key:key}),{headers:{'product-secret-key':env[name],'Accept':'application/json'},signal:AbortSignal.timeout(6000),redirect:'error'});
      if (!response.ok) {
        if (![400,404,422].includes(response.status)) unavailable=true;
        continue;
      }
      const raw=await response.text();
      if (!raw.trim()) continue;
      if (raw.length>32768) throw new Error('Invalid response');
      const body=JSON.parse(raw);
      if (eligible(body?.data,product,key,cutoff)) return reply(origin,{eligible:true,checkout_url:'https://payhip.com/buy?link=i627S'});
    } catch { unavailable=true; }
  }
  return reply(origin,{eligible:false,error:unavailable?'unavailable':'ineligible'},unavailable?503:403);
}
export default {fetch(request,env) { return handle(request,env); }};
