/* DXEL AI — Intelligent Chatbot Engine v2.0 (Nyx Edition) */
(function(){
'use strict';

let brain = {
  KB: { 
    company: { name: 'DXEL Network', tagline: 'Digital Experience & Enterprise Leadership' },
    behavior: { 
      fallbacks: {
        clarify: "I'm not sure I understood. Could you please rephrase or ask about our services?",
        off_topic: "That's interesting! I'm specialized in digital growth and web solutions. Would you like to see how we can help your business?",
        unknown: "I'm still learning! Would you like to speak with one of our human experts?"
      }, 
      redirection: "We specialize in high-performance digital solutions." 
    },
    greetings: {
        start: ["Hi! How can DXEL Network help you today?"],
        end: "Thank you for contacting us!"
    }
  },
  INTENTS: [],
  RESPONSES: {}
};


let state = { mode: 'chat', step: 0, leadData: {}, history: [], topic: null };

const LEAD_STEPS = [
  { key: 'name', question: 'Awesome! Let\'s get started. What is your <strong>name</strong> or <strong>business name</strong>?', quick: [] },
  { key: 'type', question: 'Nice to meet you! What <strong>type of website or service</strong> do you need? (Web, Marketing, or Other?)', quick: ['Web Dev','Marketing','Other'] },
  { key: 'budget', question: 'Great. What is your <strong>approximate budget range</strong>?', quick: ['$1500 - $3000','$3000 - $5000','$5000+'] },
  { key: 'location', question: 'Got it. And what <strong>city or country</strong> are you located in?', quick: [] },
  { key: 'email', question: 'Perfect. What is your <strong>email address</strong>?', quick: [] },
  { key: 'phone', question: 'Lastly, what is your <strong>phone number</strong>?', quick: [] }
];

function loadState() {
  try {
    const saved = localStorage.getItem('dxel_nyx_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.topic) state.topic = parsed.topic;
    }
  } catch(e) {}
}

function saveState() {
  try {
    localStorage.setItem('dxel_nyx_state', JSON.stringify({ topic: state.topic }));
  } catch(e) {}
}

async function fetchBrain() {
  if (window.DXEL_AI_TRAINING_DATA) {
    brain = window.DXEL_AI_TRAINING_DATA;
    console.log('Nyx: Persistent Memory Loaded.');
  } else {
    console.warn('Nyx: Static memory missing, using fallbacks.');
  }
}


async function submitLead(data) {
  try {
    data.timestamp = new Date().toISOString();
    await fetch('https://script.google.com/macros/s/AKfycby1wJEExmbIMybJ5n83ZKZcGUzbKcQDz6tds9bG2Rmz3gEbd0nD6oLfLFd3yf85ub5z/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log('Lead submitted directly to Google Sheets.');
  } catch (err) { console.error('Lead failed:', err); }
}

function classify(msg){
  const m = msg.toLowerCase().replace(/[^a-z0-9\s]/g,'');
  let best = null, bestScore = 0;
  for(const {intent, patterns} of brain.INTENTS){
    for(const p of patterns){
      const regex = new RegExp(`\\b${p}\\b`, 'i');
      if(regex.test(m)){
        const score = p.length;
        if(score > bestScore){ bestScore = score; best = intent; }
      }
    }
  }
  return best;
}

function respond(msg){
  if (state.mode === 'lead') return handleLeadCollection(msg);

  const queries = msg.split(/[.?!]+/).filter(q => q.trim().length > 3);
  if (queries.length > 1) {
    return handleMultiQuery(queries);
  }

  return processSingleQuery(msg);
}

function processSingleQuery(q) {
    const intent = classify(q);

    if (!intent) {
        if (q.trim().length < 8) return { text: brain.KB.behavior.fallbacks.clarify, quick: ['Build New Website','Get Marketing Help'] };
        // If unknown but long enough, treat it as off_topic to get a smart deflection
        return getBaseResponse('off_topic');
    }

    let res = getBaseResponse(intent);

    // Context / Topic Switching Logic
    const skipTopics = ['greeting', 'close_lead', 'off_topic', 'contact', 'goodbye', 'trust_building'];
    if (intent && !skipTopics.includes(intent)) {
      if (state.topic && state.topic !== intent) {
        const oldTopic = state.topic.replace(/_/g, ' ');
        // Append polite reminder of previous topic
        res.text += `<br><br>*(By the way, let me know if you still wanted to discuss ${oldTopic}!)*`;
      }
      state.topic = intent;
      saveState();
    }

    return res;
}

function handleMultiQuery(queries) {
    let combinedText = "I see you have multiple questions! Let me help you with each:<br><br>";
    queries.forEach((q, i) => {
        const res = processSingleQuery(q);
        combinedText += `<strong>${i+1}.</strong> ${res.text}<br><br>`;
    });
    return { text: combinedText, quick: ['Start Project','Our Services'] };
}

function getBaseResponse(intent) {
  if (intent === 'close_lead' || intent === 'website_need') {
    state.mode = 'lead'; state.step = 0;
    return {text: LEAD_STEPS[0].question, quick: LEAD_STEPS[0].quick};
  }

  // Dynamic training response check
  if (brain.RESPONSES && brain.RESPONSES[intent]) {
    const resData = brain.RESPONSES[intent];
    const text = Array.isArray(resData) ? resData[Math.floor(Math.random() * resData.length)] : resData;
    return { 
      text: text, 
      quick: ['Start Project', 'Our Services', 'Portfolio'] 
    };
  }

  // Fallback defaults if not in training data
  switch(intent){
    case 'greeting':
      return {text:`Hi 👋 Welcome to <strong>${brain.KB.company.name}</strong>.\n${brain.KB.company.tagline}\n\nAre you looking to build a new website or scale your business with marketing?`, quick:['Build Website','Growth Marketing']};
    default:
      return {text: brain.KB.behavior.fallbacks.clarify, quick:['New Website','Marketing Help']};
  }
}

function handleLeadCollection(msg) {
  const currentStep = LEAD_STEPS[state.step];
  state.leadData[currentStep.key] = msg;
  state.step++;
  if (state.step < LEAD_STEPS.length) {
    const nextStep = LEAD_STEPS[state.step];
    let q = nextStep.question;
    if (currentStep.key === 'name' && brain.KB.greetings.personalized) {
        q = `${brain.KB.greetings.personalized.replace('{name}', msg)}<br><br>${nextStep.question}`;
    }
    return { text: q, quick: nextStep.quick };
  } else {
    state.mode = 'chat'; submitLead(state.leadData);
    state.topic = null; // Clear topic after lead
    saveState();
    return { text: brain.KB.greetings.end, quick: ['Services','Portfolio'] };
  }
}

// UI Initialization
async function init(){
  await fetchBrain();
  loadState();

  const widget=document.createElement('div');
  widget.id='dxel-ai-widget';
  widget.innerHTML=`
    <button class="dxel-ai-trigger" id="dxelAiTrigger" aria-label="Chat">
      <svg class="trigger-icon" viewBox="0 0 24 24"><ellipse cx="12" cy="11" rx="10" ry="9" fill="#ffffff" /><ellipse cx="12" cy="11" rx="8" ry="5" fill="#1a1a2e" /><path class="eve-eye" d="M8 11.5C8 10.5 9 10 10.5 11" stroke="#00cec9" stroke-width="1.8" stroke-linecap="round" fill="none" /><path class="eve-eye" d="M16 11.5C16 10.5 15 10 13.5 11" stroke="#00cec9" stroke-width="1.8" stroke-linecap="round" fill="none" /></svg>
      <svg class="trigger-close" viewBox="0 0 24 24"><path fill="#ffffff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      <span class="dxel-ai-badge"></span>
    </button>
    <div class="dxel-ai-window" id="dxelAiWindow">
      <div class="dxel-ai-header">
        <div class="dxel-ai-avatar"><svg viewBox="0 0 24 24"><ellipse cx="12" cy="11" rx="10" ry="9" fill="#ffffff" /><ellipse cx="12" cy="11" rx="8" ry="5" fill="#1a1a2e" /><path class="eve-eye" d="M8 11.5C8 10.5 9 10 10.5 11" stroke="#00cec9" stroke-width="1.8" stroke-linecap="round" fill="none" /><path class="eve-eye" d="M16 11.5C16 10.5 15 10 13.5 11" stroke="#00cec9" stroke-width="1.8" stroke-linecap="round" fill="none" /></svg></div>
        <div class="dxel-ai-header-info"><h4>Nyx</h4><span>● AI Assistant Active</span></div>
        <button class="dxel-ai-header-close" id="dxelAiClose">✕</button>
      </div>
      <div class="dxel-ai-messages" id="dxelAiMessages"></div>
      <div class="dxel-ai-input-area">
        <input type="text" class="dxel-ai-input" id="dxelAiInput" placeholder="Message Nyx..." autocomplete="off">
        <button class="dxel-ai-send" id="dxelAiSend"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
      <div class="dxel-ai-footer">Intelligent Service Expert Active</div>
    </div>`;
  document.body.appendChild(widget);

  const trigger=document.getElementById('dxelAiTrigger'), win=document.getElementById('dxelAiWindow'), msgs=document.getElementById('dxelAiMessages'), input=document.getElementById('dxelAiInput'), sendBtn=document.getElementById('dxelAiSend'), closeBtn=document.getElementById('dxelAiClose'), badge=widget.querySelector('.dxel-ai-badge');

  function toggleChat(){
    const open=win.classList.toggle('open'); trigger.classList.toggle('active',open);
    if(open){ 
        if(badge)badge.style.display='none'; 
        if(!msgs.children.length) showWelcome(); 
        setTimeout(()=>input.focus(),350); 
    }
  }

  function addMsg(text,type,quickReplies){
    if(!text) text = brain.KB.behavior.fallbacks.clarify;
    const div=document.createElement('div'); div.className=`dxel-ai-msg ${type}`;
    div.innerHTML=`<div class="bubble">${text.replace(/\n/g,'<br>')}</div>`;

    if(quickReplies&&quickReplies.length&&type==='bot'){
      const qr=document.createElement('div'); qr.className='dxel-ai-quick-replies';
      quickReplies.forEach(label=>{
        const btn=document.createElement('button'); btn.className='dxel-ai-quick-btn'; btn.textContent=label;
        btn.addEventListener('click',()=>{handleUserMsg(label);qr.remove();}); qr.appendChild(btn);
      });
      div.appendChild(qr);
    }
    msgs.appendChild(div); msgs.scrollTop=msgs.scrollHeight;
  }

  function showTyping(){
    const t=document.createElement('div'); t.className='dxel-ai-typing'; t.id='dxelTyping'; t.innerHTML='<span></span><span></span><span></span>';
    msgs.appendChild(t); msgs.scrollTop=msgs.scrollHeight; return t;
  }

  function showWelcome(){
    let text;
    // Session memory return greeting
    if (state.topic && brain.KB.greetings.return_greetings) {
      const list = brain.KB.greetings.return_greetings;
      const formattedTopic = state.topic.replace(/_/g, ' ');
      text = list[Math.floor(Math.random() * list.length)].replace('{topic}', formattedTopic);
    } else {
      const list = brain.KB.greetings.start || ["Hi! I'm Nyx."];
      text = list[Math.floor(Math.random() * list.length)];
    }
    addMsg(text,'bot',['Start Project','Our Services','Portfolio']);
  }

  function handleUserMsg(text){
    if(!text.trim())return; addMsg(text,'user'); input.value=''; document.querySelectorAll('.dxel-ai-quick-replies').forEach(el=>el.remove());
    const typing=showTyping();
    setTimeout(()=>{ typing.remove(); const res=respond(text); addMsg(res.text,'bot',res.quick); },600);
  }

  trigger.addEventListener('click',toggleChat);
  closeBtn.addEventListener('click',toggleChat);
  sendBtn.addEventListener('click',()=>handleUserMsg(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='Enter')handleUserMsg(input.value);});
  setTimeout(()=>{ if(!win.classList.contains('open')&&badge)badge.style.display='block'; },15000);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
