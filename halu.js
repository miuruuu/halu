(function(){
var K='halu-state',mem={pt:0,tx:[]};
function load(){try{var s=JSON.parse(localStorage.getItem(K));if(s&&typeof s.pt==='number'&&Array.isArray(s.tx))return s}catch(e){}return mem}
function save(s){mem=s;try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
function fmt(n){return Math.abs(n).toLocaleString('id-ID')}
function esc(t){var d=document.createElement('div');d.textContent=String(t==null?'':t);return d.innerHTML}
var BLN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
var HARI=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
function tgl(ts){var d=new Date(ts);return d.getDate()+' '+BLN[d.getMonth()]+' '+d.getFullYear()}
function hari(ts){var d=new Date(ts);return HARI[d.getDay()]+', '+String(d.getDate()).padStart(2,'0')+' '+BLN[d.getMonth()]+' '+d.getFullYear()}
function jam(ts){var d=new Date(ts);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+' WIB'}
function toast(m){var t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},2600)}
function $(i){return document.getElementById(i)}
var SAMPLE={id:'20261110-VCHALU-196',kind:'vc',title:'Senyum Halu Collection',amount:-120000,ts:Date.UTC(2026,10,10,12,12),method:'HALU_POINT',member:'Nur Intan',sesi:1,jalur:4,time:'16:30 - 17:30 WIB',date:'24 November 2026',tukar:'16:15 - 16:45 WIB',sample:1};
function find(id){var s=load();for(var i=0;i<s.tx.length;i++)if(s.tx[i].id===id)return s.tx[i];return id===SAMPLE.id||!id?SAMPLE:null}
function nextId(kind,code){var d=new Date(),p=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');return p+'-'+code+'-'+(load().tx.length+1)}
function plain(t){return t.kind==='topup'||t.kind==='ofc'||t.kind==='lib'}
function before(t){var a=(+t.slice(0,2))*60+(+t.slice(3,5))-30;function f(x){return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0')}return f(a)+' - '+f(a+30)+' WIB'}
var H={plain:plain,fmt:fmt,esc:esc,toast:toast,load:load,save:save,nextId:nextId,tgl:tgl,hari:hari,jam:jam,find:find,SAMPLE:SAMPLE,
home:function(){var s=load();$('pt').textContent=fmt(s.pt);var n=s.tx.filter(function(t){return !plain(t)}).length;$('nt').textContent=n;
var b='',seed=7000100;for(var i=0;i<46;i++){seed=(seed*1103515245+12345)&0x7fffffff;b+='<i style="width:'+(1+seed%3)+'px"></i>'}$('bc').innerHTML=b;
var l=s.tx.filter(function(t){return !plain(t)}).slice(0,5);$('upt').innerHTML=l.length?l.map(function(t){return '<tr><td>'+t.sesi+'</td><td>'+esc(t.title)+'</td><td>'+esc(t.date)+'</td><td>'+esc(t.member)+'</td><td>'+(t.qty||1)+'</td><td>0</td><td><a class="go" href="tiket-vc.html?id='+encodeURIComponent(t.id)+'">→</a></td></tr>'}).join(''):'<tr><td colspan="7" style="text-align:center;color:#888;padding:22px">Data Not Available.</td></tr>'},
topup:function(){var amt=0,met='Transfer Halu',inp=$('amt');function sum(){$('tot').textContent='Rp 0';inp.value=amt?fmt(amt):'';}
document.querySelectorAll('.tp-chips button').forEach(function(b){b.onclick=function(){amt=+b.dataset.v;document.querySelectorAll('.tp-chips button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');sum()}});
inp.oninput=function(){document.querySelectorAll('.tp-chips button').forEach(function(x){x.classList.remove('on')});amt=Math.min(+(inp.value.replace(/\D/g,''))||0,100000000);sum()};
document.querySelectorAll('.tp-m button').forEach(function(b){b.onclick=function(){met=b.textContent;document.querySelectorAll('.tp-m button').forEach(function(x){x.classList.remove('on')});b.classList.add('on')}});
$('go').onclick=function(){if(amt<=0){toast('Isi jumlah poin dulu');return}var s=load();s.pt+=amt;var id=nextId('topup','HALUPOINT');s.tx.unshift({id:id,kind:'topup',title:'Pembelian Poin Halu',amount:amt,ts:Date.now(),method:met});save(s);toast('+'+fmt(amt)+' Halu Point masuk (gratis!)');setTimeout(function(){location.href='riwayat.html'},900)}},
riwayat:function(){var s=load(),box=$('list'),f=$('flt');if(f&&!f.dataset.w){f.dataset.w=1;f.onchange=function(){H.riwayat()}}var fv=f?f.value:'';s={pt:s.pt,tx:s.tx.filter(function(t){return !fv||t.kind===fv})};if(!s.tx.length){box.innerHTML='<p class="empty">Belum ada transaksi.<br><a href="topup.html">Isi Halu Point dulu</a> atau lihat <a href="invoice.html">contoh invoice</a>.</p>';return}var day='',h='';s.tx.forEach(function(t){var d=hari(t.ts);if(d!==day){day=d;h+='<div class="tx-day">'+esc(d)+'</div>'}h+='<a class="tx" href="invoice.html?id='+encodeURIComponent(t.id)+'"><span class="ic"></span><div>'+esc(t.title)+'<small>'+esc(t.id)+'</small></div><div style="flex:none;text-align:right"><b class="'+(t.amount<0?'m':'p')+'">'+(t.amount<0?'- ':'+ ')+fmt(t.amount)+'</b><small>'+esc(t.method)+'</small></div></a>'});box.innerHTML=h},
invoice:function(){var id=new URLSearchParams(location.search).get('id'),t=find(id);if(!t){$('card').innerHTML='<p class="empty">Transaksi tidak ditemukan.</p>';return}
$('it').textContent=t.title;$('ir').innerHTML=t.kind==='topup'?'<span>Halu Point</span><span>'+(t.qty||1)+'×</span>':'<span>'+esc(t.member)+' - Sesi '+t.sesi+' - Jalur '+t.jalur+'</span><span>'+(t.qty||1)+'×</span>';
$('ib').innerHTML='<div><span>Status</span><span class="inv-ok">Lunas</span></div><div><span>Metode Pembayaran</span><span>'+esc(t.method)+'</span></div><div><span>Tanggal</span><span>'+tgl(t.ts)+'</span></div><div><span>Waktu</span><span>'+jam(t.ts)+'</span></div><div><span>ID Transaksi</span><span>'+esc(t.id)+'</span></div>';
$('itot').textContent=fmt(t.amount)+(t.kind==='topup'?' (gratis)':'');
if(!plain(t)){$('tk').hidden=false;$('tk').href='tiket-vc.html?id='+encodeURIComponent(t.id)}},
tiket:function(){var id=new URLSearchParams(location.search).get('id'),t=find(id);if(!t||plain(t)){$('tbox').innerHTML='<p class="empty">Tiket tidak ditemukan.</p>';return}
var mng=t.kind==='mng'||t.kind==='2s';$('tt').textContent=t.title;$('tb').textContent={mng:'Meet and Greet','2s':'2-Shot',vc:'Video Call'}[t.kind];$('td').textContent=tgl(t.ts);
$('tg').innerHTML=[['Tanggal Show',t.date],['Waktu Show',t.time],['Penukaran Tiket',t.tukar],['Jalur Masuk','Jalur '+t.jalur],['Jumlah Tiket',(t.qty||1)+' Tiket'],['Tiket Terpakai','0 Tiket'],['ID Transaksi',t.id]].map(function(r){return '<div><small>'+r[0]+'</small><b>'+esc(r[1])+'</b></div>'}).join('')+'<div><small>Status Pembayaran</small><span class="tk-ok">✓ Lunas</span></div><div class="tk-full"><small>'+(mng?'Catatan':'Link Video Call')+'</small><span class="tk-link">'+(mng?''+(t.kind==='2s'?'Datang ke area 2-shot halu, bawa properti khayalanmu, lalu foto bareng member pilihanmu.':'Tukar photocard di loket halu, lalu antre di jalur member pilihanmu (10 detik, khayalan).')+'':'https://halu.example/vc/contoh-ruang-halu (ID Rapat: 000 0000 0000, Kode Sandi: halu00)')+'</span></div>';
$('tm').textContent=t.member;document.querySelector('.tk-head i').textContent='Sesi '+t.sesi;$('ti').href='invoice.html?id='+encodeURIComponent(t.id)},
buy:function(kind){var PR={mng:60000,vc:120000,'2s':100000},TI={mng:'Photocard Ayo Halu',vc:'Senyum Halu Collection','2s':'2-Shot Mini Tour Ayo Halu'},CD={mng:'MNGHALU',vc:'VCHALU','2s':'2SHALU'},price=PR[kind],title=TI[kind],code=CD[kind],qty=1,MAX=5;
function upd(){$('qty').textContent=qty;$('ptotal').textContent=fmt(price*qty)+' Halu Points';$('minus').disabled=qty<=1;$('plus').disabled=qty>=MAX}
$('minus').onclick=function(){if(qty>1){qty--;upd()}};$('plus').onclick=function(){if(qty<MAX){qty++;upd()}else toast('Maksimal '+MAX+' tiket per transaksi')};upd();var pm=new URLSearchParams(location.search).get('m');if(pm){var el=document.querySelector('input[name=m][data-n="'+pm.replace(/"/g,'')+'"]');if(el){el.checked=true;setTimeout(function(){el.scrollIntoView({block:'center'})},50)}}
$('go').onclick=function(){var r=document.querySelector('input[name=m]:checked');if(!r){toast('Pilih member dulu');return}var s=load(),tot=price*qty;if(s.pt<tot){toast('Halu Point kurang ('+fmt(tot-s.pt)+' lagi), isi dulu ya');setTimeout(function(){location.href='topup.html'},1400);return}
s.pt-=tot;var id=nextId(kind,code);s.tx.unshift({id:id,kind:kind,title:title,amount:-tot,qty:qty,ts:Date.now(),method:'HALU_POINT',member:r.dataset.n,sesi:+r.dataset.s,jalur:+r.dataset.j,time:r.dataset.t,date:r.dataset.d.split(', ').pop(),tukar:before(r.dataset.t)});save(s);location.href='invoice.html?id='+encodeURIComponent(id)};
var p=$('pts');if(p)p.textContent=fmt(load().pt)},
member:function(){var q=$('q'),cs=[].slice.call(document.querySelectorAll('.mb-c'));q.oninput=function(){var v=q.value.toLowerCase();cs.forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(v)>-1?'':'none'})}}};
window.Halu=H;
document.addEventListener('DOMContentLoaded',function(){var b=$('bur'),d=$('dr');if(!b||!d)return;b.onclick=function(){d.classList.add('on')};d.onclick=function(e){if(e.target===d||e.target.tagName==='A')d.classList.remove('on')}});
})();
