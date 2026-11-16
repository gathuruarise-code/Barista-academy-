
const main=document.getElementById('main');
let currentView='home', currentChapter=0, quizIndex=0, selectedAnswer=null, score=0, quizDone=false;
const getStore=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const setStore=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let completed=getStore('ba_completed',[]), bookmarks=getStore('ba_bookmarks',[]);
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function setView(v){currentView=v;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===v));render();}
document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
function header(eyebrow,title,desc=''){return `<div class="eyebrow">${eyebrow}</div><div class="section-head"><div><h2>${title}</h2>${desc?`<p>${desc}</p>`:''}</div></div>`}
function chapterCard(ch,i){return `<article class="chapter-card" onclick="openChapter(${i})"><div class="number">${String(i+1).padStart(2,'0')}</div><div><h3>${esc(ch.title)}</h3><p>${ch.sections.length} learning topics • ${completed.includes(i)?'Completed':'Not completed'}</p><span class="tag">${completed.includes(i)?'✓ Completed':'Study chapter'}</span></div></article>`}
function renderHome(){
 const pct=Math.round(completed.length/CHAPTERS.length*100);
 main.innerHTML=`<section class="hero"><div class="eyebrow">YOUR COFFEE JOURNEY STARTS HERE</div><h1>Become a confident, professional barista.</h1><p>Learn coffee from its origins to espresso extraction, milk steaming, latte art, café operations and professional service.</p><button class="btn gold" onclick="openChapter(0)">Start learning →</button></section>
 <div class="stats"><div class="stat"><strong>${CHAPTERS.length}</strong><span>Complete chapters</span></div><div class="stat"><strong>${completed.length}</strong><span>Chapters completed</span></div><div class="stat"><strong>${pct}%</strong><span>Course progress<div class="progress"><i style="width:${pct}%"></i></div></span></div></div>
 ${header('CONTINUE LEARNING','Your course','Start at the beginning or choose any chapter.')}<div class="cards">${CHAPTERS.slice(0,4).map(chapterCard).join('')}</div>
 ${header('EXPLORE','Learning tools','Practice what you learn.')}<div class="cards"><article class="chapter-card" onclick="setView('recipes')"><div class="number">♨</div><div><h3>Coffee recipes</h3><p>Learn popular drinks and preparation steps.</p></div></article><article class="chapter-card" onclick="setView('quiz')"><div class="number">✓</div><div><h3>Knowledge quiz</h3><p>Test your coffee knowledge and see your score.</p></div></article></div>`;
}
function renderLessons(filter=''){
 const list=CHAPTERS.map((ch,i)=>({ch,i})).filter(x=>x.ch.title.toLowerCase().includes(filter.toLowerCase())||x.ch.sections.some(s=>(s.heading+' '+s.body).toLowerCase().includes(filter.toLowerCase())));
 main.innerHTML=`${header('THE CURRICULUM','All lessons',`${CHAPTERS.length} chapters from beginner foundations to professional practice.`)}<input class="search" id="lessonSearch" placeholder="Search chapters or topics..." value="${esc(filter)}"><div class="cards" id="chapterList">${list.map(x=>chapterCard(x.ch,x.i)).join('')||'<div class="empty">No matching lessons found.</div>'}</div>`;
 document.getElementById('lessonSearch').addEventListener('input',e=>renderLessons(e.target.value));
}
function openChapter(i){currentChapter=i;currentView='lesson';render();main.focus();}
function renderLesson(){
 const ch=CHAPTERS[currentChapter], done=completed.includes(currentChapter), saved=bookmarks.includes(currentChapter);
 const visualMap={2:['coffee-cherry.svg','Coffee cherry layers'],6:['grind-size.svg','Coffee grind size comparison'],9:['espresso-machine.svg','Main espresso machine components'],11:['milk-texture.svg','Milk steaming and texturing'],12:['latte-art.svg','Examples of latte art patterns']};
 const visual=visualMap[currentChapter]?`<figure class="visual-guide"><img src="assets/${visualMap[currentChapter][0]}" alt="${visualMap[currentChapter][1]}"><figcaption>${visualMap[currentChapter][1]}</figcaption></figure>`:'';
 main.innerHTML=`<div class="lesson-top"><div><div class="eyebrow">CHAPTER ${String(currentChapter+1).padStart(2,'0')} OF ${CHAPTERS.length}</div><h1>${esc(ch.title)}</h1><p class="muted">${ch.sections.length} topics • Barista Academy course</p></div><button class="btn ghost" onclick="setView('lessons')">All lessons</button></div>
 ${visual}
 <div class="lesson-actions"><button class="btn ghost" onclick="toggleBookmark(${currentChapter})">${saved?'★ Saved':'☆ Bookmark'}</button><button class="btn ${done?'ghost':'gold'}" onclick="toggleComplete(${currentChapter})">${done?'Mark as not completed':'Mark chapter complete ✓'}</button></div>
 ${ch.sections.map((s,i)=>`<section class="lesson-box"><h2>${i+1}. ${esc(s.heading)}</h2><p>${esc(s.body)}</p></section>`).join('')}
 <div class="lesson-box"><h2>Knowledge check</h2><p>Explain the main ideas in this chapter in your own words. Practise the relevant skill using real equipment where available.</p><div class="diagram"><span>LEARN</span><span>PRACTISE</span><span>REVIEW</span></div></div>
 <div class="lesson-actions"><button class="btn ghost" ${currentChapter===0?'disabled':''} onclick="openChapter(${currentChapter-1})">← Previous</button><button class="btn gold" ${currentChapter===CHAPTERS.length-1?'disabled':''} onclick="openChapter(${currentChapter+1})">Next chapter →</button></div>`;
}
function toggleComplete(i){completed=completed.includes(i)?completed.filter(x=>x!==i):[...completed,i];setStore('ba_completed',completed);render();}
function toggleBookmark(i){bookmarks=bookmarks.includes(i)?bookmarks.filter(x=>x!==i):[...bookmarks,i];setStore('ba_bookmarks',bookmarks);render();}
const recipes=[
["Espresso","Fresh ground coffee and water","Dose coffee into a clean basket, distribute and tamp evenly. Extract to the recipe yield, then taste and record the result.","Starting point: 18 g in, 36 g out, about 25–30 seconds."],
["Americano","Espresso and hot water","Prepare hot water in a cup and add a freshly extracted espresso, or follow the café's chosen sequence.","Adjust water quantity to the desired strength."],
["Cappuccino","Espresso, steamed milk and foam","Extract espresso. Steam milk to glossy microfoam, pour into the espresso and finish with a balanced foam layer.","Use the house cup size and recipe."],
["Caffè latte","Espresso and steamed milk","Extract espresso, steam milk with fine microfoam and pour a larger quantity of milk over the espresso.","Finish with a thin foam layer."],
["Flat white","Espresso and finely textured milk","Prepare espresso and pour finely textured microfoam with a smooth, integrated finish.","Size and espresso recipe vary by café."],
["Mocha","Espresso, chocolate and milk","Add chocolate to the cup, pour espresso over it and stir. Add steamed milk and finish as desired.","Check chocolate and milk allergens."],
["Macchiato","Espresso and a little milk","Prepare espresso and mark it with a small amount of milk or milk foam.","Traditional and modern café versions differ."],
["Iced latte","Espresso, cold milk and ice","Fill a glass with ice, add cold milk and pour espresso over it. Stir or serve layered.","Use a heat-safe glass and house recipe."],
["Affogato","Espresso and vanilla ice cream or gelato","Place a scoop of ice cream in a dish and pour a fresh espresso over it.","Serve immediately as a dessert."],
["Cold brew","Coffee grounds and cool water","Combine coffee and water, steep for an extended period, then filter and chill safely.","Use a tested house ratio and refrigerated storage procedure."]
];
function renderRecipes(){main.innerHTML=`${header('THE COFFEE MENU','Coffee recipes','Starting methods for common café beverages. Follow your workplace recipe for exact quantities.')}<div class="recipe-grid">${recipes.map(r=>`<article class="recipe-card"><h3>${esc(r[0])}</h3><p><b>Ingredients:</b> ${esc(r[1])}</p><p><b>Preparation:</b> ${esc(r[2])}</p><p><b>Barista note:</b> ${esc(r[3])}</p></article>`).join('')}</div>`}
function renderQuiz(){
 if(quizDone){main.innerHTML=`${header('ASSESSMENT','Quiz completed','You have completed the knowledge check.')}<div class="panel lesson-box"><h2>Your score: ${score} / ${QUIZ.length}</h2><p>${Math.round(score/QUIZ.length*100)}% correct. ${score>=6?'Good work. Keep practising and revisit any weak topics.':'Review the lessons and try again to strengthen your knowledge.'}</p><button class="btn gold" onclick="restartQuiz()">Try again</button></div>`;return;}
 const q=QUIZ[quizIndex];
 main.innerHTML=`${header('KNOWLEDGE CHECK',`Question ${quizIndex+1} of ${QUIZ.length}`,'Choose the best answer. You will see an explanation after submitting.')}<div class="lesson-box"><h2>${esc(q.q)}</h2>${q.options.map((o,i)=>`<button class="quiz-option ${selectedAnswer===i?'selected':''}" onclick="chooseAnswer(${i})">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join('')}<div id="quizFeedback"></div><button class="btn gold" id="submitAnswer" onclick="submitAnswer()" ${selectedAnswer===null?'disabled':''}>Submit answer</button></div><p class="muted">Your score: ${score}</p>`;
}
function chooseAnswer(i){selectedAnswer=i;renderQuiz();}
function submitAnswer(){if(selectedAnswer===null)return;const q=QUIZ[quizIndex],correct=selectedAnswer===q.answer;if(correct)score++;const fb=document.getElementById('quizFeedback');fb.innerHTML=`<div class="feedback"><b>${correct?'Correct!':'Not quite.'}</b> ${esc(q.why)}</div><button class="btn" onclick="nextQuestion()">${quizIndex===QUIZ.length-1?'See results':'Next question →'}</button>`;document.getElementById('submitAnswer').disabled=true;document.querySelectorAll('.quiz-option').forEach(b=>b.disabled=true);}
function nextQuestion(){quizIndex++;selectedAnswer=null;if(quizIndex>=QUIZ.length)quizDone=true;renderQuiz();}
function restartQuiz(){quizIndex=0;selectedAnswer=null;score=0;quizDone=false;renderQuiz();}
function renderGlossary(filter=''){const items=GLOSSARY.filter(x=>(x[0]+' '+x[1]).toLowerCase().includes(filter.toLowerCase()));main.innerHTML=`${header('REFERENCE','Barista glossary','Useful terms used in coffee preparation and café operations.')}<input class="search" id="glossarySearch" placeholder="Search a term..." value="${esc(filter)}"><div class="recipe-grid" id="glossaryList">${items.map(x=>`<article class="recipe-card"><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></article>`).join('')||'<div class="empty">No matching term.</div>'}</div>`;document.getElementById('glossarySearch').addEventListener('input',e=>renderGlossary(e.target.value));}
function renderSaved(){const items=bookmarks.map(i=>({ch:CHAPTERS[i],i}));main.innerHTML=`${header('YOUR LIBRARY','Bookmarked lessons','Lessons you saved for quick access.')}<div class="cards">${items.map(x=>chapterCard(x.ch,x.i)).join('')||'<div class="empty">No bookmarks yet. Open a lesson and tap Bookmark to save it here.</div>'}</div>`}
function render(){if(currentView==='home')renderHome();else if(currentView==='lessons')renderLessons();else if(currentView==='lesson')renderLesson();else if(currentView==='recipes')renderRecipes();else if(currentView==='quiz')renderQuiz();else if(currentView==='glossary')renderGlossary();else if(currentView==='saved')renderSaved();}
function updateNetwork(){const online=navigator.onLine;document.getElementById('networkStatus').textContent=online?'You are online':'Offline mode';document.getElementById('cacheStatus').textContent=online?'Offline lessons are available after caching':'Saved lessons remain available on this device';document.querySelector('.status-dot').classList.toggle('online',online);}
window.addEventListener('online',updateNetwork);window.addEventListener('offline',updateNetwork);
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(()=>{document.getElementById('cacheStatus').textContent='App files are being saved for offline use';}).catch(()=>{}));}
let deferredPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.getElementById('installBtn').classList.remove('hidden');});
document.getElementById('installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById('installBtn').classList.add('hidden');});
render();updateNetwork();
