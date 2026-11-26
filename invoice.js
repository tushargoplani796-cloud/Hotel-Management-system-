---------- INVOICE ----------
function invoice(){
  const b=db.bookings.find(x=>x.id==invId);if(!b)return '<p>Booking not found</p>';
  const g=db.guests.find(x=>x.id==b.g)||{},r=db.rooms.find(x=>x.id==b.r)||{},n=nights(b.ci,b.co),gst=Math.round(b.amt*12)/100;
  return `<div class="box invoice" style="max-width:720px;margin:auto"><h2>ðŸ¨ Grand Stay Hotel - Invoice</h2>
  <p>Invoice No: <b>INV-${String(b.id).padStart(5,'0')}</b> &nbsp; Date: ${new Date().toLocaleDateString('en-IN')}</p>
  <p><b>Guest:</b> ${esc(g.name)}<br>Phone: ${esc(g.phone)}<br>Email: ${esc(g.email)}<br>${esc(g.addr)}</p>
  <table style="min-width:0"><tr><th>Description</th><th>Nights</th><th>Rate</th><th>Amount</th></tr>
  <tr><td>Room ${r.no} (${r.type})<br><small>${b.ci} to ${b.co}</small></td><td>${n}</td><td>${fmt(r.price)}</td><td>${fmt(b.amt)}</td></tr>
  <tr><td colspan=3 align=right>GST (12%)</td><td>${fmt(gst)}</td></tr>
  <tr><td colspan=3 align=right><b>Grand Total</b></td><td><b>${fmt(b.amt+gst)}</b></td></tr></table>
  <p>Status: <span class="badge ${b.status}">${b.status}</span></p>
  <p class="noprint"><button class="btn" onclick="window.print()">ðŸ–¨ Print Invoice</button> <button class="btn" onclick="go('book')">Back</button></p></div>`;
}