import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";

const starter = {
  academyName:"UDS Graphic Design Academy",
  instructor:"Your Name",
  phone:"024 000 0000",
  whatsapp:"024 000 0000",
  email:"hello@udsgda.com",
  location:"University for Development Studies (UDS), Tamale Campus, Ghana",
  fee:"300",
  duration:"4 Weeks",
  days:"Saturday & Sunday",
  time:"10:00 AM – 1:00 PM",
  status:"Open",
  heroImage:"",
  social:{instagram:"",facebook:"",tiktok:"",youtube:""}
};

const starterPortfolio = [
  {id:1,title:"Business Flyer",category:"Flyers",image:"",description:"Promotional flyer design.",featured:true},
  {id:2,title:"Brand Identity",category:"Branding",image:"",description:"Clean visual identity concept.",featured:true},
  {id:3,title:"Event Poster",category:"Posters",image:"",description:"Modern event poster.",featured:false}
];

const starterStudents = [
  {id:1,name:"Student Example",title:"Creative Flyer",category:"Flyers",image:"",approved:true}
];

function load(key, fallback){
  try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}
}
function save(key,value){localStorage.setItem(key,JSON.stringify(value))}

function App(){
  const [settings,setSettings]=useState(()=>load("gda_settings",starter));
  const [portfolio,setPortfolio]=useState(()=>load("gda_portfolio",starterPortfolio));
  const [students,setStudents]=useState(()=>load("gda_students",starterStudents));
  const [registrations,setRegistrations]=useState(()=>load("gda_registrations",[]));
  const [page,setPage]=useState(window.location.hash.replace("#","")||"home");
  const [admin,setAdmin]=useState(false);

  useEffect(()=>save("gda_settings",settings),[settings]);
  useEffect(()=>save("gda_portfolio",portfolio),[portfolio]);
  useEffect(()=>save("gda_students",students),[students]);
  useEffect(()=>save("gda_registrations",registrations),[registrations]);
  useEffect(()=>{
    const f=()=>setPage(window.location.hash.replace("#","")||"home");
    window.addEventListener("hashchange",f); return()=>window.removeEventListener("hashchange",f)
  },[]);

  const go=(p)=>{window.location.hash=p};

  if(page==="admin" || admin) return <Admin settings={settings} setSettings={setSettings} portfolio={portfolio} setPortfolio={setPortfolio} students={students} setStudents={setStudents} registrations={registrations} setRegistrations={setRegistrations} exit={()=>{setAdmin(false);go("home")}}/>;

  return <Public settings={settings} portfolio={portfolio} students={students} registrations={registrations} setRegistrations={setRegistrations} go={go} openAdmin={()=>{setAdmin(true);go("admin")}}/>
}

function Header({settings,go,openAdmin}){
  return <header className="header"><div className="container nav">
    <a className="logo" href="#home">{settings.academyName}<b>.</b></a>
    <nav>
      <a href="#classes">Classes</a><a href="#curriculum">Curriculum</a><a href="#work">My Work</a><a href="#students">Student Work</a>
      <a className="navbtn" href="#register">Register</a>
    </nav>
    <button className="mobile-admin" onClick={openAdmin}>Admin</button>
  </div></header>
}

