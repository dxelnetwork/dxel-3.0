/* DXEL AI — Intelligent Chatbot Engine v1.6 (Service Specific Logic) */
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


let state = { mode: 'chat', step: 0, leadData: {}, history: [] };

const LEAD_STEPS = [
  { key: 'name', question: 'Awesome! Let\'s get started. What is your <strong>name</strong> or <strong>business name</strong>?', quick: [] },
  { key: 'type', question: 'Nice to meet you! What <strong>type of website or service</strong> do you need? (Web, Marketing, or Other?)', quick: ['Web Dev','Marketing','Other'] },
  { key: 'budget', question: 'Great. What is your <strong>approximate budget range</strong>?', quick: ['$1500 - $3000','$3000 - $5000','$5000+'] },
  { key: 'email', question: 'Perfect. What is your <strong>email address</strong>?', quick: [] },
  { key: 'phone', question: 'Lastly, what is your <strong>phone number</strong>?', quick: [] }
];

async function fetchBrain() {
  if (window.DXEL_AI_TRAINING_DATA) {
    brain = window.DXEL_AI_TRAINING_DATA;
    console.log('DXEL AI: Permanent Static Memory Loaded.');
  } else {
    console.warn('DXEL AI: Static memory missing, using fallbacks.');
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

    return getBaseResponse(intent);
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

  switch(intent){
    case 'greeting':
      return {text:`Hi 👋 Welcome to <strong>${brain.KB.company.name}</strong>.\n${brain.KB.company.tagline}\n\nAre you looking to build a new website or scale your business with marketing?`, quick:['Build Website','Growth Marketing']};
    
    case 'facebook_marketing':
      return {text:`📱 <strong>Facebook & Meta Ads Mastery</strong>\nWe specialize in high-converting Facebook and Instagram ad campaigns. Our focus is on ROI, custom audiences, and creative testing that actually drives sales.\n\nWant us to audit your current ads or start a new campaign?`, quick:['Audit My Ads','Start FB Ads','Pricing']};
    
    case 'google_marketing':
      return {text:`🔍 <strong>Google Ads & PPC Strategy</strong>\nWe get your business in front of customers exactly when they are searching for you. Our expert-led SEM campaigns focus on lower cost-per-lead and maximum visibility.\n\nInterested in a custom Google Ads strategy?`, quick:['Get PPC Plan','Google Audit','Contact Us']};

    case 'marketing_general':
      return {text:`Growth is our priority 🚀 We offer full-stack marketing including SEO, Social Media Ads, and Sales Funnels.\n\nWhich area should we focus on for your business?`, quick:['Facebook Ads','Google Ads','SEO Support']};

    case 'microsoft_partner':
      return {text: brain.RESPONSES?.microsoft_partner || "We are a proud <strong>Microsoft AI Cloud Partner</strong>, leveraging advanced cloud and AI technology to drive business growth.", quick:['Learn More','Start Project']};
    
    case 'ui_ux_design':
      return {text: brain.RESPONSES?.ui_ux_design || "Our UI/UX team creates stunning, user-centered designs that deliver exceptional digital experiences.", quick:['View Design Services','Portfolio']};

    case 'mobile_apps':
      return {text: brain.RESPONSES?.mobile_apps || "We build native and cross-platform mobile apps for iOS and Android using Swift, Kotlin, and React Native.", quick:['App Strategy','Get Quote']};

    case 'ecommerce_detail':
      return {text: brain.RESPONSES?.ecommerce_detail || "We build powerful online stores on Shopify and WooCommerce that convert visitors into customers.", quick:['Start Store','Pricing']};

    case 'team_experts':
      return {text: brain.RESPONSES?.team_experts || "Our team consists of industry veterans dedicated to your success. Led by our founder Md Mehedi Hasan.", quick:['Meet the Team','Contact Us']};

    case 'company_story':
      return {text: brain.RESPONSES?.company_story || "DXEL stands for Digital Experience & Enterprise Leadership. We've been driving innovation for over 11 years.", quick:['About Us','Our Values']};

    case 'legal_info':
      return {text: brain.RESPONSES?.legal_info || "You can view our legal documents here: [Privacy Policy](privacy-policy.html) and [Terms](terms-conditions.html).", quick:['Privacy Policy','Terms']};

    case 'trust_building':
      return {text: brain.RESPONSES?.trust_building || `We've completed over ${brain.KB.company.projects} projects with 11+ years of experience.`, quick:['View Portfolio','Start Project']};

    case 'budget_check':
      return {text:`Our pricing is performance-based. We offer packages starting from $1,500 for web projects and $400/mo for marketing management.\n\nWant a custom quote based on your needs?`, quick:['Get Custom Quote','View Packages']};
    
    case 'portfolio':
      return {text:`We've completed over ${brain.KB.company.projects} projects! Check out our latest work: <a href="projects.html">View Portfolio →</a>`, quick:['Start Project','Our Services']};
    
    case 'contact':
      return {text:`You can reach us at <a href="mailto:${brain.KB.company.email}">${brain.KB.company.email}</a> or call ${brain.KB.company.phone}.`, quick:['Start here','WhatsApp Us']};

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
    return { text: brain.KB.greetings.end, quick: ['Services','Portfolio'] };
  }
}

// UI Initialization
async function init(){
  await fetchBrain();
  const widget=document.createElement('div');
  widget.id='dxel-ai-widget';
  widget.innerHTML=`
    <button class="dxel-ai-trigger" id="dxelAiTrigger" aria-label="Chat">
      <svg class="trigger-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.74.46 3.37 1.26 4.78L2 22l5.22-1.26C8.63 21.54 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm2.07-4.75l-.9.92C11.45 12.9 11 13.5 11 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
      <svg class="trigger-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      <span class="dxel-ai-badge"></span>
    </button>
    <div class="dxel-ai-window" id="dxelAiWindow">
      <div class="dxel-ai-header">
        <div class="dxel-ai-avatar"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></div>
        <div class="dxel-ai-header-info"><h4>DXEL AI</h4><span>● Advanced Processing Active</span></div>
        <button class="dxel-ai-header-close" id="dxelAiClose">✕</button>
      </div>
      <div class="dxel-ai-messages" id="dxelAiMessages"></div>
      <div class="dxel-ai-input-area">
        <input type="text" class="dxel-ai-input" id="dxelAiInput" placeholder="Type your message..." autocomplete="off">
        <button class="dxel-ai-send" id="dxelAiSend"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
      <div class="dxel-ai-footer">Intelligent Service Expert Active</div>
    </div>`;
  document.body.appendChild(widget);

  const trigger=document.getElementById('dxelAiTrigger'), win=document.getElementById('dxelAiWindow'), msgs=document.getElementById('dxelAiMessages'), input=document.getElementById('dxelAiInput'), sendBtn=document.getElementById('dxelAiSend'), closeBtn=document.getElementById('dxelAiClose'), badge=widget.querySelector('.dxel-ai-badge');

  function toggleChat(){
    const open=win.classList.toggle('open'); trigger.classList.toggle('active',open);
    if(open){ if(badge)badge.style.display='none'; if(!msgs.children.length) showWelcome(); setTimeout(()=>input.focus(),350); }
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
    const list = brain.KB.greetings.start || ["Hi!"];
    const text = list[Math.floor(Math.random() * list.length)];
    addMsg(text,'bot',['I want to start','Pricing','Our Portfolio']);
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
