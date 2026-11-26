// Apply teater + undian, detail show, kalender, re-issue OFC, statistik, kartu bagikan
(function(){
var H=window.Halu,esc=H.esc,fmt=H.fmt,toast=H.toast,load=H.load,save=H.save;
function $(i){return document.getElementById(i)}
var BIO=window.HALU_BIO||{},PHO=window.HALU_PHOTOS||{};
var SIL='<svg viewBox="0 0 24 24" fill="#b3b3b3" width="48" height="48"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/></svg>';
var PRICE=200000;
// id, tanggal (ISO), jam, judul, tim
var SHOWS=[['s1','2026-11-29','19:00 - 21:00','KIRA-KIRA Halu','Trainee'],['s2','2026-12-02','19:00 - 21:00','Pertaruhan Halu','Passion'],['s3','2026-12-03','19:00 - 21:00','Cara Meminum Ramune Halu','Love'],['s4','2026-12-05','16:00 - 18:00','Pajama Halu','Dream'],['s5','2026-12-09','19:00 - 21:00','Aturan Anti Cinta Halu','Love'],['s6','2026-12-12','14:00 - 16:00','Ingin Bertemu Halu','Passion'],['s7','2026-12-13','19:00 - 21:00','Sambil Menggandeng Halu','Dream'],['s8','2026-12-19','14:00 - 16:00','KIRA-KIRA Halu','Trainee']];
var BLN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
var HR=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
function dt(iso){var p=iso.split('-');return new Date(+p[0],+p[1]-1,+p[2])}
function tglPanjang(iso){var d=dt(iso);return HR[d.getDay()]+', '+d.getDate()+' '+BLN[d.getMonth()]+' '+d.getFullYear()}
function showBy(id){for(var i=0;i<SHOWS.length;i++)if(SHOWS[i][0]===id)return SHOWS[i];return null}
function lineup(s){var m=(H.TEAMS[s[4]]||'').split(','),o=(+s[0].slice(1))*3,r=[];for(var i=0;i<Math.min(16,m.length);i++)r.push(m[(i+o)%m.length]);return r}
function topupSoon(){toast('Halu Point kurang, isi dulu ya');setTimeout(function(){location.href='topup.html'},1200)}
function addTx(s,o){o.id=o.id||H.nextId(o.kind,o.code);delete o.code;o.ts=Date.now();s.tx.unshift(o);return o.id}
// ---------- gacha kursi: baris A (depan panggung) sampai J, nomor 1-20 dari kiri
var HURUF='ABCDEFGHIJ',NOMOR=20;
function acak(){return HURUF[Math.floor(Math.random()*HURUF.length)]+'-'+(1+Math.floor(Math.random()*NOMOR))}
function seatBaru(ap,x){var pakai={},k;ap.forEach(function(a){if(a!==x&&a.show===x.show&&a.seat)pakai[a.seat]=1});do{k=acak()}while(pakai[k]);return k}
function gacha(seat,done){
var m=document.createElement('div');m.className='mdl gc';var head='<span></span>',rows='';
for(var n=1;n<=NOMOR;n++)head+='<b>'+n+'</b>';
for(var r=0;r<HURUF.length;r++){rows+='<b>'+HURUF[r]+'</b>';for(var c=1;c<=NOMOR;c++)rows+='<i data-k="'+HURUF[r]+'-'+c+'"></i>'}
m.innerHTML='<div class="mdl-b"><h3 class="gc-t">Mengundi kursi…</h3><div class="gc-n" aria-live="polite">?</div><div class="gc-s">PANGGUNG</div><div class="gc-g">'+head+rows+'</div><button class="hx-btn o gc-x">Lewati</button></div>';
document.body.appendChild(m);
var num=m.querySelector('.gc-n'),title=m.querySelector('.gc-t'),btn=m.querySelector('.gc-x'),last,timer,step=0,TOTAL=34,over=false,closed=false;
function sorot(k,cls){if(last)last.className='';last=m.querySelector('[data-k="'+k+'"]');last.className=cls||'on';num.textContent=k}
function tutup(){if(closed)return;closed=true;clearTimeout(timer);m.remove();done()}
function hasil(){if(over)return;over=true;clearTimeout(timer);
if(seat){sorot(seat,'win');title.textContent='Kursi kamu';num.classList.add('win');btn.textContent='Lihat tiket halu'}
else{if(last)last.className='';num.textContent='✕';num.classList.add('lose');title.textContent='Tidak kebagian kursi';btn.textContent='Tutup'}
timer=setTimeout(tutup,seat?1800:1600)}
function putar(){if(step++>=TOTAL){hasil();return}sorot(acak());timer=setTimeout(putar,50+Math.pow(step/TOTAL,3)*330)}
btn.onclick=function(){if(over)tutup();else hasil()};
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){TOTAL=10;m.classList.add('tenang')}putar()}
H.gacha=gacha;
// ---------- apply teater
H.apply=function(){var q=new URLSearchParams(location.search).get('s');var box=$('ap'),mine=$('mine');
function list(){var s=load(),a=s.ap||[];mine.innerHTML=a.length?a.map(function(x){var sh=showBy(x.show)||['','2026-12-01','','Show',''];return '<div class="ap-i '+x.status+'"><div><b>'+esc(sh[3])+'</b><small>'+tglPanjang(sh[1])+'</small><small>'+(x.type==='ofc'?'OFC':'General')+'</small></div><div class="ap-s">'+(x.status==='wait'?'<button class="hx-btn" data-id="'+x.id+'">Lihat hasil undian</button>':x.status==='win'?'<b>MENANG</b><small>Kursi '+x.seat+'</small><button class="hx-btn" data-tk="'+x.id+'">Lihat tiket halu</button> <button class="hx-btn o" data-share="'+x.id+'">Bagikan</button>':'<b>BELUM BERUNTUNG</b><small>Poin dikembalikan</small><button class="hx-btn o" data-share="'+x.id+'">Bagikan</button>')+'</div></div>'}).join(''):'<p class="empty">Belum ada apply.</p>'}
mine.onclick=function(e){var b=e.target.closest('button');if(!b)return;var s=load();
if(b.dataset.id){var x=s.ap.filter(function(a){return a.id===b.dataset.id})[0];if(!x||x.status!=='wait')return;b.disabled=true;
var win=Math.random()<(x.type==='ofc'?0.7:0.45);x.status=win?'win':'lose';if(win)x.seat=seatBaru(s.ap,x);else{s.pt+=PRICE;addTx(s,{kind:'refund',code:'REFUND',title:'Pengembalian Poin Undian',item:'Refund apply teater',amount:PRICE,method:'HALU_POINT'})}save(s);
var sw=showBy(x.show);gacha(win?x.seat:null,function(){list();if(win)share('tiket-halu',null,null,ticket(sw,x.seat));else toast('Belum beruntung, poin dikembalikan')})}
else if(b.dataset.tk){var z=s.ap.filter(function(a){return a.id===b.dataset.tk})[0],zs=showBy(z.show);share('tiket-halu',null,null,ticket(zs,z.seat))}
else if(b.dataset.share){var y=s.ap.filter(function(a){return a.id===b.dataset.share})[0],sh=showBy(y.show);share('hasil-undian-halu',[ 'HASIL UNDIAN TEATER',sh[3],tglPanjang(sh[1]),y.status==='win'?'MENANG · KURSI '+y.seat:'BELUM BERUNTUNG'],y.status==='win'?'#1faa59':'#e20514')}};
list();
var sh=showBy(q);if(!sh){box.innerHTML='<div class="sh-l">'+SHOWS.map(function(s){return '<a class="sc-row" href="teater-tiket.html?s='+s[0]+'"><div class="sc-d">'+dt(s[1]).getDate()+'<small>'+(dt(s[1]).getMonth()===10?'NOV':'DES')+'</small></div><div><span class="tag">Team '+s[4]+'</span><b style="display:inline">'+esc(s[3])+'</b><br><small>'+s[2]+' WIB</small></div></a>'}).join('')+'</div>';return}
var st=load(),ofc=st.ofc&&st.ofc>Date.now();
box.innerHTML='<div class="ct"><span class="hx-badge">Team '+sh[4]+'</span><h2 style="margin:10px 0 4px">'+esc(sh[3])+'</h2><p style="margin:0"><span>'+tglPanjang(sh[1])+'</span> · '+sh[2]+' WIB</p><p style="margin:8px 0 0"><b>200.000 Halu Points</b></p></div><h3 class="ex-h">Penampil</h3><div class="ln">'+lineup(sh).map(function(n){return '<div><span class="ph">'+SIL+(PHO[n]?'<img src="'+PHO[n]+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">':'')+'</span><small>'+esc(n)+'</small></div>'}).join('')+'</div><div class="ct"><h3>Pilih jalur apply</h3><div class="rd2"><label><input type="radio" name="jl" value="ofc"'+(ofc?' checked':' disabled')+'> <span>OFC (peluang lebih besar)</span></label><label><input type="radio" name="jl" value="gen"'+(ofc?'':' checked')+'> <span>General</span></label></div>'+(ofc?'':'<p style="font-size:13px"><a href="ofc.html">Daftar OFC dulu untuk jalur OFC</a></p>')+'<button class="hx-btn" id="go">Apply Tiket</button><p class="hx-note">Kalau kalah, poin dikembalikan penuh. Semuanya cuma undian halu.</p></div><p><a class="hx-btn o" href="teater-tiket.html">Show lain</a></p>';
$('go').onclick=function(){var s=load();if((s.ap||[]).some(function(a){return a.show===sh[0]&&a.status!=='lose'})){toast('Kamu sudah apply show ini');return}if(s.pt<PRICE){topupSoon();return}s.pt-=PRICE;var type=document.querySelector('input[name=jl]:checked').value;var id=addTx(s,{kind:'show',code:'SHOWHALU',title:sh[3],item:'Apply Tiket Teater',amount:-PRICE,method:'HALU_POINT'});s.ap=[{id:id,show:sh[0],type:type,status:'wait'}].concat(s.ap||[]);save(s);list();toast('Apply terkirim, cek hasil undiannya');mine.scrollIntoView({behavior:'smooth',block:'center'})}};
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
// tiket sobek versi halu: sengaja BEDA dari tiket asli (warna, huruf, cap besar)
function ticket(sh,seat){var c=document.createElement('canvas');c.width=1400;c.height=800;var x=c.getContext('2d'),F='"Plus Jakarta Sans",system-ui,sans-serif',INK='#12343b';
x.fillStyle='#bfeee6';x.fillRect(0,0,1400,800);
x.globalCompositeOperation='destination-out';for(var y=20;y<800;y+=40){x.beginPath();x.arc(0,y,13,0,7);x.arc(1400,y,13,0,7);x.fill()}x.globalCompositeOperation='source-over';
function t(s,px,py,size,col,w,al){x.textAlign=al||'left';x.fillStyle=col||INK;x.font=(w||800)+' '+size+'px '+F;x.fillText(s,px,py)}
function fit(s,px,py,size,max){do{x.font='800 '+size+'px '+F;size-=2}while(x.measureText(s).width>max&&size>24);x.textAlign='left';x.fillStyle=INK;x.fillText(s,px,py)}
x.save();x.translate(110,400);x.rotate(-Math.PI/2);t('HALU THEATER',0,0,56,INK,800,'center');x.restore();
x.setLineDash([10,12]);x.strokeStyle=INK;x.lineWidth=3;x.beginPath();x.moveTo(170,30);x.lineTo(170,770);x.stroke();x.setLineDash([]);
var d=dt(sh[1]),jam=sh[2].split(' ')[0],a=(+jam.slice(0,2))*60+(+jam.slice(3))-45,buka=String(Math.floor(a/60)).padStart(2,'0')+':'+String(a%60).padStart(2,'0');
fit(sh[3],220,130,72,1120);t('TIKET KHAYALAN · TEAM '+sh[4].toUpperCase(),220,185,30,'#0f7a6c');
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