function Public({settings,portfolio,students,registrations,setRegistrations,go,openAdmin}){
  const featured=portfolio.filter(x=>x.featured);
  const approved=students.filter(x=>x.approved);
  return <>
    <Header settings={settings} go={go} openAdmin={openAdmin}/>
    <main>
      <section className="hero"><div className="container heroGrid">
        <div>
          <div className="eyebrow">PHYSICAL TRAINING · UDS TAMALE CAMPUS</div>
          <h1>LEARN GRAPHIC DESIGN.<br/>CREATE. GET PAID.</h1>
          <p>Master practical graphic design skills through physical, hands-on training at UDS Tamale Campus. Build a portfolio and learn how to turn creativity into income.</p>
          <div className="actions"><a className="button primary" href="#register">REGISTER FOR THE NEXT CLASS</a><a className="button light" href="#work">VIEW MY WORK</a></div>
        </div>
        <div className="heroVisual">
          {settings.heroImage?<img src={settings.heroImage} alt="Instructor work"/>:<div><strong>YOUR DESIGN WORK</strong><span>Upload your hero artwork from the Admin Dashboard.</span></div>}
        </div>
      </div></section>

      <section className="section"><div className="container">
        <div className="sectionTitle"><div><div className="eyebrow">THE LOCATION</div><h2>TRAIN WITH US AT UDS TAMALE CAMPUS</h2></div></div>
        <div className="three">
          <Feature n="01" title="Physical classes" text="All lessons are conducted in person. Students attend scheduled sessions at the training location."/>
          <Feature n="02" title="Hands-on practice" text="Create real design projects while learning the tools, principles and workflows used by designers."/>
          <Feature n="03" title="Income focused" text="Learn portfolio building, pricing, client communication and ways to turn your design skills into income."/>
        </div>
        <div className="locationLine"><b>{settings.location}</b><br/>{settings.days} · {settings.time}</div>
      </div></section>

      <section id="classes" className="section dark"><div className="container">
        <div className="sectionTitle"><div><div className="eyebrow">NEXT AVAILABLE CLASS</div><h2>GRAPHIC DESIGN MASTERCLASS</h2></div><span className="pill">{settings.status}</span></div>
        <div className="classBox"><div className="metaGrid">
          <Meta l="Location" v="UDS Tamale Campus"/><Meta l="Mode" v="Physical / In-Person"/><Meta l="Duration" v={settings.duration}/><Meta l="Level" v="Beginner to Advanced"/><Meta l="Fee" v={`GH₵${settings.fee}`}/><Meta l="Class Time" v={settings.time}/>
        </div><a className="button primary" href="#register">REGISTER NOW</a></div>
      </div></section>

      <section id="curriculum" className="section"><div className="container">
        <div className="sectionTitle"><div><div className="eyebrow">CURRICULUM</div><h2>WHAT STUDENTS WILL LEARN</h2></div></div>
        <div className="three">
          <Feature n="01" title="Graphic Design Fundamentals" text="Design principles, composition, typography, color theory, layout and visual hierarchy."/>
          <Feature n="02" title="Adobe Photoshop" text="Photo editing, background removal, image manipulation, retouching, compositing and flyer creation."/>
          <Feature n="03" title="Adobe Illustrator" text="Logo creation, vector graphics, shapes, typography and brand assets."/>
          <Feature n="04" title="Flyer & Social Media Design" text="Event flyers, business advertisements, social media graphics and promotional materials."/>
          <Feature n="05" title="Branding" text="Logo design, brand identity, color systems, typography and brand presentation."/>
          <Feature n="06" title="T-Shirt Design" text="Apparel graphics, print preparation, mockups and print-ready files."/>
          <Feature n="07" title="Getting Clients" text="Finding customers, pricing, client communication, portfolio building and marketing yourself."/>
        </div>
      </div></section>

      <section id="work" className="section dark"><div className="container">
        <div className="sectionTitle"><div><div className="eyebrow">PORTFOLIO</div><h2>SOME OF MY WORK</h2><p>A selection of designs created for brands, businesses, events and individuals.</p></div><a className="button light" href="#portfolio">VIEW FULL PORTFOLIO</a></div>
        <PortfolioGrid items={featured.length?featured:portfolio}/>
      </div></section>

      <section id="students" className="section"><div className="container">
        <div className="sectionTitle"><div><div className="eyebrow">STUDENT WORK</div><h2>WHAT STUDENTS CREATE</h2></div></div>
        <PortfolioGrid items={approved}/>
      </div></section>

      <section className="section dark"><div className="container"><div className="sectionTitle"><div><div className="eyebrow">CLASS PLAN</div><h2>4-WEEK SCHEDULE</h2></div></div>
        <div className="schedule"><Day n="Week 1" text="Introduction to Graphic Design\nTypography\nColor\nComposition"/><Day n="Week 2" text="Photoshop\nPhoto manipulation\nFlyer design"/><Day n="Week 3" text="Logo design\nBrand identity\nT-shirt design"/><Day n="Week 4" text="Portfolio development\nClient management\nPricing\nGetting your first clients"/></div>
      </div></section>

      <section id="register" className="section"><div className="container"><div className="sectionTitle"><div><div className="eyebrow">REGISTRATION</div><h2>REGISTER FOR THE NEXT CLASS</h2><p>Complete the form and receive a unique registration number.</p></div></div><Registration settings={settings} registrations={registrations} setRegistrations={setRegistrations}/></div></section>
    </main>
    <Footer settings={settings} openAdmin={openAdmin}/>
  </>
}

