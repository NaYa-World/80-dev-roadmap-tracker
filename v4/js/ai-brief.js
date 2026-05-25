// ═══════════════════════════════════════════════
// AI DAILY BRIEF — calls Claude API
// ═══════════════════════════════════════════════
const BRIEF_SK = 'devmap_brief';

function buildBriefPrompt() {
  const done=cntDone(), total=cntTotal(), left=total-done, pct=total?Math.round(done/total*100):0;
  const streak=S._streak||0;
  const hours=studyHours();
  const score=readinessScore();
  // Find next 3 incomplete days
  const nextDays=[];
  allDays().forEach(function(item){
    if(nextDays.length>=3) return;
    if(dayDone(item.pi,item.di)<dayTotal(item.pi,item.di)){
      nextDays.push({
        day:item.d.day, label:item.d.label,
        done:dayDone(item.pi,item.di), total:dayTotal(item.pi,item.di),
        phase:item.ph.title
      });
    }
  });
  const nextStr=nextDays.map(function(d){ return d.day+' ('+d.label+') — '+d.done+'/'+d.total+' tasks done'; }).join(', ');
  const eta=calcETA();
  const etaStr=eta ? 'At current pace ('+eta.avgPerDay+' tasks/day), finish by '+eta.eta+'.' : 'Not enough data for ETA yet.';

  return `You are a senior developer trainer and career coach. Give a warm, direct, motivating daily study brief for a 33-year-old career-switcher learning frontend development to land their first job in Hyderabad.

Current status:
- Tasks completed: ${done}/${total} (${pct}%)
- Day streak: ${streak} days
- Study hours logged: ${hours}h (via Pomodoro)
- Interview readiness score: ${score}%
- Next incomplete days: ${nextStr || 'All days complete!'}
- ETA: ${etaStr}

Write a brief daily plan in 3-4 short paragraphs:
1. One sentence acknowledging their current progress (specific, not generic)
2. What to focus on today specifically (reference the actual topics above)
3. One concrete tip or mindset point for today
4. One motivating closing line referencing the job goal

Keep it under 150 words total. Be direct, warm, and specific. No bullet points — flowing prose only.`;
}

async function fetchBrief(forceRefresh) {
  const today=new Date().toDateString();
  const cached=JSON.parse(localStorage.getItem(BRIEF_SK)||'null');
  if(!forceRefresh && cached && cached.date===today && cached.text) {
    renderBriefText(cached.text); return;
  }
  showBriefLoading();
  try {
    const resp=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:400,
        messages:[{role:'user',content:buildBriefPrompt()}]
      })
    });
    if(!resp.ok) throw new Error('API '+resp.status);
    const data=await resp.json();
    const text=data.content.filter(function(c){return c.type==='text';}).map(function(c){return c.text;}).join('');
    localStorage.setItem(BRIEF_SK,JSON.stringify({date:today,text}));
    renderBriefText(text);
  } catch(e) {
    renderBriefText('Could not load AI brief — check your connection. In the meantime: open today\'s day in Daily Focus, work through each concept task first, then code for at least 4 hours. Push to GitHub before you sleep.');
  }
}

function showBriefLoading() {
  const content=document.getElementById('brief-content');
  if(!content) return;
  content.className='brief-content loading';
  content.innerHTML='<div class="brief-dots"><span></span><span></span><span></span></div> Generating your personalised brief…';
}

function renderBriefText(text) {
  const content=document.getElementById('brief-content');
  if(!content) return;
  content.className='brief-content';
  // Convert paragraphs
  const html=text.trim().split(/\n\n+/).map(function(p){ return '<p>'+p.replace(/\n/g,' ')+'</p>'; }).join('');
  content.innerHTML=html;
}

function initBrief() {
  const refreshBtn=document.getElementById('brief-refresh');
  const openBtn=document.getElementById('brief-open-claude');
  if(refreshBtn) refreshBtn.addEventListener('click',function(){ fetchBrief(true); });
  if(openBtn) openBtn.addEventListener('click',function(){
    const msg=buildBriefPrompt().replace('Write a brief daily plan in 3-4 short paragraphs:\n1. One sentence acknowledging their current progress (specific, not generic)\n2. What to focus on today specifically (reference the actual topics above)\n3. One concrete tip or mindset point for today\n4. One motivating closing line referencing the job goal\n\nKeep it under 150 words total. Be direct, warm, and specific. No bullet points — flowing prose only.','Now act as my senior trainer for today. Start with my daily brief, then ask me what I need help with.');
    window.open('https://claude.ai/new?q='+encodeURIComponent(msg),'_blank');
  });
  // Auto-fetch on first load
  fetchBrief(false);
}
