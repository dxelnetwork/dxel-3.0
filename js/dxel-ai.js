/* DXEL AI — Intelligent Chatbot Engine v3.0 (Autonomous LLM Edition) */
(function () {
  'use strict';

  // ---------------------------------------------------------
  // CONFIGURATION
  // ---------------------------------------------------------
  // Set this to the Web App URL from your Google Apps Script deployment
  const LLM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwXKoz-F0mqOqTu-Tgtxygj58kKTgaLjJfDfPvLqvYN-AjXm60DBV1kG8z0lL5TU52U/exec';
  const LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycby1wJEExmbIMybJ5n83ZKZcGUzbKcQDz6tds9bG2Rmz3gEbd0nD6oLfLFd3yf85ub5z/exec';

  let state = { messages: [] };

  function loadState() {
    try {
      const saved = sessionStorage.getItem('dxel_nyx_history');
      if (saved) {
        state.messages = JSON.parse(saved);
      }
    } catch (e) { }
  }

  function saveState() {
    try {
      sessionStorage.setItem('dxel_nyx_history', JSON.stringify(state.messages));
    } catch (e) { }
  }

  async function submitLead(data) {
    try {
      data.date = new Date().toISOString();
      await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('Lead submitted directly to Google Sheets.');
    } catch (err) { console.error('Lead failed:', err); }
  }

  async function respondWithLLM(text) {
    // Add user message to history
    state.messages.push({ role: "user", parts: [{ text: text }] });
    saveState();

    try {
      // Call the Google Apps Script Proxy
      const response = await fetch(LLM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain" }, // GAS prefers text/plain for postData.contents sometimes or application/json
        body: JSON.stringify({
          messages: state.messages,
          systemInstruction: window.DXEL_AI_TRAINING_DATA ? window.DXEL_AI_TRAINING_DATA.SYSTEM_PROMPT : ""
        })
      });

      const result = await response.json();
      let aiText = result.response || "I'm experiencing a connectivity issue. Please try again.";

      // Check for JSON lead extraction block
      const jsonMatch = aiText.match(/```json\s*(\{[\s\S]*?\})\s*```/i);
      if (jsonMatch) {
        try {
          const leadData = JSON.parse(jsonMatch[1]);
          submitLead(leadData);
          // Remove the JSON block from the text shown to user
          aiText = aiText.replace(jsonMatch[0], "").trim();
        } catch (e) {
          console.error("Failed to parse lead data:", e);
        }
      }

      // Add model response to history
      state.messages.push({ role: "model", parts: [{ text: aiText }] });
      saveState();

      return { text: aiText, quick: [] };
    } catch (error) {
      console.error("LLM Error:", error);
      state.messages.pop(); // Remove user message if failed
      return { text: "I'm sorry, I'm currently unable to process your request. Please try again later or contact hello@dxel.net.", quick: [] };
    }
  }

  // UI Initialization
  async function init() {
    loadState();

    const widget = document.createElement('div');
    widget.id = 'dxel-ai-widget';
    widget.innerHTML = `
    <button class="dxel-ai-trigger" id="dxelAiTrigger" aria-label="Chat">
      <svg class="trigger-icon" viewBox="0 0 24 24"><ellipse cx="12" cy="11" rx="10" ry="9" fill="#ffffff" /><ellipse cx="12" cy="11" rx="8" ry="5" fill="#1a1a2e" /><path class="eve-eye" d="M8 11.5C8 10.5 9 10 10.5 11" stroke="#00cec9" stroke-width="1.8" stroke-linecap="round" fill="none" /><path class="eve-eye" d="M16 11.5C16 10.5 15 10 13.5 11" stroke="#00cec9" stroke-width="1.8" stroke-linecap="round" fill="none" /></svg>
      <svg class="trigger-close" viewBox="0 0 24 24"><path fill="#ffffff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      <span class="dxel-ai-badge"></span>
    </button>
    <div class="dxel-ai-window" id="dxelAiWindow">
      <div class="dxel-ai-header">
        <div class="dxel-ai-avatar"><svg viewBox="0 0 24 24"><ellipse cx="12" cy="11" rx="10" ry="9" fill="#ffffff" /><ellipse cx="12" cy="11" rx="8" ry="5" fill="#1a1a2e" /><path class="eve-eye" d="M8 11.5C8 10.5 9 10 10.5 11" stroke="#00cec9" stroke-width="1.8" stroke-linecap="round" fill="none" /><path class="eve-eye" d="M16 11.5C16 10.5 15 10 13.5 11" stroke="#00cec9" stroke-width="1.8" stroke-linecap="round" fill="none" /></svg></div>
        <div class="dxel-ai-header-info"><h4>Nyx</h4><span>● Autonomous Agent</span></div>
        <button class="dxel-ai-header-close" id="dxelAiClose">✕</button>
      </div>
      <div class="dxel-ai-messages" id="dxelAiMessages"></div>
      <div class="dxel-ai-input-area">
        <input type="text" class="dxel-ai-input" id="dxelAiInput" placeholder="Message Nyx..." autocomplete="off">
        <button class="dxel-ai-send" id="dxelAiSend"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
      <div class="dxel-ai-footer">Powered by Gemini AI</div>
    </div>`;
    document.body.appendChild(widget);

    const trigger = document.getElementById('dxelAiTrigger'), win = document.getElementById('dxelAiWindow'), msgs = document.getElementById('dxelAiMessages'), input = document.getElementById('dxelAiInput'), sendBtn = document.getElementById('dxelAiSend'), closeBtn = document.getElementById('dxelAiClose'), badge = widget.querySelector('.dxel-ai-badge');

    function toggleChat() {
      const open = win.classList.toggle('open'); trigger.classList.toggle('active', open);
      if (open) {
        if (badge) badge.style.display = 'none';
        if (!msgs.children.length) showWelcome();
        setTimeout(() => input.focus(), 350);
      }
    }

    function formatText(text) {
      // Basic markdown formatting for bold and links
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\n/g, '<br>');
      return formatted;
    }

    function addMsg(text, type, quickReplies) {
      if (!text) return;
      const div = document.createElement('div'); div.className = `dxel-ai-msg ${type}`;
    div.innerHTML= `<div class="bubble">${formatText(text)}</div>`;

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
    if (state.messages.length > 0) {
        // Restore history
        state.messages.forEach(msg => {
            addMsg(msg.parts[0].text, msg.role === 'user' ? 'user' : 'bot');
        });
        addMsg("Welcome back! How can I help you today?", 'bot');
    } else {
        addMsg("Hi! 👋 I'm Nyx, the AI for DXEL Network. Are you looking to build a new website, develop an app, or scale your business with digital marketing?", 'bot', ['Build Website', 'Marketing']);
    }
  }

  async function handleUserMsg(text){
    if(!text.trim())return; 
    addMsg(text,'user'); 
    input.value=''; 
    document.querySelectorAll('.dxel-ai-quick-replies').forEach(el=>el.remove());
    
    const typing=showTyping();
    const res = await respondWithLLM(text);
    typing.remove();
    addMsg(res.text, 'bot', res.quick);
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