function Feature({n,title,text}){return <article className="card"><div className="bigNum">{n}</div><h3>{title}</h3><p>{text}</p></article>}
function Meta({l,v}){return <div><small>{l}</small><strong>{v}</strong></div>}
function Day({n,text}){return <div className="day"><h3>{n}</h3>{text.split("\n").map((x,i)=><p key={i}>{x}</p>)}</div>}

function PortfolioGrid({items}){
  if(!items.length) return <div className="empty">No work has been added yet. Use the Admin Dashboard to upload designs.</div>
  return <div className="portfolio">{items.map(x=><article className="work" key={x.id}>{x.image?<img src={x.image} alt={x.title}/>:<div className="workPlaceholder"><span>{x.category||"DESIGN"}</span></div>}<div className="caption"><small>{x.category}</small><h3>{x.title}</h3><p>{x.description||""}</p></div></article>)}</div>
}

function Registration({settings,registrations,setRegistrations}){
  const [done,setDone]=useState(null);
  const [form,setForm]=useState({fullName:"",phone:"",whatsapp:"",email:"",gender:"",age:"",uds:"Yes",programme:"",level:"",experience:"",payment:"MTN Mobile Money"});
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=e=>{
    e.preventDefault();
    const num=`GDA-${new Date().getFullYear()}-${String(registrations.length+1).padStart(3,"0")}`;
    const row={...form,id:Date.now(),reg:num,className:"Graphic Design Masterclass",paymentStatus:"Pending",created:new Date().toLocaleString()};
    setRegistrations([...registrations,row]);setDone(row);setForm({fullName:"",phone:"",whatsapp:"",email:"",gender:"",age:"",uds:"Yes",programme:"",level:"",experience:"",payment:"MTN Mobile Money"});
  };
  if(done) return <div className="success"><h3>Registration Submitted Successfully</h3><p>Your registration number is <b>{done.reg}</b>.</p><p>Course: {done.className}<br/>Location: UDS Tamale Campus<br/>Payment status: Pending</p><button className="button darkButton" onClick={()=>setDone(null)}>REGISTER ANOTHER STUDENT</button></div>
  return <form className="form" onSubmit={submit}><div className="formGrid">
    {["fullName","phone","whatsapp","email","gender","age","programme","level"].map(n=><label key={n}>{label(n)}<input required={["fullName","phone"].includes(n)} name={n} value={form[n]} onChange={change}/></label>)}
    <label>UDS Student<select name="uds" value={form.uds} onChange={change}><option>Yes</option><option>No</option></select></label>
    <label>Preferred payment method<select name="payment" value={form.payment} onChange={change}><option>MTN Mobile Money</option><option>Telecel Cash</option><option>AirtelTigo Money</option><option>Bank transfer</option><option>Cash payment</option></select></label>
    <label className="full">Previous design experience<textarea name="experience" rows="4" value={form.experience} onChange={change}/></label>
  </div><button className="button primary" type="submit">SUBMIT REGISTRATION</button></form>
}
function label(n){return ({fullName:"Full Name",phone:"Phone Number",whatsapp:"WhatsApp Number",email:"Email",gender:"Gender",age:"Age",programme:"Programme",level:"Level"}[n])}

