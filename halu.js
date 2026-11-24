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
var H={fmt:fmt,esc:esc,toast:toast,load:load,
home:function(){var s=load();$('pt').textContent=fmt(s.pt);var n=s.tx.filter(function(t){return t.kind!=='topup'}).length;$('nt').textContent=n;
var b='',seed=9900123;for(var i=0;i<46;i++){seed=(seed*1103515245+12345)&0x7fffffff;b+='<i style="width:'+(1+seed%3)+'px"></i>'}$('bc').innerHTML=b;
var l=s.tx.filter(function(t){return t.kind!=='topup'}).slice(0,3);$('up').innerHTML=l.length?l.map(function(t){return '<a class="tx" href="tiket-vc.html?id='+encodeURIComponent(t.id)+'"><span class="ic"></span><div>'+esc(t.title)+'<small>'+esc(t.member)+' · Sesi '+t.sesi+' · Jalur '+t.jalur+'</small></div><b>Lihat</b></a>'}).join(''):'<p class="empty">Belum ada tiket halu. Coba apply video call atau meet and greet.</p>'},
topup:function(){var amt=0,met='Transfer Halu',inp=$('amt');function sum(){$('tot').textContent='Rp 0';inp.value=amt?fmt(amt):'';}
document.querySelectorAll('.tp-chips button').forEach(function(b){b.onclick=function(){amt=+b.dataset.v;document.querySelectorAll('.tp-chips button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');sum()}});
inp.oninput=function(){amt=Math.min(+(inp.value.replace(/\D/g,''))||0,100000000);sum()};
document.querySelectorAll('.tp-m button').forEach(function(b){b.onclick=function(){met=b.textContent;document.querySelectorAll('.tp-m button').forEach(function(x){x.classList.remove('on')});b.classList.add('on')}});
$('go').onclick=function(){if(amt<=0){toast('Isi jumlah poin dulu');return}var s=load();s.pt+=amt;var id=nextId('topup','HALUPOINT');s.tx.unshift({id:id,kind:'topup',title:'Pembelian Poin Halu',amount:amt,ts:Date.now(),method:met});save(s);toast('+'+fmt(amt)+' Halu Point masuk (gratis!)');setTimeout(function(){location.href='riwayat.html'},900)}},
riwayat:function(){var s=load(),box=$('list');if(!s.tx.length){box.innerHTML='<p class="empty">Belum ada transaksi.<br><a href="topup.html">Isi Halu Point dulu</a> atau lihat <a href="invoice.html">contoh invoice</a>.</p>';return}var day='',h='';s.tx.forEach(function(t){var d=hari(t.ts);if(d!==day){day=d;h+='<div class="tx-day">'+esc(d)+'</div>'}h+='<a class="tx" href="invoice.html?id='+encodeURIComponent(t.id)+'"><span class="ic"></span><div>'+esc(t.title)+'<small>'+esc(t.id)+'</small></div><div style="flex:none;text-align:right"><b class="'+(t.amount<0?'m':'p')+'">'+(t.amount<0?'- ':'+ ')+fmt(t.amount)+'</b><small>'+esc(t.method)+'</small></div></a>'});box.innerHTML=h},
invoice:function(){var id=new URLSearchParams(location.search).get('id'),t=find(id);if(!t){$('card').innerHTML='<p class="empty">Transaksi tidak ditemukan.</p>';return}
$('it').textContent=t.title;$('ir').innerHTML=t.kind==='topup'?'<span>Halu Point</span><span>1×</span>':'<span>'+esc(t.member)+' - Sesi '+t.sesi+' - Jalur '+t.jalur+'</span><span>1×</span>';
$('ib').innerHTML='<div><span>Status</span><span class="inv-ok">Lunas</span></div><div><span>Metode Pembayaran</span><span>'+esc(t.method)+'</span></div><div><span>Tanggal</span><span>'+tgl(t.ts)+'</span></div><div><span>Waktu</span><span>'+jam(t.ts)+'</span></div><div><span>ID Transaksi</span><span>'+esc(t.id)+'</span></div>';
$('itot').textContent=fmt(t.amount)+(t.kind==='topup'?' (gratis)':'');
if(t.kind!=='topup'){$('tk').hidden=false;$('tk').href='tiket-vc.html?id='+encodeURIComponent(t.id)}},
tiket:function(){var id=new URLSearchParams(location.search).get('id'),t=find(id);if(!t||t.kind==='topup'){$('tbox').innerHTML='<p class="empty">Tiket tidak ditemukan.</p>';return}
var mng=t.kind==='mng';$('tt').textContent=t.title;$('tb').textContent=mng?'Meet and Greet':'Video Call';$('td').textContent=tgl(t.ts);
$('tg').innerHTML=[['Tanggal Show',t.date],['Waktu Show',t.time],['Penukaran Tiket',t.tukar],['Jalur Masuk','Jalur '+t.jalur],['Jumlah Tiket','1 Tiket'],['Tiket Terpakai','0 Tiket'],['ID Transaksi',t.id]].map(function(r){return '<div><small>'+r[0]+'</small><b>'+esc(r[1])+'</b></div>'}).join('')+'<div><small>Status Pembayaran</small><span class="tk-ok">✓ Lunas</span></div><div class="tk-full"><small>'+(mng?'Catatan':'Link Video Call')+'</small><span class="tk-link">'+(mng?'Tukar photocard di loket halu, lalu antre di jalur member pilihanmu (10 detik, khayalan).':'https://halu.example/vc/contoh-ruang-halu (ID Rapat: 000 0000 0000, Kode Sandi: halu00)')+'</span></div>';
$('tm').textContent=t.member;$('ti').href='invoice.html?id='+encodeURIComponent(t.id)},
buy:function(kind){var price=kind==='mng'?60000:120000,title=kind==='mng'?'Photocard Ayo Halu':'Senyum Halu Collection',code=kind==='mng'?'MNGHALU':'VCHALU';
$('go').onclick=function(){var r=document.querySelector('input[name=m]:checked');if(!r){toast('Pilih member dulu');return}var s=load();if(s.pt<price){toast('Halu Point kurang, isi dulu ya');setTimeout(function(){location.href='topup.html'},1200);return}
s.pt-=price;var id=nextId(kind,code);s.tx.unshift({id:id,kind:kind,title:title,amount:-price,ts:Date.now(),method:'HALU_POINT',member:r.dataset.n,sesi:+r.dataset.s,jalur:+r.dataset.j,time:r.dataset.t,date:'20 Desember 2026',tukar:'11:30 - 12:00 WIB'});save(s);location.href='invoice.html?id='+encodeURIComponent(id)};
var p=$('pts');if(p)p.textContent=fmt(load().pt)},
member:function(){var q=$('q'),cs=[].slice.call(document.querySelectorAll('.mb-c'));q.oninput=function(){var v=q.value.toLowerCase();cs.forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(v)>-1?'':'none'})}}};
window.Halu=H;
})();
