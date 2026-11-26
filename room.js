function rooms(){
  const e=db.rooms.find(r=>r.id==editR)||{};
  const opt=(a,v)=>a.map(x=>`<option ${x==v?'selected':''}>${x}</option>`).join('');
  return `<h2>Room Management</h2><div class="box"><h3>${editR?'Edit':'Add'} Room</h3><div class="grid">
  <div><label>Room No</label><input id="rno" value="${esc(e.no)}"></div>
  <div><label>Type</label><select id="rty">${opt(['Single','Double','Deluxe','Suite'],e.type)}</select></div>
  <div><label>Price / night (â‚¹)</label><input id="rpr" type="number" value="${e.price||''}"></div>
  <div><label>Status</label><select id="rst">${opt(['Available','Occupied','Maintenance'],e.status)}</select></div>
  <div><button class="btn g" onclick="saveRoom()">${editR?'Update':'Add Room'}</button></div></div></div>
  <div class="box"><table><tr><th>Room</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr>
  ${db.rooms.map(r=>`<tr><td><b>${esc(r.no)}</b></td><td>${r.type}</td><td>${fmt(r.price)}</td><td><span class="badge ${r.status}">${r.status}</span></td>
  <td><button class="btn s" onclick="editR=${r.id};render()">Edit</button>${isAdmin()?`<button class="btn s r" onclick="delRoom(${r.id})">Delete</button>`:''}</td></tr>`).join('')}</table></div>`;
}
function saveRoom(){
  const 