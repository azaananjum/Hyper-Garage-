const services = [
  {id:1,name:"Periodic Engine Maintenance",price:15000,time:"3 hours",desc:"Synthetic engine oil swap, oil filter and air filter cleaning.",icon:"fa-oil-can"},
  {id:2,name:"OBD Digital Computer Tuning",price:4500,time:"1.5 hours",desc:"Computerized scanner diagnostic test and ECU sensor calibration.",icon:"fa-gauge-high"},
  {id:3,name:"AC Climate Servicing",price:6000,time:"2 hours",desc:"Refrigerant gas top-up and cooling coil flushing.",icon:"fa-snowflake"},
  {id:4,name:"Mobile Puncture Rescue",price:800,time:"30 minutes",desc:"On-site tubeless tyre puncture fix and digital pressure check.",icon:"fa-circle-dot"},
  {id:5,name:"Brake Pad Replacement",price:5500,time:"1 hour",desc:"Front or rear high-friction brake pad installation.",icon:"fa-car-burst"}
];
const products = [
  {id:1,name:"Civic & Corolla Headlight Pair",price:18000,rating:4.9,image:"https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"},
  {id:2,name:"Ceramic Quick Detailer Spray",price:2800,rating:4.9,image:"https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80"},
  {id:3,name:"Sports High-Flow Air Filter",price:4500,rating:4.8,image:"https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80"},
  {id:4,name:"Digital Portable Tire Inflator",price:6500,rating:4.9,image:"https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80"}
];
const mechanics = [
  {id:1,name:"Hyper Garage DHA Hub",location:"DHA",address:"Phase 6, Tauheed Commercial, Karachi",phone:"0321-2345678",rating:4.9,specialty:"EFI & Engine Tuning",image:"https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"RedLine Pitstop",location:"Shahrah-e-Faisal",address:"Near FTC Building, Karachi",phone:"0300-9876543",rating:4.8,specialty:"Brakes & Quick Servicing",image:"https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Bismillah Auto Mechanics",location:"Gulshan",address:"Block 4, University Road, Karachi",phone:"0333-5544332",rating:4.7,specialty:"Suspension & Steering Setup",image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Super Auto Tech",location:"North Nazimabad",address:"Block H, Hyderi Market, Karachi",phone:"0312-1122334",rating:4.9,specialty:"Computer Scans & Wiring",image:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80"}
];
const money = n => `Rs. ${Number(n).toLocaleString("en-PK")}`;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let cart = load("hg-cart",[]);
let selectedMechanic = mechanics[0];
let toastTimer;

function load(key,fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}}
function save(key,value){localStorage.setItem(key,JSON.stringify(value))}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
const pageMeta={home:["Garage overview","Everything your vehicle needs, in one place."],services:["Automotive services","Workshop packages and maintenance options."],products:["Parts & gear","A curated sample catalogue for your vehicle."],mechanics:["Garages & SOS","Browse the sample Karachi service directory."],chat:["Mechanic support","Get quick answers from the local demo assistant."],booking:["Appointments","Create and review your service requests."]};
function switchTab(tab){
  if(!pageMeta[tab])return;
  $$(".tab-panel").forEach(el=>el.classList.toggle("active",el.id===`tab-${tab}`));
  $$(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.tab===tab));
  $("#page-title").innerHTML=`${pageMeta[tab][0]}<span>.</span>`;$("#page-subtitle").textContent=pageMeta[tab][1];
  $("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-tab]").forEach(el=>el.addEventListener("click",()=>switchTab(el.dataset.tab)));
