BOOKINGS: new booking, check-in, check-out, cancel
// ---------- BOOKINGS ----------
function book(){
  const today=new Date().toISOString().slice(0,10);
  return `<h2>Bookings, Check-in &amp; Check-out</h2><div class="box"><h3>New Booking</h3><div class="grid">
  <div><label>Guest</label><select id="bg">${db.guests.map(g=>`<option value="${g.id}">${esc(g.name)} (${g.phone})</option>`).join('')}</select></div>
  <div><label>Room</label><select id="br" onchange="calc()">${db.rooms.filter(r=>r.status!='Maintenance').map(r=>`<option value="${r.id}">${r.no} - ${r.type} (${fmt(r.price)})</option>`).join('')}</select></div>
  <div><label>Check-in</label><input type="date" id="bci" min="${today}" onchange="calc()"></div>
  <div><label>Check-out</label><input type="date" id="bco" min="${today}" onchange="calc()"></div>
  <div><label>Estimated Total</label><input id="btot" readonly value="â‚¹0"></div>
  <div><button class="btn g" onclick="saveBooking()">Book Room</button></div></div></div>
  <div class="box"><table><tr><th>#</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
  ${[...db.bookings].reverse().map(b=>`<tr><td>${b.id}</td><td>${esc(gn(b.g))}</td><td>${rn(b.r)}</td><td>${b.ci}</td><td>${b.co}</td><td>${fmt(b.amt)}</td>
  <td><span class="badge ${b.status}">${b.status}</span></td><td>
  ${b.status=='Booked'?`<button class="btn s g" onclick="act(${b.id},'in')">Check-in</button><button class="btn s r" onclick="act(${b.id},'cancel')">Cancel</button>`:''}
  ${b.status=='Checked-In'?`<button class="btn s y" onclick="act(${b.id},'out')">Check-out</button>`:''}
  ${b.status=='Checked-Out'?`<button class="btn s" onclick="invId=${b.id};go('invoice')">Invoice</button>`:''}</td></tr>`).join('')||'<tr><td colspan=8>No bookings yet</td></tr>'}</table></div>`;
}
const nights=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
function calc(){
  if(!$('bci'))return;const n=nights($('bci').value,$('bco').value),r=db.rooms.find(r=>r.id==$('br').value);
  $('btot').value=(n>0&&r)?fmt(n*r.price)+' ('+n+' nights)':'â‚¹0';
}
function saveBooking(){
  const g=+$('bg').value,r=+$('br').value,ci=$('bci').value,co=$('bco').value;
  if(!g||!r)return alert('Select guest and room'); if(!ci||!co)return alert('Select both dates');
  const n=nights(ci,co); if(n<1)return alert('Check-out must be after check-in');
  const clash=db.bookings.some(b=>b.r==r&&['Booked','Checked-In'].includes(b.status)&&!(b.co<=ci||b.ci>=co));
  if(clash){flash('Room is already booked for these dates.',true);return render()}
  const room=db.rooms.find(x=>x.id==r);
  db.bookings.push({id:++db.seq,g,r,ci,co,amt:n*room.price,status:'Booked'});
  save();flash(`Booking created: ${n} night(s), ${fmt(n*room.price)}`);render();
}
function act(id,a){
  const b=db.bookings.find(x=>x.id==id),room=db.rooms.find(r=>r.id==b.r);
  if(a=='in'){b.status='Checked-In';room.status='Occupied';flash('Guest checked in.')}
  if(a=='cancel'){if(!confirm('Cancel booking?'))return;b.status='Cancelled';flash('Booking cancelled.')}
  if(a=='out'){if(!confirm('Check out and generate bill?'))return;b.status='Checked-Out';room.status='Available';save();invId=id;return go('invoice')}
  save();render();