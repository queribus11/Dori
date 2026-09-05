/* Focus — analyseur de phrases en français (v3).
   parseTask(texte, todayISO) → {title, date, due, time, dur, urgent, important, ctx, client, waiting, waitFor, followUp, hints}
   - date  : jour où je m'y mets ("demain", "lundi", "le 15")
   - due   : échéance ("avant vendredi", "d'ici la semaine prochaine", "pour le 15", "à rendre le 15")
   Passes ordonnées : normalisation → mots-clés → @client → attente → durée explicite → plage horaire → heure → moment → date absolue → date relative → titre. */
const _pad=n=>String(n).padStart(2,'0');
const _iso=d=>d.getFullYear()+'-'+_pad(d.getMonth()+1)+'-'+_pad(d.getDate());
const _deacc=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');
function parseTask(input, todayISO, subjects){
  const pad=_pad,iso=_iso;
  const today=new Date(todayISO+'T12:00:00');
  const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
  const mk=(y,m,d)=>{const last=new Date(y,m,0).getDate();return new Date(y,m-1,Math.min(d,last),12);}; // m 1-12, jour borné
  const DOW={dimanche:0,lundi:1,mardi:2,mercredi:3,jeudi:4,vendredi:5,samedi:6};
  const MONTHS={janvier:1,fevrier:2,mars:3,avril:4,mai:5,juin:6,juillet:7,aout:8,septembre:9,octobre:10,novembre:11,decembre:12};
  const NUM={un:1,une:1,deux:2,trois:3,quatre:4,cinq:5,six:6,sept:7,huit:8,neuf:9,dix:10,onze:11,douze:12,quinze:15,vingt:20,trente:30,quarante:40,cinquante:50};
  let implicitLate=null;
  const r={title:'',date:'',due:'',time:'',dur:0,urgent:false,important:false,ctx:'',client:'',rubric:'',waiting:false,waitFor:'',followUp:'',recurring:'',repeat:null,hints:[]};

  /* ---- normalisation ---- */
  const deacc=_deacc;
  let raw=input.replace(/[’‘`´]/g,"'").replace(/[«»"“”]/g,' ').replace(/\s+/g,' ').trim();
  let s=' '+raw+' ';                       // original (pour le titre, ponctuation et liens conservés)
  let n=' '+deacc(raw).toLowerCase().replace(/[.,;!?…:](?=\s|$)|(?<=\s|^)[:]/g,' ')+' ';  // regex : ponctuation de fin de mot → espace, mêmes longueurs
  const subjKeys=(Array.isArray(subjects)?subjects:[]).map(x=>deacc(String(x)).toLowerCase().replace(/[_-]/g,' ').replace(/\s+/g,' ').trim());
  const isSubjWord=w=>subjKeys.includes(w); // un mot-clé qui est aussi un sujet (« Boulot ») n'est pas un mot-clé
  const rm=(i,l)=>{s=s.slice(0,i)+' '+s.slice(i+l);n=n.slice(0,i)+' '+n.slice(i+l);};
  const cut=(re,fn)=>{const m=n.match(re);if(!m)return null;const v=fn?fn(m):true;if(v===null||v===false)return null;rm(m.index,m[0].length);return v;};
  const nextDow=(d,inclToday)=>{let diff=(d-today.getDay()+7)%7;if(diff===0&&!inclToday)diff=7;return addD(today,diff);};
  const endOfWeek=()=>{const wd=today.getDay();return (wd>=1&&wd<=5)?nextDow(5,true):today;};
  const weekend=today.getDay()===0||today.getDay()===6; // « lundi prochain » dit un samedi = le lundi qui vient
  const num=w=>{const v=NUM[w]||parseInt(w,10);return isNaN(v)?1:v;};
  const DOWRE='(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)';
  const MONRE='(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)';
  const NUMRE='(\\d+|une|un|deux|trois|quatre|cinq|six|sept|huit|dix|quinze|vingt|trente|quarante|cinquante)';
  const setDate=(d,h)=>{r.date=iso(d);if(h)r.hints.push(h);};
  const setDue=(d,h)=>{r.due=iso(d);if(h)r.hints.push(h);};

  /* ---- récurrence : « chaque lundi », « tous les 15 du mois », « chaque premier lundi du mois », « tous les 2 jours »… ---- */
  {const NTH={premier:1,'1er':1,deuxieme:2,'2e':2,troisieme:3,'3e':3,dernier:-1};
   const lbl=m=>s.slice(m.index,m.index+m[0].length).trim().replace(/\s+/g,' ');
   let m;
   if((m=n.match(new RegExp("\\s(?:chaque|tous les|le)\\s(premier|1er|deuxieme|2e|troisieme|3e|dernier)\\s"+DOWRE+"\\s(?:du mois|de chaque mois)\\s")))){r.repeat={kind:'monthDow',nth:NTH[m[1]],dow:DOW[m[2]],label:lbl(m)};rm(m.index,m[0].length);}
   else if((m=n.match(/\s(?:chaque|tous les|le)\s(\d{1,2})(?:er)?\s(?:du mois|de chaque mois)\s(?!prochain\s)/))){r.repeat={kind:'month',day:+m[1],label:lbl(m)};rm(m.index,m[0].length);}
   else if((m=n.match(/\s(?:chaque|tous les)\s(?:jours? ouvres?|jours? de semaine)\s/))){r.repeat={kind:'week',dow:[1,2,3,4,5],label:lbl(m)};rm(m.index,m[0].length);}
   else if((m=n.match(new RegExp("\\s(?:chaque|tous les)\\s"+DOWRE+"s?\\s(?:(?:et|,)\\s(?:les?\\s)?"+DOWRE+"s?\\s)?(?:(?:et|,)\\s(?:les?\\s)?"+DOWRE+"s?\\s)?")))){r.repeat={kind:'week',dow:[m[1],m[2],m[3]].filter(Boolean).map(x=>DOW[x]),label:lbl(m)};rm(m.index,m[0].length);}
   else if((m=n.match(new RegExp("\\s(?:les?\\s)?"+DOWRE+"s?\\s(?:et|,)\\s(?:les?\\s)?"+DOWRE+"s?\\s(?:(?:et|,)\\s(?:les?\\s)?"+DOWRE+"s?\\s)?(?!prochain|d'apres|en huit|\\d{1,2}\\s(?!h))")))){ /* « lundi et mercredi » = chaque lundi et mercredi */
     r.repeat={kind:'week',dow:[m[1],m[2],m[3]].filter(Boolean).map(x=>DOW[x]),label:'chaque '+lbl(m).replace(/^les?\s/i,'')};rm(m.index,m[0].length);}
   else if((m=n.match(/\s(?:chaque|tous les|toutes les)\s(?:(\d+|deux|trois|quatre|six)\s)?(jours?|semaines?|mois|ans?|annees?|matins?|soirs?)\s/))){
     const k=m[1]?num(m[1]):1,u=m[2];
     if(u.startsWith('matin')||u.startsWith('soir')){r.repeat={kind:'day',n:1,label:lbl(m)};if(!r.time)r.time=u.startsWith('matin')?'09:00':'18:00';}
     else if(u.startsWith('jour'))r.repeat={kind:'day',n:k,label:lbl(m)};
     else if(u.startsWith('sem'))r.repeat={kind:'week',n:k,dow:[today.getDay()],label:lbl(m)};
     else if(u==='mois')r.repeat={kind:'month',n:k,day:today.getDate(),label:lbl(m)};
     else r.repeat={kind:'year',label:lbl(m)};
     rm(m.index,m[0].length);}
   if(r.repeat)r.recurring=r.repeat.label;}

  /* ---- mots-clés ---- */
  if(cut(/\s(prioritaire|priorite haute|top priorite)\s/))r.urgent=r.important=true;
  if(cut(/\s(urgent|urgente|urgemment|en urgence|asap)\s/))r.urgent=true;
  if(cut(/\s(important|importante)\s/))r.important=true;
  if(!isSubjWord('perso')&&cut(/\s(perso|personnel|personnelle)\s/))r.ctx='perso';
  if(cut(/\s(pro|boulot|professionnel|professionnelle)\s/,m=>isSubjWord(m[1])?null:true))r.ctx='pro';

  /* ---- @Sujet / @Sujet/Rubrique ; sujets connus reconnus sans arobase et en plusieurs mots ---- */
  {const known=(Array.isArray(subjects)?subjects:[]).filter(x=>x&&x.trim()).map(x=>({name:x,key:deacc(x).toLowerCase().replace(/[_-]/g,' ').replace(/\s+/g,' ').trim()})).sort((a,b)=>b.key.length-a.key.length);
   const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   const rub=m=>m[1]?s.slice(m.index,m.index+m[0].length).split('/')[1].trim():''; // rubrique avec sa casse d'origine
   let found=null;implicitLate=null;
   for(const k of known){ // « @Projet X/EB », « @projet x »
     const m=n.match(new RegExp("\\s[@#]"+esc(k.key).replace(/ /g,'[ _-]')+"(?:\\/([\\p{L}\\p{N}][\\p{L}\\p{N}_.-]*))?\\s",'u'));
     if(m){found={name:k.name,rubric:rub(m),i:m.index,l:m[0].length};break;}}
   if(!found){const m=s.match(/\s[@#]([\p{L}\p{N}][\p{L}\p{N}_.-]*)(?:\/([\p{L}\p{N}][\p{L}\p{N}_.-]*))?\s/u);if(m)found={name:m[1].replace(/_/g,' '),rubric:m[2]||'',i:m.index,l:m[0].length};}
   if(!found)for(const k of known){ // sujet cité sans arobase, en tête de phrase ou après pour / sur / dans / côté : « maison changer l'ampoule », « pour projet x rédiger l'EB »
     const kk=esc(k.key).replace(/ /g,'[ _-]');
     const m=n.match(new RegExp("^\\s"+kk+"(?:\\/([\\p{L}\\p{N}][\\p{L}\\p{N}_.-]*))?\\s",'u'))||n.match(new RegExp("\\s(?:pour|sur|dans|cote)\\s(?:le\\s|la\\s|l'|les\\s)?"+kk+"(?:\\/([\\p{L}\\p{N}][\\p{L}\\p{N}_.-]*))?\\s",'u'));
     if(m){found={name:k.name,rubric:rub(m),i:m.index,l:m[0].length,implicit:true};break;}}
   implicitLate=()=>{ // après les dates : sujet en fin de phrase sans article (« tondre la pelouse maison samedi ») ; « avant les vacances » reste une phrase
     if(r.client)return;
     for(const k of known){const kk=esc(k.key).replace(/ /g,'[ _-]');const m=n.match(new RegExp("(?<!\\s(?:le|la|les|l'|du|des|de|d'|au|aux|un|une|mon|ma|mes|ton|ta|tes|son|sa|ses|nos|vos|leurs?|en|a))\\s"+kk+"\\s*$",'u'));
       if(m&&m.index>0){r.client=k.name;r.hints.push('sujet '+k.name);rm(m.index,m[0].length);return;}}};
   if(found){r.client=found.name;r.rubric=found.rubric.replace(/_/g,' ');if(found.implicit)r.hints.push('sujet '+found.name);rm(found.i,found.l);}}

  /* ---- en attente de ---- */
  {const m=n.match(/\s(?:en attente d(?:e|u|es|')|attendre|j'attends|attente de|attente du)\s?(.+?)(?=\s(?:relancer|relance|puis|et|avant|d'ici|pour|dans|le \d|demain|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s|\s$)/);
    if(m){r.waiting=true;const seg=s.slice(m.index,m.index+m[0].length);r.waitFor=seg.replace(/^\s*(en attente d(?:e|u|es|')|attendre|j'attends|attente de|attente du)\s?/i,'').trim();rm(m.index,m[0].length);}
    const f=cut(/\s(?:puis\s)?(?:relancer|relance|rappel|relancer dans|relance dans)\s(?:dans\s)?(\d+|une|un|deux|trois|quatre|cinq|six|sept|huit|dix|quinze)\s?(jours?|semaines?)\s/,m=>[num(m[1]),m[2]]);
    if(f){r.waiting=true;r.followUp=iso(addD(today,f[1].startsWith('sem')?7*f[0]:f[0]));r.hints.push('relance dans '+f[0]+' '+f[1]);}
    else{const g=cut(new RegExp("\\s(?:puis\\s)?(?:relancer|relance)\\s(?:le\\s)?"+DOWRE+"\\s(prochain\\s)?"),m=>[m[1],!!m[2]]);
      if(g){r.waiting=true;let x=nextDow(DOW[g[0]],false);if(g[1]&&x-today<3*864e5)x=addD(x,7);r.followUp=iso(x);r.hints.push('relance '+g[0]);}
      else{const h2=cut(/\s(?:puis\s)?(?:relancer|relance)\sle\s(\d{1,2})\s(?!\d|h)/,m=>+m[1]);
        if(h2){r.waiting=true;let x=mk(today.getFullYear(),today.getMonth()+1,h2);if(x<=today)x=mk(today.getFullYear(),today.getMonth()+2,h2);r.followUp=iso(x);r.hints.push('relance le '+h2);}}}
  }

  /* « dans 1h », « dans 30 minutes », « dans une heure et demie » : heure = maintenant + N */
  {const now=(typeof parseTask.now==='function'?parseTask.now():new Date());
   const m=cut(/\sdans\s(\d+|une|un|deux|trois|quatre|cinq|dix|quinze|vingt|trente|quarante-cinq|quarante)\s?(h|heures?|min|mins|minutes?)\s?(et demie?)?\s/,m=>[num(m[1]),m[2],!!m[3]]);
   if(m){const mins=m[1].startsWith('h')?m[0]*60+(m[2]?30:0):m[0];const d=new Date(now.getTime()+mins*60000);r.time=pad(d.getHours())+':'+pad(d.getMinutes());setDate(new Date(d.getFullYear(),d.getMonth(),d.getDate(),12),'dans '+m[0]+' '+m[1]);}}
  /* ---- durée explicite ---- */
  let d;
  if((d=cut(/\s(?:pendant|duree|pour)?\s?(?:une|un)?\s?demi[- ]heure\s/,()=>30)))r.dur=d;
  else if((d=cut(/\s(?:pendant|duree|pour)?\s?(?:un\s)?quart d'heure\s/,()=>15)))r.dur=d;
  else if((d=cut(/\s(?:pendant|duree|pour)?\s?trois quarts d'heure\s/,()=>45)))r.dur=d;
  else if((d=cut(new RegExp("\\s(?:pendant|duree)\\s"+NUMRE+"\\s?(?:heures?|h)\\s?(?:et demie?|(\\d{2}))?\\s"),m=>num(m[1])*60+(/et demie?/.test(m[0])?30:(m[2]?parseInt(m[2],10):0)))))r.dur=d;
  else if((d=cut(new RegExp("\\s(?:pendant|duree|pour|de|d')?\\s?"+NUMRE+"\\s?(?:min|mins|minutes?)\\s"),m=>num(m[1]))))r.dur=d;
  else if((d=cut(/\s(?:pendant|duree|pour|de)?\s?(une|deux|trois)\s?heures?\s(trente|quinze|quarante-cinq)\s/,m=>num(m[1])*60+({trente:30,quinze:15,'quarante-cinq':45}[m[2]]))))r.dur=d;
  else if((d=cut(/\s(?:pendant|duree|pour)?\s?(\d+|une|un|deux|trois)\s?(?:journees?|jours? de travail|demi-journees?)\s/,m=>/demi/.test(m[0])?240:num(m[1])*480)))r.dur=d;
  else if((d=cut(/\s(?!a\s|vers\s)(une|deux|trois|quatre)\s?heures?\s?(et demie?)?\s(?!du matin|de l'apres|du soir)/,m=>num(m[1])*60+(m[2]?30:0))))r.dur=d;

  /* ---- plage horaire "de 14h à 16h" ---- */
  {const m=cut(/\s(?:de\s)?(\d{1,2})\s?(?:h|heures?)\s?(\d{2})?\s?(?:a|-|–)\s?(\d{1,2})\s?(?:h|heures?)\s?(\d{2})?\s/,m=>[+m[1],m[2]?+m[2]:0,+m[3],m[4]?+m[4]:0]);
    if(m){r.time=pad(m[0])+':'+pad(m[1]);const mins=(m[2]*60+m[3])-(m[0]*60+m[1]);if(mins>0&&!r.dur)r.dur=mins;}}

  /* ---- heure ---- */
  const toTime=(h,mi,q)=>{q=q||'';if((q.includes('apres')||q.includes('soir')||q.includes('aprem'))&&h<12)h+=12;else if(!q&&h>=1&&h<=6)h+=12;if(h>23||h<0)return null;return pad(h)+':'+pad(mi||0);};
  if(!r.time){
    let t=cut(/(?<!il y)\s(?:a|vers|des|pour)\s?(\d{1,2})\s?(?:h|heures?|:)\s?(\d{2})?\s?(et demie?|et quart|moins le quart)?\s?(du matin|de l'apres-midi|du soir|de l'aprem)?\s/,m=>{
      let h=+m[1],mi=m[2]?+m[2]:0;if(m[3]==='et demie'||m[3]==='et demi')mi=30;else if(m[3]==='et quart')mi=15;else if(m[3]==='moins le quart'){h-=1;mi=45;}return toTime(h,mi,m[4]);});
    if(!t)t=cut(/\s(?:a|vers)\s(une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze)\s?heures?\s?(et demie?|et quart)?\s?(du matin|de l'apres-midi|du soir)?\s/,m=>toTime(num(m[1]),m[2]?(m[2]==='et quart'?15:30):0,m[3]));
    if(!t)t=cut(/\s(?:a\s)?midi\s?(et demie?)?\s/,m=>m[1]?'12:30':'12:00');
    if(!t)t=cut(/\s(?:a\s)?minuit\s/,()=>'00:00');
    if(t)r.time=t;
  }
  /* "Nh du matin / du soir" = heure ; "Nh" nu : durée si N<=4, sinon heure (5..23) */
  {const q=cut(/\s(\d{1,2})\s?h\s?(\d{2})?\s?(du matin|du soir|de l'apres-midi)\s/,m=>toTime(+m[1],m[2]?+m[2]:0,m[3]));if(q&&!r.time)r.time=q;}
  {const m=n.match(/\s(\d{1,2})\s?h\s?(\d{2})?\s/);
    if(m){const h=+m[1],mi=m[2]?+m[2]:0;
      if(h<=4&&!r.dur&&!/\s(?:a|vers)\s$/.test(n.slice(0,m.index+1))){r.dur=h*60+mi;rm(m.index,m[0].length);}
      else if(!r.time&&h>=5&&h<=23){r.time=pad(h)+':'+pad(mi);rm(m.index,m[0].length);}}}

  /* ---- moment de la journée (se combine à une date) ---- */
  let moment=null;
  if(cut(/\s(?:ce|le|en|dans la)?\s?soir(?:ee)?\s/))moment=['18:00','soir'];
  else if(cut(/\s(?:cet?|l'|en|dans l')?\s?(?:apres-midi|aprem|apres midi)\s/))moment=['14:00','après-midi'];
  else if(cut(/\s(?:ce|le|dans la)?\s?matin(?:ee)?\s/)||cut(/\s(?:tot|de bonne heure)\s/))moment=['09:00','matin'];
  else if(cut(/\s(?:a|au)\s?dejeuner\s/))moment=['12:30','déjeuner'];
  if(moment&&r.time){const h=+r.time.slice(0,2);if(moment[1]!=='matin'&&h<12)r.time=pad(h+12)+r.time.slice(2);}

  /* ---- date absolue ---- */
  const DUE="(?:avant le|d'ici le|pour le|a rendre le|a rendre pour le|a remettre le|echeance le|deadline le|deadline|jusqu'au)";
  const isDueM=m=>new RegExp('^\\s'+DUE).test(m);
  let m;
  const DUEW="(?:avant|d'ici|pour|a rendre|a rendre pour|a remettre|jusqu'a|jusqu'au)";
  const monthYear=mo=>{let y=today.getFullYear();if(mk(y,mo,28)<today&&mo<today.getMonth()+1)y++;return y;}; // mois passé → l'an prochain
  if((m=cut(new RegExp("\\s(?:"+DUEW+"\\s)?(?:la\\s)?(fin|mi|debut)(?:\\s(?:du mois\\s)?(?:de|d')?|-)\\s?"+MONRE+"(?:\\s(\\d{4}))?\\s"),m=>[m[0],m[1],MONTHS[m[2]],m[3]?+m[3]:null]))){ /* « fin novembre », « mi-octobre », « début mars », « avant la fin novembre » */
    const y=m[3]||monthYear(m[2]);const x=m[1]==='fin'?new Date(y,m[2],0,12):m[1]==='mi'?mk(y,m[2],15):mk(y,m[2],1);
    const isDue=new RegExp('^\\s'+DUEW).test(m[0])||m[1]==='fin';(isDue?setDue:setDate)(x,m[1]+' '+Object.keys(MONTHS)[m[2]-1]);}
  else if((m=cut(/\s(?:la\s)?semaine du\s(\d{1,2})(?:er)?\s(?:(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)\s)?/,m=>[+m[1],m[2]?MONTHS[m[2]]:null]))){ /* « la semaine du 21 » → le lundi de cette semaine-là */
    let x=m[1]?mk(monthYear(m[1]),m[1],m[0]):mk(today.getFullYear(),today.getMonth()+1,m[0]);if(!m[1]&&x<addD(today,-6))x=mk(today.getFullYear(),today.getMonth()+2,m[0]);
    x=addD(x,-((x.getDay()+6)%7));if(x<today)x=today;setDate(x,'semaine du '+m[0]+' → lundi');}
  else if(cut(/\s(?:a la|pour la|d'ici la|avant la)\srentree\s/)){const y=today.getFullYear()+(today.getMonth()+1>=9?1:0);setDate(mk(y,9,1),'à la rentrée → 1er septembre');}
  else if((m=cut(new RegExp("\\s(?:"+DUE+"|le|ce)?\\s?(?:"+DOWRE+"\\s)?(\\d{1,2})(?:er)?\\s"+MONRE+"(?:\\s(\\d{4}))?\\s"),m=>[m[0],+m[2],MONTHS[m[3]],m[4]?+m[4]:null]))){
    let y=m[3]||today.getFullYear();let x=mk(y,m[2],m[1]);if(!m[3]&&x<today)x=mk(y+1,m[2],m[1]);
    (isDueM(m[0])?setDue:setDate)(x,(isDueM(m[0])?'échéance ':'')+'le '+m[1]+' '+Object.keys(MONTHS)[m[2]-1]);}
  else if((m=cut(new RegExp("\\s(?:"+DUE+"|le|ce)?\\s?(?:"+DOWRE+"\\s)?(\\d{1,2})\\/(\\d{1,2})(?:\\/(\\d{2,4}))?\\s"),m=>[m[0],+m[2],+m[3],m[4]?+m[4]:null]))){
    let y=m[3]?(m[3]<100?2000+m[3]:m[3]):today.getFullYear();let x=mk(y,m[2],m[1]);if(!m[3]&&x<today)x=mk(y+1,m[2],m[1]);
    (isDueM(m[0])?setDue:setDate)(x,(isDueM(m[0])?'échéance ':'')+'le '+pad(m[1])+'/'+pad(m[2]));}
  else if((m=cut(/\s(?:le\s)?(\d{1,2})(?:er)?\sdu mois prochain\s/,m=>+m[1]))){setDate(mk(today.getFullYear(),today.getMonth()+2,m),'le '+m+' du mois prochain');}
  else if((m=cut(new RegExp("\\s(?:"+DUE+"|le)\\s(\\d{1,2})(?:er)?\\s(?!\\d|h)"),m=>[m[0],+m[1]]))){
    let x=mk(today.getFullYear(),today.getMonth()+1,m[1]);if(x<today)x=mk(today.getFullYear(),today.getMonth()+2,m[1]);
    (isDueM(m[0])?setDue:setDate)(x,(isDueM(m[0])?'échéance ':'')+'le '+m[1]);}
  else if((m=cut(new RegExp("\\s(?:ce|le)?\\s?"+DOWRE+"\\s(\\d{1,2})\\s(?!h|\\d)"),m=>[m[1],+m[2]]))){ /* "jeudi 10" */
    let x=mk(today.getFullYear(),today.getMonth()+1,m[1]);if(x<today)x=mk(today.getFullYear(),today.getMonth()+2,m[1]);setDate(x,m[0]+' '+m[1]);}

  /* ---- date relative ---- */
  if(!r.date&&!r.due){
    const dueP="(?:avant|d'ici|pour|a rendre|a rendre pour|a remettre|jusqu'a|jusqu'au)";
    if(cut(new RegExp("\\s(?:"+dueP+"\\s)?(?:la\\s)?fin (?:de\\s(?:la\\s)?)?semaine prochaine\\s"))){let x=nextDow(1,false);setDue(addD(x,4),'fin de la semaine prochaine → vendredi prochain');}
    else if(cut(new RegExp("\\s(?:"+dueP+"\\s)?(?:la\\s)?fin (?:du|de)\\s?mois prochain\\s"))){setDue(new Date(today.getFullYear(),today.getMonth()+2,0,12),'fin du mois prochain');}
    else if((m=cut(/\s(?:le\s)?(\d{1,2})(?:er)?\sdu mois prochain\s/,m=>+m[1]))){setDate(mk(today.getFullYear(),today.getMonth()+2,m),'le '+m+' du mois prochain');}
    else if(cut(/\s(?:le\s)?(?:debut|debut de)\s?(?:la\s)?semaine prochaine\s/))setDate(nextDow(1,false),'début de semaine prochaine → lundi');
    else if(cut(new RegExp("\\s"+dueP+"\\s(?:la\\s)?semaine prochaine\\s")))setDue(endOfWeek(),'avant la semaine prochaine → fin de cette semaine');
    else if(cut(new RegExp("\\s"+dueP+"\\s(?:la\\s)?fin (?:de\\s(?:la\\s)?|du\\s)?semaine\\s"))||cut(/\s(?:en\s)?fin de (?:la\s)?semaine\s/)||cut(/\scette semaine\s/))setDue(endOfWeek(),'fin de semaine');
    else if(cut(new RegExp("\\s(?:"+dueP+"\\s)?(?:la\\s)?fin (?:du|de|de ce)\\s?mois\\s"))){setDue(new Date(today.getFullYear(),today.getMonth()+1,0,12),'fin du mois');}
    else if(cut(new RegExp("\\s"+dueP+"\\sapres-demain\\s")))setDue(addD(today,2),'échéance après-demain');
    else if(cut(new RegExp("\\s"+dueP+"\\sdemain\\s")))setDue(addD(today,1),'échéance demain');
    else if((m=cut(new RegExp("\\s(avant|d'ici|pour|a rendre|a rendre pour|a remettre|jusqu'a|jusqu'au)\\s(?:le\\s)?"+DOWRE+"\\s(prochain\\s)?"),m=>[m[1],m[2],!!m[3]]))){
      let x=nextDow(DOW[m[1]],false);if(m[2]&&x-today<3*864e5&&!weekend)x=addD(x,7);
      if(m[0]==='avant'){x=addD(x,-1);if(x<today)x=today;}setDue(x,(m[0]==='avant'?'avant ':'pour ')+m[1]+(m[0]==='avant'?' → la veille':''));}
    else if(cut(/\s(?:la\s)?semaine prochaine\s/))setDate(nextDow(1,false),'semaine prochaine → lundi');
    else if(cut(/\s(?:le\s)?mois prochain\s/))setDate(new Date(today.getFullYear(),today.getMonth()+1,1,12),'mois prochain');
    else if(cut(/\s(?:ce\s)?week-?end\s/)){const wd=today.getDay();setDate(wd===6||wd===0?today:nextDow(6,true),'ce week-end → samedi');}
    else if(cut(/\sapres-demain\s/))setDate(addD(today,2),'après-demain');
    else if(cut(/\sdemain\s/))setDate(addD(today,1),'demain');
    else if(cut(/\s(?:aujourd'hui|ce jour)\s/))setDate(today,"aujourd'hui");
    else if((m=cut(new RegExp("\\s(?:le\\s)?"+DOWRE+"\\s(d'apres|en huit|en 8|suivant)\\s"),m=>m[1]))){setDate(addD(nextDow(DOW[m],false),7),m+' d\'après');}
    else if((m=cut(new RegExp("\\s(?:le\\s)?"+DOWRE+"\\s(prochain|qui vient)\\s"),m=>m[1]))){let x=nextDow(DOW[m],false);if(x-today<3*864e5&&!weekend)x=addD(x,7);setDate(x,m+' prochain');}
    else if((m=cut(new RegExp("\\s(?:le\\s|ce\\s)?"+DOWRE+"\\s"),m=>m[1]))){setDate(nextDow(DOW[m],true),m);}
    else if((m=cut(/\sdans\s(\d+|une|un|deux|trois|quatre|cinq|six|sept|huit|dix|quinze)\s?(jours?|semaines?|mois)\s/,m=>[num(m[1]),m[2]]))){
      const k=m[0];if(m[1].startsWith('sem'))setDate(addD(today,7*k),'dans '+k+' semaine(s)');else if(m[1]==='mois'){setDate(mk(today.getFullYear(),today.getMonth()+1+k,today.getDate()),'dans '+k+' mois');}else setDate(addD(today,k),'dans '+k+' jour(s)');}
  }
  if(implicitLate)implicitLate();
  if(moment){if(!r.date&&!r.due&&!r.repeat)setDate(today,moment[1]);if(!r.time)r.time=moment[0];}
  if(r.repeat&&!r.date&&!r.due){r.date=parseTask.nextRepeat(r.repeat,todayISO,true);r.hints.push('répétée : '+r.repeat.label);}
  if(r.time&&!r.date&&!r.due)setDate(today,"heure sans date → aujourd'hui");

  /* ---- titre ---- */
  let title=s.replace(/\s+/g,' ').trim();
  title=title.replace(/^(?:ne pas oublier d'|rappelle[- ]moi d'|penser [aà] |pense [aà] |penser (?:au|aux|à la|a la|à l'|a l') |pense (?:au|aux|à la|a la|à l'|a l') )/i,'');
  title=title.replace(/^(?:il faut|je dois|penser [aà]|pense [aà]|ne pas oublier de|ne pas oublier d'|noter|ajouter|nouvelle t[aâ]che|t[aâ]che|rappelle[- ]moi de|rappelle[- ]moi d'|me rappeler de|rappelle[- ]moi|rappel|a faire|à faire)\s+/i,'');
  title=title.replace(/^(?:rappelle[- ]moi|rappel)$/i,'');
  for(let i=0;i<3;i++){
    title=title.replace(/\s+(?:avant|d'ici|pour|à|a|le|la|les|de|du|des|et|en|dès|vers|pendant|durée|puis|ce|cet|cette|au|aux|:)$/i,'').trim();
    title=title.replace(/^(?:avant|d'ici|pour|à|a|le|la|de|du|et|en|puis|:|-)\s+/i,'').trim();
  }
  title=title.replace(/\s(?:de|d'|pour|pendant)\s+(?=avec\b|chez\b)/g,' ');
  title=title.replace(/\s+,/g,',').replace(/^[,;:\-–]\s*/,'').replace(/\s*[,;:\-–.!?…]+$/,'').replace(/\s+/g,' ').trim();
  if(!title&&r.waiting)title=r.waitFor?r.waitFor:'Relance';
  if(!title&&(r.time||r.date))title='Rappel';
  if(title&&!/^https?:\/\//i.test(title))title=title.charAt(0).toUpperCase()+title.slice(1);
  r.title=title;
  return r;
}
/* Prochaine occurrence d'une répétition à partir de fromISO (inclusive : fromISO compte s'il convient). */
parseTask.nextRepeat=function(rep,fromISO,inclusive){
  const from=new Date(fromISO+'T12:00:00');const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
  const mk=(y,m,d)=>{const last=new Date(y,m,0).getDate();return new Date(y,m-1,Math.min(d,last),12);};
  const n=Math.max(1,rep.n||1);
  if(rep.kind==='day')return _iso(inclusive?from:addD(from,n));
  if(rep.kind==='week'){const dows=(rep.dow||[]).length?rep.dow:[from.getDay()];let x=inclusive?from:addD(from,1);
    for(let i=0;i<8;i++,x=addD(x,1))if(dows.includes(x.getDay())){if(n>1&&!inclusive)x=addD(x,7*(n-1));return _iso(x);}}
  if(rep.kind==='month'){const day=rep.day||from.getDate();let x=mk(from.getFullYear(),from.getMonth()+1,day);
    if(x<from||(!inclusive&&_iso(x)===fromISO))x=mk(from.getFullYear(),from.getMonth()+1+n,day);return _iso(x);}
  if(rep.kind==='monthDow'){const nthOf=(y,m)=>{if(rep.nth>0){let x=new Date(y,m-1,1,12);while(x.getDay()!==rep.dow)x=addD(x,1);return addD(x,7*(rep.nth-1));}
      let x=new Date(y,m,0,12);while(x.getDay()!==rep.dow)x=addD(x,-1);return x;};
    let x=nthOf(from.getFullYear(),from.getMonth()+1);if(x<from||(!inclusive&&_iso(x)===fromISO))x=nthOf(from.getFullYear(),from.getMonth()+2);return _iso(x);}
  if(rep.kind==='year'){let x=mk(from.getFullYear(),from.getMonth()+1,from.getDate());if(!inclusive)x=mk(from.getFullYear()+1,from.getMonth()+1,from.getDate());return _iso(x);}
  return '';
};
if(typeof module!=='undefined')module.exports=parseTask;
