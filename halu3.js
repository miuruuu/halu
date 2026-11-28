// Apply teater + undian, detail show, kalender, re-issue OFC, statistik, kartu bagikan
(function(){
var H=window.Halu,esc=H.esc,fmt=H.fmt,toast=H.toast,load=H.load,save=H.save;
function $(i){return document.getElementById(i)}
var BIO=window.HALU_BIO||{},PHO=window.HALU_PHOTOS||{};
var SIL='<svg viewBox="0 0 24 24" fill="#b3b3b3" width="48" height="48"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/></svg>';
var PRICE=200000;
// id, tanggal (ISO), jam, judul, tim
var SHOWS=[['s1','2026-11-29','19:00 - 21:00','KIRA-KIRA Doang','Trainee'],['s2','2026-12-02','19:00 - 21:00','Pertaruhan Cinta Monyet','Passion'],['s3','2026-12-03','19:00 - 21:00','Cara Meminum Starling','Love'],['s4','2026-12-05','16:00 - 18:00','Pajama Halu','Dream'],['s5','2026-12-09','19:00 - 21:00','Aturan Anti Cinta Monyet','Love'],['s6','2026-12-12','14:00 - 16:00','Ingin Berantem','Passion'],['s7','2026-12-13','19:00 - 21:00','Sambil Menggandeng Halu','Dream'],['s8','2026-12-19','14:00 - 16:00','KIRA-KIRA Doang','Trainee']];
var BLN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
var HR=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
function dt(iso){var p=iso.split('-');return new Date(+p[0],+p[1]-1,+p[2])}
function tglPanjang(iso){var d=dt(iso);return HR[d.getDay()]+', '+d.getDate()+' '+BLN[d.getMonth()]+' '+d.getFullYear()}
function showBy(id){for(var i=0;i<SHOWS.length;i++)if(SHOWS[i][0]===id)return SHOWS[i];return null}
function lineup(s){var m=(H.TEAMS[s[4]]||'').split(','),o=(+s[0].slice(1))*3,r=[];for(var i=0;i<Math.min(16,m.length);i++)r.push(m[(i+o)%m.length]);return r}
function topupSoon(){toast('Halu Point kurang, isi dulu ya');setTimeout(function(){location.href='topup.html'},1200)}
function addTx(s,o){o.id=o.id||H.nextId(o.kind,o.code);delete o.code;o.ts=Date.now();s.tx.unshift(o);return o.id}
// ---------- gacha kursi: baris A-J, jumlah per baris berbeda: [blok kiri, blok kanan]
var DENAH={A:[10,11],B:[11,12],C:[12,13],D:[13,13],E:[13,13],F:[13,13],G:[12,12],H:[11,11],I:[10,10],J:[9,9]};
var ANAK={'A-6':1,'A-7':1,'A-8':1,'A-9':1,'A-10':1};
var SEMUA=[];Object.keys(DENAH).forEach(function(h){for(var n=1;n<=DENAH[h][0]+DENAH[h][1];n++)SEMUA.push(h+'-'+n)});
// kursi "sudah terpilih" pura-pura, sama untuk show yang sama
function terisi(show){var s=(+String(show).slice(1)||1)*7919,o={};SEMUA.forEach(function(k){s=(s*48271)%2147483647;if(!ANAK[k]&&s%100<60)o[k]=1});return o}
function seatBaru(ap,x){var t=terisi(x.show);ap.forEach(function(a){if(a!==x&&a.show===x.show&&a.seat)t[a.seat]=1});var k=SEMUA.filter(function(k){return !t[k]&&!ANAK[k]});return k[Math.floor(Math.random()*k.length)]}
function denahHtml(isi){return Object.keys(DENAH).map(function(h){var n=0;function blok(j,g){var c='';for(var i=0;i<j;i++){n++;var k=h+'-'+n,cl=isi[k]?'isi':ANAK[k]?'anak':'';c+='<i data-k="'+k+'"'+(cl?' class="'+cl+'"':'')+'>'+k+'</i>'}return '<span class="dn-g g'+g+'">'+c+'</span>'}
return '<div class="dn-r"><b>'+h+'</b>'+blok(DENAH[h][0],0)+blok(DENAH[h][1],1)+'</div>'}).join('')}
// tahap 1: dapat tiket atau tidak. Kursi baru diundi (tahap 2) kalau dapat.
function undianTiket(win,lanjut){
var m=document.createElement('div');m.className='mdl gc u1';
m.innerHTML='<div class="mdl-b"><div class="gc-h">HALU THEATER TICKET LOTTERY</div><div class="gc-sub">Tahap 1 dari 2</div><div class="gc-box"><h3 class="gc-t">Mengundi tiket…</h3><div class="gc-n" aria-live="polite">?</div></div><p class="u1-p"></p><button class="hx-btn o gc-x">Lewati</button></div>';
document.body.appendChild(m);
var num=m.querySelector('.gc-n'),title=m.querySelector('.gc-t'),btn=m.querySelector('.gc-x'),ket=m.querySelector('.u1-p'),timer,step=0,TOTAL=22,over=false,closed=false;
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){TOTAL=8;m.classList.add('tenang')}
function hasil(){if(over)return;over=true;clearTimeout(timer);title.textContent='Hasil undian tiket';num.textContent=win?'MENANG':'KALAH';num.classList.add(win?'win':'lose');
ket.textContent=win?'Kamu dapat tiket! Lanjut undi kursinya.':'Kamu tidak dapat tiket. Poin dikembalikan.';btn.textContent=win?'Undi kursi':'Tutup'}
function putar(){if(step>=TOTAL){hasil();return}num.textContent=step%2?'KALAH':'MENANG';step++;timer=setTimeout(putar,80+Math.pow(step/TOTAL,3)*320)}
btn.onclick=function(){if(!over){hasil();return}if(closed)return;closed=true;m.remove();lanjut()};
putar()}
H.undianTiket=undianTiket;
function gacha(seat,done,show,akhir){
var isi=terisi(show);if(seat)delete isi[seat];
var kosong=SEMUA.filter(function(k){return !isi[k]&&!ANAK[k]});
var nIsi=Object.keys(isi).length-(seat&&isi[seat]?1:0),nSisa=kosong.length;
var m=document.createElement('div');m.className='mdl gc';
m.innerHTML='<div class="mdl-b"><div class="gc-h">HALU THEATER SEAT LOTTERY</div><div class="gc-sub">TEATER KHAYALAN</div>'
+'<div class="gc-leg"><span><i></i> <em>Tersedia</em></span><span><i class="isi"></i> <em>Terpilih</em></span><span><i class="anak"></i> <em>Seat anak</em></span></div>'
+'<div class="gc-st"><div><b id="gc-sisa">'+nSisa+'</b><small>Sisa kursi</small></div><div><b id="gc-isi">'+nIsi+'</b><small>Kursi terpilih</small></div><div><b id="gc-und">'+nIsi+'</b><small>Total undian</small></div></div>'
+'<div class="gc-box"><h3 class="gc-t">Mengundi kursi…</h3><div class="gc-n" aria-live="polite">?</div></div>'
+'<div class="dn">'+denahHtml(isi)+'</div><button class="hx-btn o gc-x">Lewati</button></div>';
document.body.appendChild(m);
var num=m.querySelector('.gc-n'),title=m.querySelector('.gc-t'),btn=m.querySelector('.gc-x'),last,timer,step=0,TOTAL=34,over=false,closed=false;
function lepas(){if(last)last.classList.remove('on','win')}
function sorot(k,cls){lepas();last=m.querySelector('[data-k="'+k+'"]');last.classList.add(cls||'on');num.textContent=k}
function tutup(){if(closed)return;closed=true;clearTimeout(timer);m.remove();done()}
function hasil(){if(over)return;over=true;clearTimeout(timer);
if(seat){sorot(seat,'win');m.querySelector('#gc-sisa').textContent=nSisa-1;m.querySelector('#gc-isi').textContent=nIsi+1;m.querySelector('#gc-und').textContent=nIsi+1;title.textContent='Kursi kamu';num.classList.add('win');btn.textContent=akhir||'Lihat tiket halu'}
else{lepas();num.textContent='✕';num.classList.add('lose');title.textContent='Tidak kebagian kursi';btn.textContent='Tutup'}
timer=setTimeout(tutup,seat?1800:1600)}
function putar(){if(step++>=TOTAL){hasil();return}sorot(kosong[Math.floor(Math.random()*kosong.length)]);timer=setTimeout(putar,50+Math.pow(step/TOTAL,3)*330)}
btn.onclick=function(){if(over)tutup();else hasil()};
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){TOTAL=10;m.classList.add('tenang')}putar()}
H.gacha=gacha;
// lihat denah saja; kalau ada kursinya, disorot
function denah(seat){
var m=document.createElement('div');m.className='mdl gc lihat';
m.innerHTML='<div class="mdl-b"><div class="gc-h">Denah Kursi</div><div class="gc-sub">TEATER KHAYALAN</div>'+(seat?'<div class="gc-box"><h3 class="gc-t">Kursi kamu</h3><div class="gc-n">'+esc(seat)+'</div></div>':'')
+'<p class="dn-k">Baris A paling depan.</p><p class="dn-k hp">Geser ke samping untuk lihat semua kursi.</p><div class="dn-p">PANGGUNG</div><div class="dn-s"><div class="dn">'+denahHtml({})+'</div></div>'
+'<div class="gc-leg"><span><i></i> <em>Kursi</em></span><span><i class="anak"></i> <em>Seat anak</em></span></div><button class="hx-btn o gc-x">Tutup</button></div>';
document.body.appendChild(m);
m.onclick=function(e){if(e.target===m||e.target.closest('.gc-x'))m.remove()};
if(seat){var k=m.querySelector('[data-k="'+seat+'"]');if(k){k.classList.add('on');var g=m.querySelector('.dn-s');g.scrollLeft+=k.getBoundingClientRect().left-g.getBoundingClientRect().left-g.clientWidth/2}}}
H.denah=denah;
// latihan undian kursi: gratis, tidak menyentuh poin atau apply
H.cobaKursi=function(){
function gambar(){var a=load().coba||[];$('cb-n').textContent=a.length?a[0]:'?';$('cb-lihat').hidden=!a.length;
$('cb-h').innerHTML=a.length?'<div class="cb-l">'+a.map(function(k){return '<button data-k="'+esc(k)+'">'+esc(k)+'</button>'}).join('')+'</div>':'<p class="empty">Belum pernah coba.</p>'}
$('cb-go').onclick=function(){var show='s'+(1+Math.floor(Math.random()*999)),seat=seatBaru([],{show:show});
gacha(seat,function(){var s=load();s.coba=[seat].concat(s.coba||[]).slice(0,12);save(s);gambar()},show,'Selesai')};
$('cb-lihat').onclick=function(){denah((load().coba||[])[0])};
$('cb-denah').onclick=function(){denah()};
$('cb-h').onclick=function(e){var b=e.target.closest('button');if(b)denah(b.dataset.k)};
gambar()};
// ---------- landing: layar bergerak
H.landing=function(){var v=$('lp'),s=v.querySelectorAll('.lp-s'),b=v.querySelectorAll('.lp-b'),p=$('lpp'),n=0,t=0,jalan=true,LAMA=5000,lalu=Date.now();
var warna=['#ff4d8d','#4dd2ff','#ffd24d','#9dff6b','#c58bff'],h='';for(var i=0;i<26;i++){var w=warna[i%5];h+='<span style="left:'+(i*4-1)+'%;height:'+(34+(i*37)%30)+'px;animation-delay:-'+((i*13)%20)/10+'s"><u style="background:'+w+';box-shadow:0 0 10px 2px '+w+'"></u></span>'}$('lpc').innerHTML=h;
function ke(k){n=(k+s.length)%s.length;t=0;v.dataset.s=n;for(var i=0;i<s.length;i++){s[i].classList.toggle('on',i===n);b[i].firstChild.style.width=i<n?'100%':'0'}}
for(var j=0;j<b.length;j++)(function(k){b[k].onclick=function(){ke(k)}})(j);
p.onclick=function(){jalan=!jalan;p.textContent=jalan?'❚❚':'▶';v.classList.toggle('jeda',!jalan)};
setInterval(function(){var now=Date.now(),d=now-lalu;lalu=now;if(!jalan||document.hidden)return;t+=Math.min(d,200);b[n].firstChild.style.width=Math.min(100,t/LAMA*100)+'%';if(t>=LAMA)ke(n+1)},100)};
// ---------- apply teater
H.apply=function(){var siap=false;var q=new URLSearchParams(location.search).get('s');var box=$('ap'),mine=$('mine');
function list(){var s=load(),a=s.ap||[];mine.innerHTML=a.length?a.map(function(x){var sh=showBy(x.show)||['','2026-12-01','','Show',''];return '<div class="ap-i '+x.status+'"><div><b>'+esc(sh[3])+'</b><small>'+tglPanjang(sh[1])+'</small><small>'+(x.type==='ofc'?'OFC':'General')+'</small></div><div class="ap-s">'+(x.status==='wait'?'<button class="hx-btn" data-id="'+x.id+'">Lihat hasil undian</button>':x.status==='win'?'<b>MENANG</b><small>Kursi '+x.seat+'</small><button class="hx-btn" data-tk="'+x.id+'">Lihat tiket halu</button> <button class="hx-btn o" data-kursi="'+x.seat+'">Lihat posisi kursi</button> <button class="hx-btn o" data-share="'+x.id+'">Bagikan</button>':'<b>KALAH</b><small>Poin dikembalikan</small><button class="hx-btn o" data-share="'+x.id+'">Bagikan</button>')+'</div></div>'}).join(''):'<p class="empty">Belum ada apply.</p>';if(siap)render()}
mine.onclick=function(e){var b=e.target.closest('button');if(!b)return;var s=load();
if(b.dataset.kursi){denah(b.dataset.kursi);return}
if(b.dataset.id){var x=s.ap.filter(function(a){return a.id===b.dataset.id})[0];if(!x||x.status!=='wait')return;b.disabled=true;
var win=Math.random()<(x.type==='ofc'?0.25:0.45);x.status=win?'win':'lose';if(win)x.seat=seatBaru(s.ap,x);else{s.pt+=PRICE;addTx(s,{kind:'refund',code:'REFUND',title:'Pengembalian Poin Undian',item:'Refund apply teater',amount:PRICE,method:'HALU_POINT'})}save(s);
var sw=showBy(x.show);undianTiket(win,function(){if(!win){list();toast('Kalah, poin dikembalikan');return}gacha(x.seat,function(){list();share('tiket-halu',null,null,ticket(sw,x.seat))},x.show)})}
else if(b.dataset.tk){var z=s.ap.filter(function(a){return a.id===b.dataset.tk})[0],zs=showBy(z.show);share('tiket-halu',null,null,ticket(zs,z.seat))}
else if(b.dataset.share){var y=s.ap.filter(function(a){return a.id===b.dataset.share})[0];share('hasil-undian-halu',null,null,surat(y,showBy(y.show)))}};
// buka = bisa apply; gen = kalah di OFC, tinggal General; tutup = tidak bisa lagi
function status(id){var a=(load().ap||[]).filter(function(x){return x.show===id});if(a.some(function(x){return x.status!=='lose'||x.type!=='ofc'}))return 'tutup';return a.length?'gen':'buka'}
$('dn-b').onclick=function(){denah()};
list();siap=true;
function render(){var sh=showBy(q);if(!sh){var buka=SHOWS.filter(function(s){return status(s[0])!=='tutup'});if(!buka.length){box.innerHTML='<p class="empty">Semua show sudah kamu apply.</p>';return}box.innerHTML='<div class="sh-l">'+buka.map(function(s){return '<a class="sc-row" href="teater-tiket.html?s='+s[0]+'"><div class="sc-d">'+dt(s[1]).getDate()+'<small>'+(dt(s[1]).getMonth()===10?'NOV':'DES')+'</small></div><div><span class="tag">Team '+s[4]+'</span><b style="display:inline">'+esc(s[3])+'</b><br><small>'+s[2]+' WIB</small>'+(status(s[0])==='gen'?'<small class="lagi">Bisa apply lagi di General</small>':'')+'</div></a>'}).join('')+'</div>';return}
var keadaan=status(sh[0]);if(keadaan==='tutup'){box.innerHTML='<div class="ct"><h3>'+esc(sh[3])+'</h3><p>Show ini sudah kamu apply. Cek hasilnya di bawah.</p><a class="hx-btn o" href="teater-tiket.html">Show lain</a></div>';return}
var st=load(),ofc=keadaan==='buka'&&st.ofc&&st.ofc>Date.now();
box.innerHTML='<div class="ct"><span class="hx-badge">Team '+sh[4]+'</span><h2 style="margin:10px 0 4px">'+esc(sh[3])+'</h2><p style="margin:0"><span>'+tglPanjang(sh[1])+'</span> · '+sh[2]+' WIB</p><p style="margin:8px 0 0"><b>200.000 Halu Points</b></p></div><h3 class="ex-h">Penampil</h3><div class="ln">'+lineup(sh).map(function(n){return '<div><span class="ph">'+SIL+(PHO[n]?'<img src="'+PHO[n]+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">':'')+'</span><small>'+esc(n)+'</small></div>'}).join('')+'</div><div class="ct"><h3>Pilih jalur apply</h3><div class="rd2"><label><input type="radio" name="jl" value="ofc"'+(ofc?' checked':' disabled')+'> <span>OFC (apply duluan)</span></label><label><input type="radio" name="jl" value="gen"'+(ofc?'':' checked')+'> <span>General</span></label></div>'+(keadaan==='gen'?'<p style="font-size:13px">Kamu kalah di jalur OFC, masih bisa apply lewat General.</p>':ofc?'':'<p style="font-size:13px"><a href="ofc.html">Daftar OFC dulu untuk jalur OFC</a></p>')+'<button class="hx-btn" id="go">Apply Tiket</button><p class="hx-note">Kalau kalah, poin dikembalikan penuh. Semuanya cuma undian halu.</p></div><p><a class="hx-btn o" href="teater-tiket.html">Show lain</a></p>';
$('go').onclick=function(){var s=load();if(status(sh[0])==='tutup'){toast('Kamu sudah apply show ini');return}if(s.pt<PRICE){topupSoon();return}s.pt-=PRICE;var type=document.querySelector('input[name=jl]:checked').value;var id=addTx(s,{kind:'show',code:'SHOWHALU',title:sh[3],item:'Apply Tiket Teater',amount:-PRICE,method:'HALU_POINT'});s.ap=[{id:id,show:sh[0],type:type,status:'wait'}].concat(s.ap||[]);save(s);list();toast('Apply terkirim, cek hasil undiannya');mine.scrollIntoView({behavior:'smooth',block:'center'})}}
render()};
// ---------- kalender
H.kalender=function(){var y=2026,m=10,sel=null;
function events(d){var iso=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'),r=[];SHOWS.forEach(function(s){if(s[1]===iso)r.push({t:'show',n:s[3],u:'teater-tiket.html?s='+s[0]})});if(iso==='2026-12-20')r.push({t:'ev',n:'Ayo Halu Meet and Greet',u:'mng.html'});
Object.keys(BIO).forEach(function(n){var l=BIO[n].l;if(l&&l.slice(5)===iso.slice(5))r.push({t:'bd',n:n,u:'member.html?n='+encodeURIComponent(n)})});return r}
function draw(){$('km').textContent=BLN[m]+' '+y;var first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),h='';for(var i=0;i<first;i++)h+='<span></span>';for(var d=1;d<=days;d++){var ev=events(d);h+='<button data-d="'+d+'"'+(d===sel?' class="on"':'')+'>'+d+'<i>'+ev.map(function(e){return e.t}).filter(function(v,i,a){return a.indexOf(v)===i}).map(function(t){return '<u class="'+t+'"></u>'}).join('')+'</i></button>'}$('kg').innerHTML=h;
var all=[];for(var k=1;k<=days;k++)if(!sel||sel===k)events(k).forEach(function(e){e.d=k;all.push(e)});
$('kl').innerHTML=all.length?all.map(function(e){return '<a class="sc-row" href="'+e.u+'"><div class="sc-d">'+e.d+'</div><div><span class="tag">'+(e.t==='bd'?'Ulang Tahun':e.t==='show'?'Show':'Event')+'</span><b style="display:inline">'+esc(e.n)+'</b></div></a>'}).join(''):'<p class="empty">Tidak ada jadwal.</p>'}
$('kg').onclick=function(e){var b=e.target.closest('button');if(!b)return;var d=+b.dataset.d;sel=sel===d?null:d;draw()};
function move(x){m+=x;if(m<0){m=11;y--}if(m>11){m=0;y++}sel=null;draw()}$('kp').onclick=function(){move(-1)};$('kn').onclick=function(){move(1)};draw()};
// ---------- re-issue OFC
var oofc=H.ofc;H.ofc=function(){oofc();document.querySelectorAll('[data-ri]').forEach(function(b){b.onclick=function(){var s=load();if(!(s.ofc&&s.ofc>Date.now())){toast('Daftar OFC dulu ya');return}var p=+b.dataset.p;if(s.pt<p){topupSoon();return}s.pt-=p;var id=addTx(s,{kind:'ofc',code:'REISSUE',title:b.dataset.ri,item:b.dataset.ri,amount:-p,method:'HALU_POINT'});save(s);location.href='invoice.html?id='+encodeURIComponent(id)}})};
// ---------- statistik
function stats(){var s=load(),r={spend:0,top:0,cat:{vc:0,mng:0,'2s':0,show:0,lib:0,ofc:0},mem:{},win:0,lose:0};s.tx.forEach(function(t){if(t.kind==='topup')r.top+=t.amount;else{r.spend-=t.amount;if(t.kind==='refund')r.cat.show-=t.amount;else if(t.kind in r.cat)r.cat[t.kind]-=t.amount}if(t.member)r.mem[t.member]=(r.mem[t.member]||0)+(t.qty||1)});(s.ap||[]).forEach(function(a){if(a.status==='win')r.win++;if(a.status==='lose')r.lose++});r.rank=Object.keys(r.mem).sort(function(a,b){return r.mem[b]-r.mem[a]});return r}
var CAT={vc:'Video Call',mng:'Meet and Greet','2s':'2-Shot',show:'Teater',lib:'Photobook',ofc:'Fan Club'};
H.statistik=function(){var r=stats();$('st-s').textContent=fmt(r.spend);$('st-t').textContent=fmt(r.top);$('st-w').textContent=r.win+' / '+(r.win+r.lose);
$('st-c').innerHTML=Object.keys(CAT).map(function(k){var v=r.cat[k]||0,p=r.spend>0?Math.round(v/r.spend*100):0;return '<div class="br"><span>'+CAT[k]+'</span><i><u style="width:'+Math.max(0,Math.min(100,p))+'%"></u></i><b>'+fmt(v)+'</b></div>'}).join('');
$('st-m').innerHTML=r.rank.length?r.rank.slice(0,5).map(function(n){return '<div class="br2"><span class="ph">'+SIL+(PHO[n]?'<img src="'+PHO[n]+'" alt="" referrerpolicy="no-referrer" onerror="this.remove()">':'')+'</span><b>'+esc(n)+'</b><span>'+r.mem[n]+' Tiket</span></div>'}).join(''):'<p class="empty">Belum ada pembelian.</p>';
$('st-b').onclick=function(){var r=stats();share('rekap-halu',['REKAP PENGELUARAN HALU','Rp 0 uang asli',fmt(r.spend)+' poin halu hangus','Oshi: '+(r.rank[0]||'belum ada'),'Undian menang: '+r.win+' / '+(r.win+r.lose)],'#e20514')}};
// ---------- kartu bagikan (selalu bercap HALU)
function card(lines,color){var c=document.createElement('canvas');c.width=1080;c.height=1350;var x=c.getContext('2d'),F='"Plus Jakarta Sans",system-ui,sans-serif';
var g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#fff5f6');g.addColorStop(1,'#fde3ee');x.fillStyle=g;x.fillRect(0,0,1080,1350);x.fillStyle=color;x.fillRect(0,0,1080,28);x.fillRect(0,1322,1080,28);
x.textAlign='center';x.fillStyle='#e20514';x.font='800 64px '+F;x.fillText('WOTA HALU',540,150);
function fit(t,y,size,col){x.fillStyle=col;do{x.font='800 '+size+'px '+F;size-=2}while(x.measureText(t).width>960&&size>24);x.fillText(t,540,y)}
fit(lines[0],290,52,'#666');fit(lines[1],450,90,'#020817');var y=590;for(var i=2;i<lines.length;i++){fit(lines[i],y,i===lines.length-1&&lines.length<5?84:56,i===lines.length-1?color:'#020817');y+=130}
x.save();x.translate(540,700);x.rotate(-Math.PI/7);x.globalAlpha=0.16;x.fillStyle='#e20514';x.font='800 420px '+F;x.fillText('HALU',0,140);x.restore();
x.save();x.translate(540,1130);x.rotate(-0.05);x.strokeStyle='#e20514';x.lineWidth=8;x.strokeRect(-420,-60,840,100);x.fillStyle='#e20514';x.font='800 44px '+F;x.fillText('PARODI · BUKAN BUKTI ASLI',0,8);x.restore();
x.fillStyle='#666';x.font='600 34px '+F;x.fillText('halu.jeketoy.lol',540,1275);return c}
H.card=card;
// kartu "pesan masuk" gaya halu: susunan & kalimat buatan sendiri, bukan tiruan email resmi
function surat(y,sh){var win=y.status==='win',c=document.createElement('canvas');c.width=1080;c.height=1350;var x=c.getContext('2d'),F='"Plus Jakarta Sans",system-ui,sans-serif';
var warna=win?'#1faa59':'#e20514',p=load().profile||{},nama=(p.nk||p.name||'Pengunjung Halu').slice(0,24);
function t(s,px,py,size,col,w,al){x.textAlign=al||'left';x.fillStyle=col;x.font=(w||600)+' '+size+'px '+F;x.fillText(s,px,py)}
function fit(s,px,py,size,col,w,max){do{x.font=w+' '+size+'px '+F;size-=2}while(x.measureText(s).width>max&&size>20);x.textAlign='left';x.fillStyle=col;x.fillText(s,px,py)}
function box(px,py,wd,ht,r,col){x.fillStyle=col;x.beginPath();x.moveTo(px+r,py);x.arcTo(px+wd,py,px+wd,py+ht,r);x.arcTo(px+wd,py+ht,px,py+ht,r);x.arcTo(px,py+ht,px,py,r);x.arcTo(px,py,px+wd,py,r);x.fill()}
x.fillStyle='#2b1d3a';x.fillRect(0,0,1080,1350);
t('Kotak Masuk Halu',60,100,48,'#fff',800);t('khayalan · 1 pesan',1020,100,30,'#c9b8dd',600,'right');
box(40,140,1000,1150,40,'#fffaf2');
fit('Hasil undian halu: kamu '+(win?'MENANG':'KALAH'),90,240,50,'#1d1029',800,900);
x.fillStyle='#7a3cc2';x.beginPath();x.arc(135,325,46,0,7);x.fill();t('WH',135,339,36,'#fff',800,'center');
t('Loket Khayalan',205,315,34,'#1d1029',800);t('loket@halu.example · untuk '+nama,205,357,28,'#7a6a8a',600);
x.fillStyle='#e8dfcf';x.fillRect(90,400,900,3);
fit('Hai '+nama+',',90,470,36,'#1d1029',600,900);
t(win?'Undianmu tembus. Selamat berkhayal!':'Undianmu belum tembus kali ini.',90,525,34,'#1d1029',600);
box(90,575,900,170,28,warna);t(win?'MENANG':'KALAH',540,690,96,'#fff',800,'center');
var d=dt(sh[1]),rows=[['Show',sh[3]],['Hari',HR[d.getDay()]+', '+d.getDate()+' '+BLN[d.getMonth()]+' '+d.getFullYear()],['Jam',sh[2]+' WIB'],[win?'Kursi':'Poin',win?y.seat:'200.000 Halu Point kembali']];
rows.forEach(function(r,i){var py=820+i*78;t(r[0],90,py,32,'#7a6a8a',600);fit(r[1],300,py,34,'#1d1029',800,690);x.fillStyle='#eee5d6';x.fillRect(90,py+28,900,2)});
t('Pesan ini cuma permainan. Tidak ada tiket asli,',90,1160,28,'#7a6a8a',600);t('dan tidak bisa dipakai masuk ke mana pun.',90,1200,28,'#7a6a8a',600);t('halu.jeketoy.lol',90,1255,28,'#7a3cc2',800);
x.save();x.translate(540,780);x.rotate(-Math.PI/6);x.globalAlpha=0.13;t('HALU',0,120,420,'#e20514',800,'center');x.restore();
x.save();x.translate(800,1245);x.rotate(-0.06);x.strokeStyle='#e20514';x.lineWidth=6;x.strokeRect(-205,-42,410,66);t('BUKAN EMAIL ASLI',0,6,34,'#e20514',800,'center');x.restore();
return c}
H.surat=surat;
// tanda tim buatan sendiri: satu bentuk sesuai tim show, dalam lingkaran
function tanda(x,tim,cx,cy){var col={Love:'#e20785',Dream:'#00838a',Passion:'#e0730a',Trainee:'#555f6b'}[tim]||'#555f6b';
x.save();x.translate(cx,cy);x.fillStyle=col;x.beginPath();x.arc(0,0,58,0,7);x.fill();x.fillStyle='#fff';x.beginPath();
if(tim==='Love'){x.moveTo(0,30);x.bezierCurveTo(-48,-2,-28,-40,0,-16);x.bezierCurveTo(28,-40,48,-2,0,30)}
else if(tim==='Dream'){for(var i=0;i<10;i++){var r=i%2?15:35,a=-Math.PI/2+i*Math.PI/5;x[i?'lineTo':'moveTo'](r*Math.cos(a),r*Math.sin(a))}}
else if(tim==='Passion'){x.moveTo(4,-36);x.bezierCurveTo(8,-14,32,-8,26,14);x.bezierCurveTo(20,40,-22,40,-26,12);x.bezierCurveTo(-28,-4,-14,-10,-12,-20);x.bezierCurveTo(-2,-12,2,-22,4,-36)}
else{x.moveTo(0,-34);x.lineTo(28,0);x.lineTo(0,34);x.lineTo(-28,0)}
x.closePath();x.fill();x.restore()}
// tiket sobek versi halu: sengaja BEDA dari tiket asli (warna, huruf, cap besar)
function ticket(sh,seat){var c=document.createElement('canvas');c.width=1400;c.height=800;var x=c.getContext('2d'),F='"Plus Jakarta Sans",system-ui,sans-serif',INK='#12343b';
x.fillStyle='#bfeee6';x.fillRect(0,0,1400,800);
x.globalCompositeOperation='destination-out';for(var y=20;y<800;y+=40){x.beginPath();x.arc(0,y,13,0,7);x.arc(1400,y,13,0,7);x.fill()}x.globalCompositeOperation='source-over';
function t(s,px,py,size,col,w,al){x.textAlign=al||'left';x.fillStyle=col||INK;x.font=(w||800)+' '+size+'px '+F;x.fillText(s,px,py)}
function fit(s,px,py,size,max){do{x.font='800 '+size+'px '+F;size-=2}while(x.measureText(s).width>max&&size>24);x.textAlign='left';x.fillStyle=INK;x.fillText(s,px,py)}
x.save();x.translate(110,400);x.rotate(-Math.PI/2);t('HALU THEATER',0,0,56,INK,800,'center');x.restore();
x.setLineDash([10,12]);x.strokeStyle=INK;x.lineWidth=3;x.beginPath();x.moveTo(170,30);x.lineTo(170,770);x.stroke();x.setLineDash([]);
var d=dt(sh[1]),jam=sh[2].split(' ')[0],a=(+jam.slice(0,2))*60+(+jam.slice(3))-45,buka=String(Math.floor(a/60)).padStart(2,'0')+':'+String(a%60).padStart(2,'0');
fit(sh[3],220,130,72,950);tanda(x,sh[4],1270,115);t('TIKET KHAYALAN · TEAM '+sh[4].toUpperCase(),220,185,30,'#0f7a6c');
t(HR[d.getDay()].toUpperCase(),220,300,50);t(d.getDate()+' '+BLN[d.getMonth()]+' '+d.getFullYear(),1330,300,50,INK,800,'right');
t('Mulai '+jam+' WIB',220,370,40,INK,600);t('200.000 HALU POINT',1330,370,40,INK,600,'right');t('Pintu khayalan dibuka '+buka+' WIB',220,430,34,INK,600);
x.lineWidth=4;x.strokeRect(220,480,1110,170);t('KURSI HALU',260,585,46);t(seat,1290,610,130,'#e20514',800,'right');
t('Tidak berlaku untuk masuk ke mana pun. Tidak bisa dijual atau ditukar.',220,700,30,INK,600);t('halu.jeketoy.lol',220,760,28,'#0f7a6c',600);
x.save();x.translate(760,420);x.rotate(-Math.PI/9);x.globalAlpha=0.17;t('HALU',0,110,360,'#e20514',800,'center');x.restore();
x.save();x.translate(1120,750);x.rotate(-0.05);x.strokeStyle='#e20514';x.lineWidth=6;x.strokeRect(-210,-32,420,56);t('BUKAN TIKET ASLI',0,8,34,'#e20514',800,'center');x.restore();return c}
H.ticket=ticket;
function share(name,lines,color,canvas){var c=canvas||card(lines,color),text='Hasil halu gw (cuma parodi) https://halu.jeketoy.lol';c.toBlob(function(b){var url=URL.createObjectURL(b);var m=H.modal('<h3 style="margin:0 0 10px">Bagikan</h3><img src="'+url+'" alt="Kartu halu" style="width:100%;max-height:55vh;object-fit:contain"><div class="shb"><a class="hx-btn" id="dl" download="'+name+'.png" href="'+url+'">Unduh foto</a><a class="hx-btn o" target="_blank" rel="noopener noreferrer" href="https://x.com/intent/post?text='+encodeURIComponent(text)+'">Post ke X</a></div><p style="font-size:12px;color:#888;margin:10px 0 0">Unduh fotonya dulu, lalu lampirkan di postingan X.</p>');
var f;try{f=new File([b],name+'.png',{type:'image/png'})}catch(e){}if(f&&navigator.canShare&&navigator.canShare({files:[f]})){var s=document.createElement('button');s.className='hx-btn';s.textContent='Bagikan lewat…';s.onclick=function(){navigator.share({files:[f],text:text}).catch(function(){})};m.querySelector('.shb').prepend(s)}},'image/png')}
H.share=share;
// buka detail member dari kalender (?n=)
var om=H.member;H.member=function(){om();var n=new URLSearchParams(location.search).get('n');if(n){var c=[].filter.call(document.querySelectorAll('.mb-c'),function(e){return e.dataset.n===n})[0];if(c)c.click()}};
})();