function Footer({settings,openAdmin}){return <footer><div className="container footerGrid"><div><div className="logo">{settings.academyName}<b>.</b></div><p>Practical physical graphic design training at UDS Tamale Campus.</p></div><div><b>Contact</b><p>{settings.phone}<br/>{settings.email}<br/>{settings.location}</p></div><div><b>Admin</b><p><button className="textBtn" onClick={openAdmin}>Open Dashboard</button></p></div></div><div className="container bottom">© {new Date().getFullYear()} {settings.academyName}. All rights reserved.</div></footer>}

function Admin({settings,setSettings,portfolio,setPortfolio,students,setStudents,registrations,setRegistrations,exit}){
  const [tab,setTab]=useState("overview");
  const [editing,setEditing]=useState(null);
  const [toast,setToast]=useState("");
  const [draft,setDraft]=useState({...settings});
  const stats={students:registrations.length,paid:registrations.filter(x=>x.paymentStatus==="Paid").length,pending:registrations.filter(x=>x.paymentStatus!=="Paid").length,revenue:registrations.filter(x=>x.paymentStatus==="Paid").reduce((a,x)=>a+Number(settings.fee||0),0)};
  const notify=x=>{setToast(x);setTimeout(()=>setToast(""),1800)}
  const saveSettings=()=>{setSettings(draft);notify("Website settings saved.")};
  return <div className="adminPage"><aside className="sidebar"><div className="sideLogo">{settings.academyName}</div><button className={tab==="overview"?"active":""} onClick={()=>setTab("overview")}>Overview</button><button className={tab==="registrations"?"active":""} onClick={()=>setTab("registrations")}>Students</button><button className={tab==="portfolio"?"active":""} onClick={()=>setTab("portfolio")}>My Work</button><button className={tab==="studentwork"?"active":""} onClick={()=>setTab("studentwork")}>Student Work</button><button className={tab==="settings"?"active":""} onClick={()=>setTab("settings")}>Website Settings</button><button onClick={exit}>View Website</button></aside>
  <main className="adminMain"><div className="adminTop"><div><div className="eyebrow">ADMIN DASHBOARD</div><h1>{tab==="overview"?"Academy Overview":tab==="registrations"?"Student Management":tab==="portfolio"?"My Work":tab==="studentwork"?"Student Work":"Website Settings"}</h1></div>{toast&&<div className="toast">{toast}</div>}</div>
  {tab==="overview"&&<><div className="statGrid"><Stat t="Registered Students" v={stats.students}/><Stat t="Paid Students" v={stats.paid}/><Stat t="Pending Payments" v={stats.pending}/><Stat t="Total Revenue" v={`GH₵${stats.revenue}`}/></div><div className="adminPanel"><h2>Quick actions</h2><div className="quick"><button onClick={()=>setTab("portfolio")}>Upload My Work</button><button onClick={()=>setTab("studentwork")}>Add Student Work</button><button onClick={()=>setTab("registrations")}>View Registrations</button><button onClick={()=>setTab("settings")}>Edit Academy</button></div></div></>}
  {tab==="settings"&&<Settings draft={draft} setDraft={setDraft} save={saveSettings}/>}
  {tab==="portfolio"&&<PortfolioAdmin items={portfolio} setItems={setPortfolio} notify={notify}/>}
  {tab==="studentwork"&&<StudentAdmin items={students} setItems={setStudents} notify={notify}/>}
  {tab==="registrations"&&<RegistrationAdmin items={registrations} setItems={setRegistrations} notify={notify}/>}
  </main></div>
}

function Stat({t,v}){return <div className="stat"><small>{t}</small><strong>{v}</strong></div>}

