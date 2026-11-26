DASHBOARD: statistics and recent bookings
function dash(){
  const R=db.rooms,occ=R.filter(r=>r.status=='Occupied').length,av=R.filter(r=>r.status=='Available').length;
  const rev=db.bookings.filter(b=>b.status=='Checked-Out').reduce((s,b)=>s+b.amt,0);
  const today=new Date().toISOString().slice(0,10),arr=db.bookings.filter(b=>b.ci==today&&b.status=='Booked').length;
  const rec=[...db.bookings].reverse().slice(0,6);
  return `<h2>Dashboard</h2><div class="cards">
  <div class="card">Total Rooms<b>${R.length}</b></div><div class="card g">Available<b>${av}</b></div>
  <div class="card r">Occupied<b>${occ}</b></div><div class="card y">Occupancy<b>${R.length?Math.round(occ*100/R.length):0}%</b></div>
  <div class="card">Guests<b>${db.guests.length}</b></div><div class="card y">Arrivals Today<b>${arr}</b></div>
  <div class="card g">Revenue<b>${fmt(rev)}</b></div></div>
  <div class="box"><h3>Recent Bookings</h3><table><tr><th>#</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th></tr>
  ${rec.map(b=>`<tr><td>${b.id}</td><td>${esc(gn(b.g))}</td><td>${rn(b.r)}</td><td>${b.ci}</td><td>${b.co}</td><td>${fmt(b.amt)}</td><td><span class="badge ${b.status}">${b.status}</span></td></tr>`).join('')||'<tr><td colspan=7>No bookings yet</td></tr>'}</table></div>`;
}
const gn=id=>(db.guests.find(g=>g.id==id)||{name:'(deleted)'}).name, rn=id=>(db.rooms.find(r=>r.id==id)||{no:'?'})