$("#menu-toggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
document.addEventListener("click",e=>{if($("#sidebar").classList.contains("open")&&!e.target.closest("#sidebar")&&!e.target.closest("#menu-toggle"))$("#sidebar").classList.remove("open")});

function renderServices(){
  $("#services-grid").innerHTML=services.map(s=>`<article class="service-card"><div class="service-top"><span class="service-icon"><i class="fa-solid ${s.icon}"></i></span><strong class="service-price">${money(s.price)}</strong></div><h3>${s.name}</h3><p>${s.desc}</p><div class="service-bottom"><span><i class="fa-regular fa-clock"></i> ${s.time}</span><button class="button button-primary" data-book-service="${s.id}">Book service <i class="fa-solid fa-arrow-right"></i></button></div></article>`).join("");
}
function renderProducts(list=products){
  $("#product-count").textContent=`${list.length} item${list.length===1?"":"s"}`;
  $("#products-grid").innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="rating"><i class="fa-solid fa-star"></i> ${p.rating}</span></div><div class="product-info"><h3>${p.name}</h3><strong>${money(p.price)}</strong><button class="button button-outline" data-add="${p.id}"><i class="fa-solid fa-plus"></i> Add to cart</button></div></article>`).join(""):`<div class="empty-state">No products match your search.</div>`;
}
function renderMechanics(){
  const zone=$("#location-filter").value,query=$("#mechanic-search").value.trim().toLowerCase();
  const list=mechanics.filter(m=>(zone==="all"||m.location===zone)&&`${m.name} ${m.specialty} ${m.address}`.toLowerCase().includes(query));
  $("#mechanics-grid").innerHTML=list.length?list.map(m=>`<article class="mechanic-card"><div class="mechanic-image"><img src="${m.image}" alt="${m.name}" loading="lazy"><span class="zone-pill">${m.location}</span><span class="online-pill"><i class="fa-solid fa-circle"></i> Listed</span></div><div class="mechanic-body"><div class="mechanic-title"><h3>${m.name}</h3><span class="rating-text"><i class="fa-solid fa-star"></i> ${m.rating}</span></div><p class="specialty"><i class="fa-solid fa-wrench"></i> ${m.specialty}</p><p class="address"><i class="fa-solid fa-location-dot"></i> ${m.address}</p><div class="mechanic-actions"><a class="button button-outline" href="tel:${m.phone}"><i class="fa-solid fa-phone"></i> ${m.phone}</a><button class="button button-primary" data-chat="${m.id}"><i class="fa-solid fa-comments"></i> Chat</button></div></div></article>`).join(""):`<div class="empty-state">No garages found for this filter.</div>`;
}
function updateCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);$("#cart-badge").textContent=count;
  $("#cart-items").innerHTML=cart.length?cart.map(item=>`<div class="cart-row"><img src="${item.image}" alt=""><div class="cart-row-info"><strong>${item.name}</strong><small>${money(item.price)} each</small></div><div class="qty-control"><button data-qty="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button><b>${item.qty}</b><button data-qty="${item.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div>`).join(""):`<div class="empty-state"><i class="fa-solid fa-bag-shopping"></i><p>Your cart is empty.</p><small>Add an item from the parts store to get started.</small></div>`;
  $("#cart-total").textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));save("hg-cart",cart);
}
function openCart(){updateCart();$("#cart-drawer").classList.add("open");$("#cart-backdrop").classList.remove("hidden");$("#cart-drawer").setAttribute("aria-hidden","false")}
function closeCart(){$("#cart-drawer").classList.remove("open");$("#cart-backdrop").classList.add("hidden");$("#cart-drawer").setAttribute("aria-hidden","true")}
$("#cart-open").addEventListener("click",openCart);$("#products-cart").addEventListener("click",openCart);$("#cart-close").addEventListener("click",closeCart);$("#cart-backdrop").addEventListener("click",closeCart);
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});updateCart();toast(`${p.name} added to cart`)}
function renderContacts(){
  $("#chat-contacts").innerHTML=mechanics.map(m=>`<button class="contact-button ${selectedMechanic.id===m.id?"active":""}" data-contact="${m.id}"><span class="avatar">${m.name.split(" ").slice(0,2).map(x=>x[0]).join("")}</span><span>${m.name}</span></button>`).join("");
  $("#chat-name").textContent=selectedMechanic.name;$("#chat-specialty").textContent=`${selectedMechanic.specialty} · ${selectedMechanic.location}`;
  $("#chat-avatar").textContent=selectedMechanic.name.split(" ").slice(0,2).map(x=>x[0]).join("");
}
function addMessage(text,type="bot"){
  const el=document.createElement("div");el.className=`message ${type}`;el.textContent=text;
  const time=document.createElement("small");time.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});el.append(time);
  $("#chat-messages").append(el);$("#chat-messages").scrollTop=$("#chat-messages").scrollHeight;
}
function selectMechanic(id){selectedMechanic=mechanics.find(m=>m.id===id)||mechanics[0];renderContacts();$("#chat-messages").innerHTML="";addMessage(`Assalam-o-Alaikum! Welcome to ${selectedMechanic.name}. Ask about services, prices, punctures or our location.`)}
function replyFor(message){
  const t=message.toLowerCase();
  if(/puncture|tyre|tire|air/.test(t))return "Mobile puncture service ka listed demo rate Rs. 800 hai. Availability and final charges phone par confirm karein.";
  if(/oil|tuning|maintenance|service/.test(t))return "Periodic engine maintenance ka sample package Rs. 15,000 se listed hai. Is mein oil and filter checks shamil hain. Workshop se details confirm karein.";
  if(/ac|gas|cooling/.test(t))return "AC climate servicing ka sample listed rate Rs. 6,000 hai. Vehicle inspection ke baad final estimate lein.";
  if(/location|kahan|address|where/.test(t))return `${selectedMechanic.name}: ${selectedMechanic.address}. Contact: ${selectedMechanic.phone}.`;
  if(/price|cost|rate|charge/.test(t))return "Sample rates Services section mein available hain. Final price vehicle inspection and parts availability ke mutabiq change ho sakti hai.";
  return "Ji, apni car ka model aur issue detail share karein. Yeh local demo assistant hai; urgent repair ke liye listed garage ko direct call karein.";
}
$("#chat-form").addEventListener("submit",e=>{e.preventDefault();const input=$("#chat-input"),msg=input.value.trim();if(!msg)return;addMessage(msg,"user");input.value="";const answer=replyFor(msg);setTimeout(()=>addMessage(answer),450)});
function renderBookings(){
  const bookings=load("hg-bookings",[]);
  $("#booking-list").innerHTML=bookings.length?bookings.slice().reverse().map(b=>`<article class="booking-item"><strong>${escapeHTML(b.service)}</strong><p>${escapeHTML(b.name)} · ${escapeHTML(b.car)}<br>${escapeHTML(b.phone)}${b.date?` · ${escapeHTML(b.date)}`:""}</p><span><i class="fa-solid fa-circle-check"></i> Saved on this device</span></article>`).join(""):`<div class="empty-state">No appointment requests yet.</div>`;
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
$("#booking-form").addEventListener("submit",e=>{
  e.preventDefault();const booking={name:$("#book-name").value.trim(),phone:$("#book-phone").value.trim(),service:$("#book-service-type").value,car:$("#book-car").value.trim(),date:$("#book-date").value,notes:$("#book-notes").value.trim(),createdAt:new Date().toISOString()};
  const list=load("hg-bookings",[]);list.push(booking);save("hg-bookings",list);e.target.reset();renderBookings();toast("Appointment request saved on this device");
});
$("#services-grid").addEventListener("click",e=>{const button=e.target.closest("[data-book-service]");if(!button)return;$("#book-service-type").value=services.find(s=>s.id===Number(button.dataset.bookService)).name;switchTab("booking")});
$("#products-grid").addEventListener("click",e=>{const button=e.target.closest("[data-add]");if(button)addToCart(Number(button.dataset.add))});
$("#mechanics-grid").addEventListener("click",e=>{const button=e.target.closest("[data-chat]");if(button){selectMechanic(Number(button.dataset.chat));switchTab("chat")}});
$("#chat-contacts").addEventListener("click",e=>{const button=e.target.closest("[data-contact]");if(button)selectMechanic(Number(button.dataset.contact))});
$("#cart-items").addEventListener("click",e=>{const button=e.target.closest("[data-qty]");if(!button)return;const item=cart.find(x=>x.id===Number(button.dataset.qty));if(!item)return;item.qty+=Number(button.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);updateCart()});
$("#checkout-button").addEventListener("click",()=>{if(!cart.length){toast("Your cart is empty");return}toast("Demo order placed — no payment collected");cart=[];updateCart();closeCart()});
$("#product-search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)))});
$("#mechanic-search").addEventListener("input",renderMechanics);$("#location-filter").addEventListener("change",renderMechanics);
$("#fuel-liters").addEventListener("input",e=>{const litres=Math.max(0,Number(e.target.value)||0);$("#fuel-total").textContent=money(Math.round(litres*278.4))});
const obdCodes={
  P0300:{title:"Random / multiple cylinder misfire",risk:"High risk",desc:"The engine control module detected random or multiple cylinder misfires.",fix:"Have ignition coils, spark plugs, fuel delivery and compression checked."},
  P0420:{title:"Catalyst system efficiency below threshold",risk:"Medium risk",desc:"Catalyst efficiency is below the expected threshold; an oxygen sensor or exhaust issue may also be involved.",fix:"Inspect exhaust leaks, oxygen sensor readings and catalytic converter condition."},
  P0171:{title:"System too lean — Bank 1",risk:"Medium risk",desc:"The engine is detecting too much air or insufficient fuel on bank 1.",fix:"Inspect intake and vacuum leaks, MAF sensor and fuel pressure."}
};
$("#obd-form").addEventListener("submit",e=>{e.preventDefault();const code=$("#obd-input").value.trim().toUpperCase(),box=$("#obd-result");if(!code){toast("Enter an OBD-II code first");return}const data=obdCodes[code];box.classList.remove("hidden");box.replaceChildren();const title=document.createElement("strong");title.textContent=`${code} — ${data?.title||"Code not in the sample database"}`;const p=document.createElement("p");p.textContent=data?.desc||"This prototype does not have a verified description for this code. Use a trusted vehicle-specific diagnostic reference.";const fix=document.createElement("p");fix.textContent=`Suggested next step: ${data?.fix||"Ask a qualified technician to inspect the vehicle and verify the code."} Severity: ${data?.risk||"Unknown"}.`;box.append(title,p,fix)});
function updateClock(){const now=new Date();$("#clock").textContent=now.toLocaleString([],{weekday:"short",hour:"2-digit",minute:"2-digit"});$("#year").textContent=now.getFullYear()}
renderServices();renderProducts();renderMechanics();updateCart();renderBookings();selectMechanic(1);updateClock();setInterval(updateClock,30000);