function Settings({draft,setDraft,save}){
  const fields=[["academyName","Academy Name"],["instructor","Instructor Name"],["phone","Phone"],["whatsapp","WhatsApp"],["email","Email"],["location","Location"],["fee","Course Fee (GH₵)"],["duration","Duration"],["days","Class Days"],["time","Class Time"],["status","Registration Status"],["heroImage","Hero Image URL"]];
  const update=e=>setDraft({...draft,[e.target.name]:e.target.value});
  return <div className="adminPanel"><div className="adminForm">{fields.map(([n,l])=><label key={n}>{l}<input name={n} value={draft[n]||""} onChange={update}/></label>)}</div><button className="button primary" onClick={save}>SAVE SETTINGS</button><p className="hint">For the hero image, paste a public image URL. Uploaded local image management can be added when connecting this frontend to a server/database.</p></div>
}

function PortfolioAdmin({items,setItems,notify}){
  const [f,setF]=useState({title:"",category:"Flyers",image:"",description:"",featured:false});
  const add=e=>{e.preventDefault();setItems([...items,{...f,id:Date.now()}]);setF({title:"",category:"Flyers",image:"",description:"",featured:false});notify("Portfolio project added.")};
  const remove=id=>setItems(items.filter(x=>x.id!==id));
  return <div><div className="adminPanel"><h2>Add design project</h2><form className="adminForm" onSubmit={add}><label>Project Title<input required value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></label><label>Category<input value={f.category} onChange={e=>setF({...f,category:e.target.value})}/></label><label>Image URL<input value={f.image} onChange={e=>setF({...f,image:e.target.value})}/></label><label>Description<textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></label><label className="check"><input type="checkbox" checked={f.featured} onChange={e=>setF({...f,featured:e.target.checked})}/> Featured on homepage</label><button className="button primary">ADD PROJECT</button></form></div><div className="adminList">{items.map(x=><div className="listRow" key={x.id}><div><b>{x.title}</b><span>{x.category} · {x.featured?"Featured":"Not featured"}</span></div><button onClick={()=>remove(x.id)}>Delete</button></div>)}</div></div>
}

function StudentAdmin({items,setItems,notify}){
  const [f,setF]=useState({name:"",title:"",category:"Flyers",image:"",approved:false});
  const add=e=>{e.preventDefault();setItems([...items,{...f,id:Date.now()}]);setF({name:"",title:"",category:"Flyers",image:"",approved:false});notify("Student work added.")};
  return <div><div className="adminPanel"><h2>Add student project</h2><form className="adminForm" onSubmit={add}><label>Student Name<input required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></label><label>Project Title<input required value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></label><label>Category<input value={f.category} onChange={e=>setF({...f,category:e.target.value})}/></label><label>Image URL<input value={f.image} onChange={e=>setF({...f,image:e.target.value})}/></label><label className="check"><input type="checkbox" checked={f.approved} onChange={e=>setF({...f,approved:e.target.checked})}/> Approved for public display</label><button className="button primary">ADD STUDENT WORK</button></form></div><div className="adminList">{items.map(x=><div className="listRow" key={x.id}><div><b>{x.title}</b><span>{x.name} · {x.approved?"Approved":"Hidden"}</span></div><button onClick={()=>setItems(items.filter(y=>y.id!==x.id))}>Delete</button></div>)}</div></div>
}

function RegistrationAdmin({items,setItems,notify}){
  const update=(id,status)=>{setItems(items.map(x=>x.id===id?{...x,paymentStatus:status}:x));notify("Payment status updated.")};
  return <div className="adminPanel"><h2>Registrations</h2>{!items.length?<div className="empty">No registrations yet.</div>:<div className="tableWrap"><table><thead><tr><th>Registration</th><th>Name</th><th>Phone</th><th>Class</th><th>Payment</th><th>Action</th></tr></thead><tbody>{items.map(x=><tr key={x.id}><td>{x.reg}</td><td>{x.fullName}</td><td>{x.phone}</td><td>{x.className}</td><td>{x.paymentStatus}</td><td><select value={x.paymentStatus} onChange={e=>update(x.id,e.target.value)}><option>Pending</option><option>Paid</option><option>Partially Paid</option><option>Cancelled</option></select></td></tr>)}</tbody></table></div>}</div>
}

createRoot(document.getElementById("root")).render(<App/>);
