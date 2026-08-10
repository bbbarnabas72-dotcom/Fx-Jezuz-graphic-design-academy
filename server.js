const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto'),url=require('url');
const ROOT=__dirname, DATA=path.join(ROOT,'data'), UP=path.join(ROOT,'public','uploads'), DIST=path.join(ROOT,'public'); fs.mkdirSync(DATA,{recursive:true});fs.mkdirSync(UP,{recursive:true});
const DB=path.join(DATA,'database.json'); const hash=s=>crypto.createHash('sha256').update(String(s)).digest('hex');
const defaults={settings:{academyName:'UDS Graphic Design Academy',instructor:'Your Name',phone:'024 000 0000',whatsapp:'024 000 0000',email:'hello@udsgda.com',location:'University for Development Studies (UDS), Tamale Campus, Ghana',fee:'300',duration:'4 Weeks',days:'Saturday & Sunday',time:'10:00 AM – 1:00 PM',status:'Open',heroImage:''},portfolio:[],students:[],registrations:[],admin:{username:'admin',passwordHash:hash(process.env.ADMIN_PASSWORD||'ChangeMe123!')}};
function db(){try{return JSON.parse(fs.readFileSync(DB,'utf8'))}catch{fs.writeFileSync(DB,JSON.stringify(defaults,null,2));return defaults}} function save(x){fs.writeFileSync(DB,JSON.stringify(x,null,2))}
const sessions=new Map(); const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
function body(req){return new Promise((resolve,reject)=>{let b='';req.on('data',c=>{b+=c;if(b.length>2e6)req.destroy()});req.on('end',()=>{try{resolve(b?JSON.parse(b):{})}catch{resolve({})}});req.on('error',reject)})}
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(data))}
function cookie(req){const c=req.headers.cookie||'';const m=c.match(/gda_session=([^;]+)/);return m&&m[1]}
function auth(req){const t=cookie(req);return t&&sessions.has(t)}
function session(res){const t=crypto.randomBytes(32).toString('hex');sessions.set(t,Date.now());res.setHeader('Set-Cookie',`gda_session=${t}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`)}
const server=http.createServer(async(req,res)=>{const u=url.parse(req.url,true),p=u.pathname;
 if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS'});return res.end()}
 if(p==='/api/public'&&req.method==='GET'){const x=db();return send(res,200,{settings:x.settings,portfolio:x.portfolio,students:x.students.filter(s=>s.approved)})}
 if(p==='/api/register'&&req.method==='POST'){const b=await body(req);if(!b.fullName||!b.phone)return send(res,400,{error:'Full name and phone are required'});const x=db(),n=`GDA-${new Date().getFullYear()}-${String(x.registrations.length+1).padStart(3,'0')}`,r={...b,id:crypto.randomUUID(),reg:n,className:'Graphic Design Masterclass',paymentStatus:'Pending',created:new Date().toISOString()};x.registrations.push(r);save(x);return send(res,201,{registrationNumber:n,registration:r})}
 if(p==='/api/login'&&req.method==='POST'){const b=await body(req),x=db();if(b.username!==x.admin.username||hash(b.password)!==x.admin.passwordHash)return send(res,401,{error:'Invalid credentials'});session(res);return send(res,200,{ok:true})}
 if(p==='/api/logout'&&req.method==='POST'){const t=cookie(req);sessions.delete(t);res.setHeader('Set-Cookie','gda_session=; HttpOnly; Path=/; Max-Age=0');return send(res,200,{ok:true})}
 if(p.startsWith('/api/')&&!auth(req))return send(res,401,{error:'Unauthorized'});
 if(p==='/api/admin'&&req.method==='GET')return send(res,200,db());
 if(p==='/api/settings'&&req.method==='PUT'){const x=db();x.settings={...x.settings,...await body(req)};save(x);return send(res,200,x.settings)}
 if(p==='/api/portfolio'&&req.method==='POST'){const x=db(),r={id:crypto.randomUUID(),...(await body(req))};x.portfolio.push(r);save(x);return send(res,201,r)}
 if(p.startsWith('/api/portfolio/')&&req.method==='DELETE'){const x=db();x.portfolio=x.portfolio.filter(v=>v.id!==p.split('/').pop());save(x);return send(res,200,{ok:true})}
 if(p==='/api/student-work'&&req.method==='POST'){const x=db(),r={id:crypto.randomUUID(),...(await body(req))};x.students.push(r);save(x);return send(res,201,r)}
 if(p.startsWith('/api/student-work/')&&req.method==='DELETE'){const x=db();x.students=x.students.filter(v=>v.id!==p.split('/').pop());save(x);return send(res,200,{ok:true})}
 if(p.startsWith('/api/registrations/')&&req.method==='PATCH'){const x=db(),r=x.registrations.find(v=>v.id===p.split('/').pop());if(!r)return send(res,404,{error:'Not found'});Object.assign(r,await body(req));save(x);return send(res,200,r)}
 if(p==='/api/upload'&&req.method==='POST'){const b=await body(req);if(!b.data||!/^data:image\/(png|jpeg|jpg|webp);base64,/.test(b.data))return send(res,400,{error:'Send a base64 image data URL'});const ext=(b.data.match(/^data:image\/(png|jpeg|jpg|webp)/)||[])[1].replace('jpeg','jpg');const name=crypto.randomBytes(10).toString('hex')+'.'+ext;fs.writeFileSync(path.join(UP,name),Buffer.from(b.data.split(',')[1],'base64'));return send(res,200,{url:'/uploads/'+name})}
 let file=p.startsWith('/uploads/')?path.join(UP,path.basename(p)):path.join(DIST,p==='/'?'index.html':p);if(!fs.existsSync(file)||!fs.statSync(file).isFile())file=path.join(DIST,'index.html');if(fs.existsSync(file)){res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});return res.end(fs.readFileSync(file))}res.writeHead(404);res.end('Not found');
});
server.listen(process.env.PORT||3000,process.env.HOST||'0.0.0.0',()=>console.log('UDS Graphic Design Academy server started.'));
