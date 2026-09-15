import { CATALOG, BY_ID, MUSCLES } from './data/catalog.js';
import { DAYS, defaultState } from './data/state.js';
import { loadState, persistState, flushState, storageStatus } from './services/storage.js';
import './services/media.js';
import { belongsTo, createExercise, reserveGroups, replacementTargets, replaceExercise } from './data/workout.js';
import { RECOMMENDATIONS } from './data/recommendations.js';
import { readPreferences, savePreferences, setupNavigation } from './ui/navigation.js';
const DEFAULT_REST = { "Peito":"90–120 s","Costas":"90–120 s","Bíceps":"60–90 s","Tríceps":"60–90 s","Deltoides":"60–90 s","Ombros":"60–90 s","Pernas":"90–120 s","Panturrilhas":"60–90 s","Abdômen":"60–90 s","Trapézio":"60–90 s","Antebraço":"60–90 s","Glúteos":"60–90 s" };
let state = await loadState();
document.getElementById('storageStatus').textContent=storageStatus;
const preferences=readPreferences();
let currentFichaDay = Math.max(0,DAYS.indexOf(preferences.day));
let currentLibraryMuscle = MUSCLES.includes(preferences.libraryMuscle)?preferences.libraryMuscle:'Todos';
let currentRecommendation = RECOMMENDATIONS.some(x=>x.id===preferences.recommendation)?preferences.recommendation:'massa';
let timers = {};
let navigation;

function saveState(){ persistState(state); }
function toast(msg){
  const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");
  clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800);
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function mediaDetails(x,showSource=false){
  return `${x.mediaCaption?`<p class="media-caption">${esc(x.mediaCaption)}</p>`:''}${showSource?`<a class="media-source" href="https://www.hipertrofia.org/blog/exercicios-de-musculacao/" target="_blank" rel="noopener">Referência no Hipertrofia.org ↗</a>`:''}`;
}
function exerciseData(id){
  const x=BY_ID[id]; if(!x) return null;
  return x;
}
function normalizeDayExercises(day){
  state.days[day].exercises = state.days[day].exercises.filter(e=>BY_ID[e.id]);
}
function switchView(id){
  navigation.go(id);
}
function renderView(id){
  if(id==="fichaView") renderFicha();
  if(id==="treinoView") renderBuilder();
  if(id==="bibliotecaView") renderLibrary();
  if(id==="recomendacoesView") renderRecommendations();
  if(id==='configuracoesView')document.getElementById('settingsSessionDay').value=DAYS[currentFichaDay];
}

