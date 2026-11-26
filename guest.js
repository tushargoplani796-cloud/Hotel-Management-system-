 GUESTS: register, edit, search, delete guests
// ---------- GUESTS ----------
let gq='';
function guests(){
  const e=db.guests.find(g=>g.id==editG)||{};
  return `<h2>Guest Management</h2><div class="box"><h3>${editG?'Edit':'Register'} Guest</h3><div class="grid">
  <div><label>Name</label><input id="gname" value="${esc(e.name)}"></div>
  <div><label>Phone (10 digits)</label><input id="gph" value="${esc(e.phone)}"></div>
  <div><label>Email</label><input id="gem" type="email" value="${esc(e.email)}"></div>
  <div><label>ID Proof</label><input id="gid" value="${esc(e.idp)}"></div>
  <div><label>Address</label><input id="gad" value="${esc(e.addr)}"></div>
  <div><button class="btn g" onclick="saveGuest()">${editG?'Update':'Add Guest'}</button></div></div></div>
  <div class="box"><input placeholder="Search name or phone" value="${esc(gq)}" oninput="gq=this.value;$('gt').innerHTML=gtable()" style="margin-bottom:10px">
  <div id="gt">${gtable()}</div></div>`;
}
function gtable(){
  const q=gq.toLowerCase(),L=db.guests.filter(g=>g.name.toLowerCase().includes(q)||g.phone.includes(q)).reverse();
  return `<table><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>ID Proof</th><th>Address</th><th>Actions</th></tr>
  ${L.map(g=>`<tr><td>${g.id}</td><td>${esc(g.name)}</td><td>${esc(g.phone)}</td><td>${esc(g.email)}</td><td>${esc(g.idp)}</td><td>${esc(g.addr)}</td>
  <td><button class="btn s" onclick="editG=${g.id};render()">Edit</button>${isAdmin()?`<button class="btn s r" onclick="delGuest(${g.id})">Delete</button>`:''}</td></tr>`).join('')}</table>`;
}
function saveGuest(){
  const o={name:$('gname').value.trim(),phone:$('gph').value.trim(),email:$('gem').value.trim(),idp:$('gid').value.trim(),addr:$('gad').value.trim()};
  if(!o.name)return alert('Name required'); if(!/^[0-9]{10}$/.test(o.phone))return alert('Enter a valid 10-digit phone number');
  if(editG)Object.assign(db.guests.find(g=>g.id==editG),o); else db.guests.push({id:++db.seq,...o});
  save();editG=null;flash('Guest saved.');render();
}
function delGuest(id){if(!confirm('Delete guest and their bookings?'))return;db.guests=db.guests.filter(g=>g.id!=id);db.bookings=db.bookings.filter(b=>b.g!=id);save();