function renderFicha(){
  const visibleDays=DAYS.filter(day=>!['Sábado','Domingo'].includes(day)||state.days[day].exercises.length>0);
  if(!visibleDays.length) return;
  if(!visibleDays.includes(DAYS[currentFichaDay])) currentFichaDay=DAYS.indexOf(visibleDays[0]);
  const tabs=document.getElementById("fichaDayTabs");
  tabs.innerHTML=visibleDays.map(d=>{const i=DAYS.indexOf(d);return `<button class="day-tab ${i===currentFichaDay?"active":""}" data-i="${i}">${dayIcon(d)}<br>${d}</button>`}).join("");
  tabs.querySelectorAll("button").forEach(b=>b.onclick=()=>{currentFichaDay=+b.dataset.i;savePreferences({day:DAYS[currentFichaDay]});renderFicha()});
  const wrap=document.getElementById("fichaDays");
  wrap.innerHTML=visibleDays.map(d=>renderFichaDay(d,d===DAYS[currentFichaDay])).join("");
  bindFicha();
  updateTimers();
}
function dayIcon(d){return ({Segunda:"SEG",Terça:"TER",Quarta:"QUA",Quinta:"QUI",Sexta:"SEX"})[d]||d.slice(0,3).toUpperCase()}
function renderFichaDay(day,active){
  const data=state.days[day]; normalizeDayExercises(day);
  if(!active) return `<div class="day-panel"></div>`;
  const groups=[];
  groups.push([...data.exercises].sort((a,b)=>Number(!!a.done)-Number(!!b.done)).map(e=>renderExerciseCard(e.id,day)).join(''));
  const extras=reserveGroups(data);
  return `<div class="day-panel active">
    <div class="day-title"><h3>${day} — ${data.muscles.length?esc(data.muscles.join(" + ")):"Nenhum treino configurado"}</h3>
    <p>${data.exercises.length} exercício(s) configurado(s)</p></div>
    ${groups.join("") || `<div class="empty">Ainda não há exercícios neste dia. Vá em <b>Meu Treino</b> para montar sua ficha.</div>`}
    ${data.muscles.length ? `<section class="suggestions"><h3>Exercícios reservas</h3><p>Aparelho ocupado ou prefere outra opção? Escolha uma reserva e substitua um exercício da ficha.</p>${extras.map(group=>`<section class="reserve-group"><h4>${esc(group.muscle)}</h4><div class="suggestion-grid">${group.exercises.map(x=>renderSuggestion(x,day,group.muscle)).join('')||'<p class="empty">Todas as opções deste grupo já estão na ficha.</p>'}</div></section>`).join('')}</section>`:""}
  </div>`;
}
function renderExerciseCard(id,day){
  const x=exerciseData(id), e=state.days[day].exercises.find(z=>z.id===id);
  if(!x||!e)return "";
  const done=!!e.done, restSeconds=restToSeconds(e.rest||DEFAULT_REST[x.muscle]||"90");
  const cardio=x.kind==='cardio';
  return `<article class="exercise-card ${done?"done":""}" data-id="${esc(id)}" data-day="${esc(day)}">
    <div class="card-main">
      <div class="card-info">
        <div class="eyebrow">${esc(e.muscle)}</div>
        <div class="card-title">${esc(x.name)}</div>
        <div class="card-desc">${esc(x.description)}</div>${mediaDetails(x)}
        <div class="meta"><span class="tag">🔧 ${esc(x.equipment)}</span>${x.gif?`<span class="tag">${/\.gif$/i.test(x.gif)?'🎞️ GIF':'🖼️ Imagem'}</span>`:'<span class="tag">Sem demonstração</span>'}</div>
      </div>
      <div class="media ${x.gif?"":"missing"}">${x.gif?`<img loading="lazy" src="${esc(x.gif || "/public/media-unavailable.svg")}" alt="Execução: ${esc(x.name)}">`:""}</div>
    </div>
    <div class="fields">
      ${cardio?`<div class="field"><label>Tempo (min)</label><input data-field="duration" type="number" min="0.1" max="1440" step="0.1" value="${esc(e.duration||'')}" placeholder="ex.: 20"></div>
      <div class="field"><label>Distância (km)</label><input data-field="distance" type="number" min="0" step="0.01" value="${esc(e.distance||'')}" placeholder="Opcional"></div>
      <div class="field"><label>Intensidade / nível</label><input data-field="intensity" value="${esc(e.intensity||'')}" placeholder="Opcional"></div>`:`
      <div class="field"><label>Séries</label><input type="number" min="1" max="100" data-field="sets" value="${esc(e.sets||"3")}"></div>
      <div class="field"><label>Reps alvo</label><input data-field="targetReps" value="${esc(e.targetReps||"8–12")}"></div>
      <div class="field"><label>Peso (kg)</label><input data-field="weight" type="number" min="0" step="0.5" value="${esc(e.weight||"")}" placeholder="ex.: 20"></div>
      `}
    </div>
    ${cardio?'':`<div class="note-row"><label class="sub">Descanso (segundos)</label><input data-field="rest" type="number" min="1" max="7200" value="${restSeconds}"></div>`}
    <div class="controls">
      <button class="btn done-btn" data-action="done">${done?"↩️ Desfazer":"✓ Concluído"}</button>
      <button class="btn" data-action="timer" data-seconds="${cardio?Math.round(Number(e.duration||0)*60):restSeconds}" ${cardio&&!Number(e.duration)?'disabled':''}>${cardio?'▶ Iniciar cardio':'⏱️ Iniciar descanso'}</button>
      <span class="timer" data-timer="${day}:${id}">--:--</span>
      <button class="btn" data-action="openGif">Ver demonstração</button>
    </div>
    <div class="note-row"><input data-field="note" value="${esc(e.note||"")}" placeholder="Observação: última série difícil, aumentar carga..."></div>
  </article>`;
}
function renderSuggestion(x,day,muscle){
  const available=replacementTargets(state.days[day],x.id,muscle).length>0;
  return `<article class="suggestion"><img loading="lazy" src="${esc(x.gif || "/public/media-unavailable.svg")}" alt="Demonstração: ${esc(x.name)}"><div class="suggestion-body"><strong>${esc(x.name)}</strong><small>${esc(x.equipment)}</small>${x.mediaCaption?`<small>${esc(x.mediaCaption)}</small>`:''}<button class="btn primary" data-suggest="${esc(x.id)}" data-day="${esc(day)}" data-muscle="${esc(muscle)}" ${available?'':'disabled'}>Substituir</button>${available?'':'<small>Nenhum exercício pendente neste grupo.</small>'}</div></article>`;
}
function openReplaceModal(day,newId,muscle){
  const candidates=replacementTargets(state.days[day],newId,muscle);
  const cardio=BY_ID[newId].kind==='cardio';
  document.getElementById('modalTitle').textContent='Usar '+BY_ID[newId].name;
  document.getElementById('modalContent').innerHTML=`<p class="sub">Qual exercício de ${esc(muscle)} você quer substituir? ${cardio?'A troca mantém a posição e o tempo planejado. Ajuste a intensidade para a nova atividade.':'A troca mantém a posição, séries e repetições. Ajuste a carga para o novo exercício.'}</p><div class="replacement-options">${candidates.map(e=>`<button class="btn" data-replace-id="${esc(e.id)}">Substituir ${esc(BY_ID[e.id].name)}</button>`).join('')||'<p class="empty">Não há exercícios pendentes para substituir.</p>'}</div>`;
  document.querySelectorAll('[data-replace-id]').forEach(button=>button.onclick=()=>{
    try{
      replaceExercise(state.days[day],button.dataset.replaceId,newId,muscle);
      delete timers[day+':'+button.dataset.replaceId];
      saveState();closeModal();renderFicha();toast(cardio?'Cardio substituído. Ajuste a intensidade antes de começar.':'Exercício substituído. Ajuste a carga antes de começar.');
    }catch(error){toast(error.message);}
  });
  document.getElementById('imageModal').classList.add('open');
}
function bindFicha(){
  document.querySelectorAll("[data-action='done']").forEach(btn=>btn.onclick=()=>{
    const card=btn.closest(".exercise-card"), day=card.dataset.day, id=card.dataset.id, e=state.days[day].exercises.find(z=>z.id===id);
    e.done=!e.done;
    if(e.done){e.completedAt=new Date().toISOString();state.history.push({day,...structuredClone(e)});}
    else {state.history=state.history.filter(h=>!(h.id===id&&h.day===day&&h.completedAt===e.completedAt));delete e.completedAt;}
    saveState(); renderFicha(); toast(e.done?"Exercício concluído e enviado para o final da fila.":"Exercício reaberto.");
  });
  document.querySelectorAll(".exercise-card input[data-field]").forEach(inp=>inp.addEventListener("input",()=>{
    const card=inp.closest(".exercise-card"), day=card.dataset.day,id=card.dataset.id,e=state.days[day].exercises.find(z=>z.id===id);
    if(!inp.checkValidity())return; e[inp.dataset.field]=inp.value; saveState(); if(inp.dataset.field==="rest") card.querySelector("[data-action=timer]").dataset.seconds=restToSeconds(inp.value);
    if(inp.dataset.field==='duration'){const button=card.querySelector('[data-action=timer]');button.dataset.seconds=Math.round(Number(inp.value)*60);button.disabled=!(Number(inp.value)>0);}
  }));
  document.querySelectorAll('.exercise-card input[data-field]').forEach(inp=>{
    inp.id=inp.closest('.exercise-card').dataset.day+'-'+inp.closest('.exercise-card').dataset.id+'-'+inp.dataset.field;
    const label=inp.parentElement.querySelector('label');
    if(label)label.htmlFor=inp.id;
    else inp.setAttribute('aria-label','Observação do exercício');
  });
  document.querySelectorAll("[data-action='timer']").forEach(btn=>btn.onclick=()=>startTimer(btn.closest(".exercise-card").dataset.day+":"+btn.closest(".exercise-card").dataset.id,+btn.dataset.seconds));
  document.querySelectorAll("[data-action='openGif']").forEach(btn=>btn.onclick=()=>{
    const card=btn.closest(".exercise-card"), x=exerciseData(card.dataset.id); openModal(x);
  });
  document.querySelectorAll("[data-suggest]").forEach(btn=>btn.onclick=()=>{
    openReplaceModal(btn.dataset.day,btn.dataset.suggest,btn.dataset.muscle);
  });
}
function restToSeconds(v){
  const m=String(v).match(/(\d+)/);return m?Number(m[1]):90;
}
function startTimer(id,seconds){
  timers[id]=Date.now()+Math.max(1,seconds)*1000;
  updateTimers();
}
function updateTimers(){
  Object.entries(timers).forEach(([id,end])=>{
    const left=Math.max(0,Math.ceil((end-Date.now())/1000));
    document.querySelectorAll('[data-timer]').forEach(n=>{if(n.dataset.timer===id)n.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');});
    if(left===0){delete timers[id];toast('⏰ Tempo concluído!');}
  });
}
setInterval(updateTimers,250);

function renderBuilder(){
  const b=document.getElementById("builder");
  const opened=new Set([...b.querySelectorAll('details[open]')].map(el=>el.dataset.day));
  const first=!b.children.length;
  b.innerHTML=DAYS.map((day,i)=>renderBuilderDay(day,first?i===0:opened.has(day))).join('');
  b.querySelectorAll(".builder-day").forEach(el=>{
    const day=el.dataset.day;
    el.querySelectorAll(".muscle-chip").forEach(btn=>btn.onclick=()=>{
      const m=btn.dataset.muscle,d=state.days[day];
      if(d.muscles.includes(m)) {
        if(d.exercises.some(e=>e.muscle===m)){toast('Remova os exercícios desse grupo antes de desmarcá-lo.');return;}
        d.muscles=d.muscles.filter(x=>x!==m);
      } else d.muscles.push(m);
      saveState();renderBuilder();
    });
    el.querySelectorAll(".picker-search").forEach(inp=>inp.oninput=()=>{
      const q=searchText(inp.value);
      inp.closest('.exercise-picker').querySelectorAll('.pick-card').forEach(card=>{card.hidden=!searchText(card.querySelector('strong').textContent).includes(q);});
    });
    el.querySelectorAll(".pick-add").forEach(btn=>btn.onclick=()=>{addExercise(day,btn.dataset.id,btn.closest('[data-picker]').dataset.picker);saveState();renderBuilder();toast("Exercício adicionado.");});
    el.querySelectorAll(".pick-remove").forEach(btn=>btn.onclick=()=>{removeExercise(day,btn.dataset.id);saveState();renderBuilder();});
    el.querySelectorAll('.pick-card').forEach(card=>card.onclick=event=>{
      if(event.target.closest('a,input,button'))return;
      const id=card.dataset.id,muscle=card.closest('[data-picker]').dataset.picker;
      if(state.days[day].exercises.some(exercise=>exercise.id===id))removeExercise(day,id);else addExercise(day,id,muscle);
      saveState();renderBuilder();
    });
    el.querySelectorAll(".move-up").forEach(btn=>btn.onclick=()=>moveExercise(day,btn.dataset.id,-1));
    el.querySelectorAll(".move-down").forEach(btn=>btn.onclick=()=>moveExercise(day,btn.dataset.id,1));
    el.querySelectorAll("[data-save-day]").forEach(btn=>btn.onclick=()=>{saveState();toast(day+" salvo na sua ficha.");});
    el.querySelectorAll("[data-clear-day]").forEach(btn=>btn.onclick=()=>clearDay(day));
    el.querySelectorAll("[data-clear-exercises]").forEach(btn=>btn.onclick=()=>clearExercises(day));
  });
}
function renderBuilderDay(day,open){
  const d=state.days[day];
  return `<details class="builder-day" data-day="${day}" ${open?"open":""}>
    <summary>${day} — ${d.muscles.length?esc(d.muscles.join(" + ")):"escolha os músculos"}</summary>
    <div class="muscles">${MUSCLES.map(m=>`<button class="muscle-chip ${d.muscles.includes(m)?"selected":""}" data-muscle="${esc(m)}">${d.muscles.includes(m)?"✓ ":""}${esc(m)}</button>`).join("")}</div>
    ${d.muscles.map(m=>renderPicker(day,m,"")).join("")}
    <div class="selected-list">${d.exercises.length?d.exercises.map((e,idx)=>renderSelectedItem(day,e.id,idx)).join(""):"<div class='empty'>Nenhum exercício selecionado ainda.</div>"}</div>
    <div class="save-row"><button class="btn primary" data-save-day>💾 Salvar ${day}</button><button class="btn" data-go-ficha="${day}">📋 Ver ficha</button><button class="btn danger" data-clear-exercises>✕ Eliminar exercícios</button><button class="btn danger" data-clear-day>🗑 Limpar dia</button></div>
  </details>`;
}
function renderPicker(day,muscle,query){
  const d=state.days[day], selected=new Set(d.exercises.map(e=>e.id));
  const arr=CATALOG.filter(x=>belongsTo(x,muscle) && (!query||x.name.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>Number(selected.has(b.id))-Number(selected.has(a.id)));
  return `<div class="exercise-picker open" data-picker="${esc(muscle)}">
    <div class="picker-head"><h4>${esc(muscle)}</h4><span class="selected-mark">${d.exercises.filter(e=>e.muscle===muscle).length} selecionado(s)</span></div>
    <input class="picker-search" data-muscle="${esc(muscle)}" placeholder="🔎 Pesquisar em ${esc(muscle)}..." value="${esc(query)}">
    <div class="picker-grid">${arr.map(x=>`<div class="pick-card ${selected.has(x.id)?'selected':''}" data-id="${esc(x.id)}">
      <div class="pick-media">${x.gif?`<img loading="lazy" src="${esc(x.gif || "/public/media-unavailable.svg")}" alt="Execução: ${esc(x.name)}">`:"<div class='empty' style='border:0;border-radius:0;height:100%;display:flex;align-items:center'>GIF não disponível no material atual</div>"}</div>
      <div class="pick-body"><strong>${esc(x.name)}</strong><p>${esc(x.description)}</p>${mediaDetails(x)}<div class="meta"><span class="tag">🔧 ${esc(x.equipment)}</span></div>
      <div class="pick-actions"><span class="selected-mark">${selected.has(x.id)?"✓ selecionado":"Clique para selecionar"}</span></div></div>
    </div>`).join("")||"<div class='empty'>Nenhum exercício encontrado.</div>"}</div>
  </div>`;
}
function renderSelectedItem(day,id,idx){
  const x=exerciseData(id);if(!x)return "";
  return `<div class="selected-item"><img src="${esc(x.gif || "/public/media-unavailable.svg")}" alt=""><span><b>${idx+1}.</b> ${esc(x.name)}<small style="display:block;color:var(--muted)">${esc(x.muscle)}</small></span>
    <button class="btn order-btn move-up" data-id="${esc(id)}">↑</button><button class="btn order-btn move-down" data-id="${esc(id)}">↓</button><button class="btn order-btn danger pick-remove" data-id="${esc(id)}">✕</button></div>`;
}
function addExercise(day,id,muscle=BY_ID[id].muscle){
  const d=state.days[day];if(d.exercises.some(e=>e.id===id))return;
  if(!d.muscles.includes(muscle))d.muscles.push(muscle);
  d.exercises.push(createExercise(id,muscle));
}
function removeExercise(day,id){state.days[day].exercises=state.days[day].exercises.filter(e=>e.id!==id)}
function clearDay(day){
  if(!confirm('Remover todos os músculos e exercícios de '+day+'?'))return;
  state.days[day].muscles=[];state.days[day].exercises=[];saveState();renderBuilder();renderFicha();toast(day+' foi limpo.');
}
function clearExercises(day){
  if(!state.days[day].exercises.length){toast('Não há exercícios para eliminar.');return;}
  if(!confirm('Eliminar todos os exercícios de '+day+' e manter os músculos selecionados?'))return;
  state.days[day].exercises=[];saveState();renderBuilder();renderFicha();toast('Exercícios de '+day+' eliminados.');
}
function moveExercise(day,id,dir){
  const a=state.days[day].exercises,i=a.findIndex(e=>e.id===id),j=i+dir;if(i<0||j<0||j>=a.length)return;
  [a[i],a[j]]=[a[j],a[i]];saveState();renderBuilder();
}
document.getElementById("builder").addEventListener("click",e=>{
  const b=e.target.closest("[data-go-ficha]");if(b){currentFichaDay=DAYS.indexOf(b.dataset.goFicha);savePreferences({day:DAYS[currentFichaDay]});switchView("fichaView");}
});

function renderLibrary(){
  const filter=document.getElementById("catalogFilter");
  const cats=["Todos",...MUSCLES];
  filter.innerHTML=cats.map(m=>`<button class="btn ${m===currentLibraryMuscle?"primary":""}" data-muscle="${esc(m)}">${esc(m)}</button>`).join("");
  filter.querySelectorAll("button").forEach(b=>b.onclick=()=>{currentLibraryMuscle=b.dataset.muscle;savePreferences({libraryMuscle:currentLibraryMuscle});renderLibrary()});
  const q=searchText(document.getElementById("librarySearch").value);
  const arr=CATALOG.filter(x=>(currentLibraryMuscle==="Todos"||belongsTo(x,currentLibraryMuscle))&&(!q||searchText(x.name).includes(q)||searchText((x.muscles||[x.muscle]).join(' ')).includes(q)||searchText(x.equipment).includes(q)));
  document.getElementById("catalogGrid").innerHTML=arr.map(x=>`<article class="lib-card">
    ${x.gif?`<img loading="lazy" src="${esc(x.gif || "/public/media-unavailable.svg")}" alt="Execução: ${esc(x.name)}">`:`<div class="empty" style="height:160px;display:flex;align-items:center;justify-content:center;border:0;border-radius:0">GIF não disponível no material atual</div>`}
    <div class="lib-body"><strong>${esc(x.name)}</strong><div class="lib-meta"><span class="tag">${esc(x.muscle)}</span><span class="tag">🔧 ${esc(x.equipment)}</span></div><p>${esc(x.description)}</p>${mediaDetails(x)}
    <div class="lib-actions"><button class="btn primary" data-lib-add="${esc(x.id)}">+ Adicionar</button></div></div>
  </article>`).join("") || "<div class='empty'>Nenhum exercício encontrado.</div>";
  document.querySelectorAll("[data-lib-add]").forEach(b=>b.onclick=()=>openAddModal(b.dataset.libAdd));
}
document.getElementById("librarySearch").value=typeof preferences.librarySearch==='string'?preferences.librarySearch:'';
document.getElementById("librarySearch").addEventListener("input",()=>{savePreferences({librarySearch:document.getElementById('librarySearch').value});renderLibrary();});

function expandRecommendationWorkout(workout){
  const exercises=workout.exercises.map(([name,details])=>({name,details,exercise:CATALOG.find(x=>x.name===name)}));
  const selected=new Set(exercises.map(item=>item.exercise?.id).filter(Boolean));
  const muscles=new Set(exercises.flatMap(item=>item.exercise?.muscles||[item.exercise?.muscle]).filter(Boolean));
  const candidates=CATALOG.filter(exercise=>!selected.has(exercise.id)&&muscles.has(exercise.muscle));
  for(const exercise of candidates){
    if(exercises.length>=8)break;
    exercises.push({name:exercise.name,details:exercise.kind==='cardio'?'20–30 min':'2–3 x 8–12',exercise});
  }
  if(exercises.length<8){
    for(const exercise of CATALOG){
      if(exercises.length>=8)break;
      if(selected.has(exercise.id)||exercises.some(item=>item.exercise?.id===exercise.id))continue;
      exercises.push({name:exercise.name,details:exercise.kind==='cardio'?'20–30 min':'2–3 x 8–12',exercise});
    }
  }
  return exercises;
}

function renderRecommendations(){
  const item=RECOMMENDATIONS.find(x=>x.id===currentRecommendation)||RECOMMENDATIONS[0];
  const recommendedExercises=[];
  const seenExercises=new Set();
  for(const workout of item.workouts) for(const [name] of workout.exercises){
    const exercise=CATALOG.find(x=>x.name===name);
    if(exercise&&!seenExercises.has(exercise.id)){seenExercises.add(exercise.id);recommendedExercises.push(exercise);}
  }
  document.getElementById('recommendationFilters').innerHTML=RECOMMENDATIONS.map(x=>`<button class="btn ${x.id===item.id?'primary':''}" data-recommendation="${x.id}">${x.icon} ${x.label}</button>`).join('');
  document.querySelectorAll('[data-recommendation]').forEach(button=>button.onclick=()=>{currentRecommendation=button.dataset.recommendation;savePreferences({recommendation:currentRecommendation});renderRecommendations()});
  document.getElementById('recommendationContent').innerHTML=`
    <div class="recommendation-hero"><div><span class="eyebrow">${item.target}</span><h3>${item.label}</h3><p>${item.summary}</p></div><span class="recommendation-mark">${item.icon}</span></div>
    <div class="recommendation-grid"><section class="recommendation-panel"><h4>Diretrizes praticas</h4><div class="recommendation-list">${item.prescription.map(([label,value])=>`<div><strong>${label}</strong><span>${value}</span></div>`).join('')}</div></section><section class="recommendation-panel"><h4>Resumo da semana</h4><ol class="week-list">${item.week.map(day=>`<li>${day}</li>`).join('')}</ol><p class="recommendation-note"><strong>Progressao:</strong> ${item.progression}</p></section></div>
    <section class="recommendation-workouts"><h4>Exercicios sugeridos da sua biblioteca</h4><p class="recommendation-intro">Cada sessao traz pelo menos 8 opcoes da sua biblioteca. O estudo orienta volume semanal e recuperacao; nao e necessario executar todas no mesmo dia.</p>${item.workouts.map(workout=>`<article class="workout-plan"><div class="workout-plan-head"><strong>${workout.day}</strong><span>${workout.focus}</span></div><div class="workout-exercises">${expandRecommendationWorkout(workout).map(({name,details,exercise})=>exercise?`<div class="workout-exercise"><img loading="lazy" src="${esc(exercise.gif)}" alt="Execucao: ${esc(exercise.name)}"><div class="workout-exercise-caption"><span>${esc(name)}</span><b>${esc(details)}</b></div></div>`:'').join('')}</div></article>`).join('')}</section>
    <section class="recommendation-source"><h4>Base usada</h4><p>${item.reference}</p><a class="source" href="${item.link}" target="_blank" rel="noopener">Abrir referencia ↗</a></section>
    <p class="recommendation-disclaimer">Diretriz geral para adultos saudaveis. Dor, lesao, gestacao, doencas ou uso de medicamentos pedem avaliacao profissional. Ajuste exercicios, volume e cardio ao seu nivel, rotina e recuperacao.</p>`;
}

function catalogForPrompt(){
  return [...new Set(CATALOG.map(x=>x.muscle))].map(muscle=>`### ${muscle}\n${CATALOG.filter(x=>x.muscle===muscle).map(x=>`- ${x.id} = ${x.name}`).join('\n')}`).join('\n\n');
}
function generatePrompt(){
  const form=document.getElementById('promptForm');
  if(!form)return;
  const data=new FormData(form);
  const value=name=>String(data.get(name)||'').trim()||'Não informado';
  const days=data.getAll('days');
  const muscles=data.getAll('promptMuscles');
  const output=`# Prompt para gerar meu treino importável\n\nVocê é um planejador de treinos. Monte um treino usando exclusivamente os músculos e exercícios do catálogo abaixo.\n\n## Minhas preferências\n- Objetivo: ${value('objective')}\n- Nível: ${value('level')}\n- Dias disponíveis: ${days.join(', ')||'Nenhum informado'}\n- Duração por treino: ${value('duration')}\n- Restrições ou dores: ${value('restrictions')}\n- Equipamentos: ${value('equipment')}\n- Preferências: ${value('preferences')}\n- Exercícios obrigatórios: ${value('required')}\n- Exercícios a evitar: ${value('avoid')}\n\n## Regras obrigatórias\n1. Responda somente com um JSON válido, sem texto extra e sem crases.\n2. Use exatamente os dias Segunda, Terça, Quarta, Quinta, Sexta, Sábado e Domingo.\n3. Preencha apenas os dias disponíveis; os outros devem ficar vazios.\n4. Use somente IDs deste catálogo. Nunca invente ou altere IDs.\n5. Use done como false, weight como "", actualReps como "", note como "".\n6. Use sets, targetReps e rest como strings. Rest é em segundos.\n7. Não inclua GIFs, fontes, descrições ou histórico preenchido.\n8. Escolha volume coerente com o objetivo, nível, tempo e recuperação. Oito exercícios são opções; não é obrigatório executar todos no mesmo dia.\n9. Antes de responder, confira se cada ID e muscle existem neste catálogo.\n\n## Formato obrigatório\n\\`\`\`json\n{\n  "version": 1,\n  "days": {\n    "Segunda": { "muscles": [], "exercises": [] },\n    "Terça": { "muscles": [], "exercises": [] },\n    "Quarta": { "muscles": [], "exercises": [] },\n    "Quinta": { "muscles": [], "exercises": [] },\n    "Sexta": { "muscles": [], "exercises": [] },\n    "Sábado": { "muscles": [], "exercises": [] },\n    "Domingo": { "muscles": [], "exercises": [] }\n  },\n  "history": []\n}\n\`\`\`\n\nCada exercício deve ter: id, muscle, done, sets, targetReps, weight, actualReps, rest e note.\n\n## Catálogo oficial de músculos e IDs\n\n${catalogForPrompt()}`;
  document.getElementById('promptOutput').value=output.replace('\u007f','')+`\n\n## Parametros solicitados\n- Musculos: ${muscles.join(', ')||'Não informado'}\n- Exercicios por musculo: ${value('exerciseCount')}\n- Cardio por sessão: ${value('cardioMinutes')} minutos`;
}
function setupPromptGenerator(){
  const form=document.getElementById('promptForm');
  if(!form)return;
  document.getElementById('promptDays').innerHTML=DAYS.map(day=>`<label><input type="checkbox" name="days" value="${esc(day)}" checked> ${esc(day)}</label>`).join('');
  document.getElementById('promptMuscles').innerHTML=MUSCLES.map(muscle=>`<label><input type="checkbox" name="promptMuscles" value="${esc(muscle)}"> ${esc(muscle)}</label>`).join('');
  form.addEventListener('submit',event=>{event.preventDefault();generatePrompt();toast('Documento gerado.');});
  document.getElementById('applyPromptWorkout').onclick=applyPromptWorkout;
  document.getElementById('copyPrompt').onclick=async()=>{generatePrompt();const output=document.getElementById('promptOutput');try{await navigator.clipboard.writeText(output.value);}catch{output.select();document.execCommand('copy');}toast('Documento copiado.');};
  document.getElementById('downloadPrompt').onclick=()=>{generatePrompt();const blob=new Blob([document.getElementById('promptOutput').value],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='prompt-gerador-de-treino.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Documento baixado.');};
  generatePrompt();
}

function applyPromptWorkout(){
  const data=new FormData(document.getElementById('promptForm'));
  const days=data.getAll('days'), muscles=data.getAll('promptMuscles');
  const count=Math.max(1,Math.min(10,Number(data.get('exerciseCount'))||3));
  const cardioMinutes=Math.max(0,Math.min(1440,Number(data.get('cardioMinutes'))||0));
  const wantsCardio=muscles.includes('Cardio');
  if(!days.length||!muscles.length){toast('Escolha pelo menos um dia e um músculo.');return;}
  if(!confirm('Aplicar este treino e substituir os exercícios dos dias escolhidos?'))return;
  const selectedDays=days.map(day=>state.days[day]).filter(Boolean);
  selectedDays.forEach(day=>{day.muscles=[];day.exercises=[];});
  muscles.forEach((muscle,index)=>{
    if(muscle==='Cardio')return;
    const day=selectedDays[index%selectedDays.length];
    day.muscles.push(muscle);
    CATALOG.filter(exercise=>exercise.muscle===muscle).slice(0,count).forEach(exercise=>day.exercises.push(createExercise(exercise.id,muscle)));
  });
  if(wantsCardio&&cardioMinutes>0)selectedDays.forEach(day=>{day.muscles.push('Cardio');day.exercises.push({...createExercise('cardio-walking-on-incline-treadmill','Cardio'),duration:String(cardioMinutes)});});
  selectedDays.forEach(day=>{day.muscles=[...new Set(day.muscles)];});
  saveState();renderFicha();renderBuilder();switchView('fichaView');toast('Treino aplicado à sua ficha.');
}

function openAddModal(id){
  const x=BY_ID[id];
  document.getElementById("modalTitle").textContent="Adicionar "+x.name;
  document.getElementById("modalContent").innerHTML=`<p class="sub">Escolha o dia para adicionar este exercício ao final da fila.</p><div class="muscles">${DAYS.map(d=>`<button class="muscle-chip" data-modal-day="${d}">${d}</button>`).join("")}</div>`;
  document.querySelectorAll("[data-modal-day]").forEach(b=>b.onclick=()=>{addExercise(b.dataset.modalDay,id);saveState();closeModal();toast(x.name+" adicionado à "+b.dataset.modalDay);renderLibrary()});
  document.getElementById("imageModal").classList.add("open");
}
function openModal(x){
  document.getElementById("modalTitle").textContent=x.name;
  document.getElementById("modalContent").innerHTML=`${x.gif?`<img src="${esc(x.gif || "/public/media-unavailable.svg")}" alt="Demonstração de ${esc(x.name)}" style="width:100%;max-height:65vh;object-fit:contain;background:#050a10;border-radius:12px">`:""}<p class="card-desc">${esc(x.description)}</p>${mediaDetails(x)}<div class="meta"><span class="tag">${esc(x.muscle)}</span><span class="tag">🔧 ${esc(x.equipment)}</span></div>`;
  document.getElementById("imageModal").classList.add("open");
}
function closeModal(){document.getElementById("imageModal").classList.remove("open")}
document.getElementById("modalClose").onclick=closeModal;
document.getElementById("imageModal").addEventListener("click",e=>{if(e.target.id==="imageModal")closeModal()});

setupPromptGenerator();
const promptForm=document.getElementById('promptForm');
if(Array.isArray(preferences.promptForm)){
  for(const input of promptForm.querySelectorAll('input')){
    const values=preferences.promptForm.filter(pair=>Array.isArray(pair)&&pair[0]===input.name).map(pair=>pair[1]);
    if(input.type==='checkbox')input.checked=values.includes(input.value);
    else if(values.length)input.value=String(values[0]);
  }
  generatePrompt();
}
if(typeof preferences.promptOutput==='string')document.getElementById('promptOutput').value=preferences.promptOutput;
function savePrompt(){savePreferences({promptForm:[...new FormData(promptForm)],promptOutput:document.getElementById('promptOutput').value});}
promptForm.addEventListener('input',savePrompt);
promptForm.addEventListener('submit',savePrompt);
document.getElementById('promptOutput').addEventListener('input',savePrompt);
document.getElementById('settingsSessionDay').innerHTML=DAYS.map(day=>`<option value="${esc(day)}">${esc(day)}</option>`).join('');
document.getElementById('settingsSessionDay').onchange=event=>{currentFichaDay=DAYS.indexOf(event.target.value);savePreferences({day:DAYS[currentFichaDay]});};
document.getElementById('importBackupButton').onclick=()=>document.getElementById('importState').click();
navigation=setupNavigation(renderView);
document.querySelectorAll('[data-shortcut]').forEach(button=>button.onclick=()=>navigation.go(button.dataset.shortcut));

function searchText(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.getElementById('newSession').onclick=()=>{
  const day=document.getElementById('settingsSessionDay').value;
  state.days[day].exercises.forEach(e=>{e.done=false;delete e.completedAt;});
  for(const key of Object.keys(timers))if(key.startsWith(day+':'))delete timers[key];
  saveState();toast('Nova sessão de '+day+' iniciada. Cargas e histórico preservados.');
};
document.getElementById('resetData').onclick=async()=>{
  if(!confirm('Excluir a ficha de todos os dias e todo o histórico deste navegador? Essa ação não pode ser desfeita sem um backup.'))return;
  state=defaultState();timers={};
  saveState();await flushState();
  renderFicha();renderBuilder();
  document.getElementById('promptForm').reset();generatePrompt();savePrompt();
  toast('Ficha e histórico excluídos.');
};
document.getElementById('exportState').onclick=async()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='meu-treino-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
document.getElementById('importState').onchange=async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    const {validateState}=await import('./data/state.js');
    const imported=validateState(JSON.parse(await file.text()));
    if(!confirm('Substituir a ficha atual pelo backup selecionado? Exporte a ficha atual antes de continuar, se precisar preservá-la.'))return;
    state=imported;saveState();renderFicha();renderBuilder();toast('Backup importado.');
  }catch(error){toast('Não foi possível importar: '+error.message);}finally{e.target.value='';}
};
document.getElementById('showHistory').onclick=()=>{
  document.getElementById('modalTitle').textContent='Histórico de exercícios';
  document.getElementById('modalContent').innerHTML=[...state.history].reverse().map(h=>'<div class="history-item"><strong>'+esc(BY_ID[h.id]?.name||h.id)+'</strong><p class="sub">'+esc(h.day)+' · '+esc(new Date(h.completedAt).toLocaleString('pt-BR'))+' · '+(BY_ID[h.id]?.kind==='cardio'?esc(h.duration||'—')+' min'+(h.distance?' · '+esc(h.distance)+' km':'')+(h.intensity?' · '+esc(h.intensity):''):esc(h.weight||'0')+' kg · '+esc(h.targetReps||h.actualReps||'—')+' reps · '+esc(h.sets)+' séries')+'</p></div>').join('')||'<p class="empty">Conclua um exercício para registrar seu histórico.</p>';
  document.getElementById('imageModal').classList.add('open');
};
window.addEventListener('storage-status',e=>{document.getElementById('storageStatus').textContent=e.detail;});
window.addEventListener('online',()=>flushState());
