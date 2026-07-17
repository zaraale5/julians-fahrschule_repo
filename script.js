// Smooth scroll for navigation
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length > 1 && document.getElementById(href.slice(1))) {
        e.preventDefault();
        document.getElementById(href.slice(1)).scrollIntoView({behavior:"smooth", block:"start"});
        document.getElementById(href.slice(1)).focus && document.getElementById(href.slice(1)).focus();
        // close nav on mobile
        document.getElementById('main-nav')?.classList.remove('open');
        document.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();

// Mobile nav toggle
(function(){
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      const open = nav.classList.toggle('open');
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();

// IntersectionObserver for scroll animations
(function(){
  var els = document.querySelectorAll('section, .course-card, .feature-card, .pricing-tier, .testimonial-card, .faq-item, .blog-post');
  els.forEach(function(el){ el.setAttribute('data-animate',''); });
  if ('IntersectionObserver' in window) {
    let observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    els.forEach(function(el){ observer.observe(el); });
  } else {
    // Fallback: show all
    els.forEach(function(el){ el.classList.add('is-visible'); });
  }
})();

// FAQ accordion
(function(){
  var faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(function(faq){
    var question = faq.querySelector('.faq-question');
    faq.addEventListener('click',function(e){
      if(faq.classList.contains('open')){ faq.classList.remove('open'); }
      else {
        document.querySelectorAll('.faq-list .faq-item.open').forEach(f=>f.classList.remove('open'));
        faq.classList.add('open');
      }
    });
    faq.addEventListener('keyup', function(e){
      if (e.key === 'Enter' || e.key === ' ') faq.click();
    });
  });
})();

// Kontaktformular – dummy validation
(function(){
  var form = document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function(input){
        if(!input.value.trim()) valid = false;
      });
      var msg = form.querySelector('.form-feedback');
      if(!valid){
        msg.textContent = "Bitte alle Felder ausfüllen.";
        return;
      }
      msg.textContent = "Vielen Dank für deine Nachricht! Wir melden uns asap.";
      setTimeout(function(){msg.textContent = "";form.reset();},3200);
    });
  }
})();

// CHATBOT WIDGET
(function(){
  var widget = document.getElementById('chatbot-widget');
  var toggle = document.getElementById('chatbot-toggle');
  var panel = document.getElementById('chatbot-panel');
  var close = document.getElementById('chatbot-close');
  var history = document.getElementById('chatbot-history');
  var form = document.getElementById('chatbot-form');
  var input = document.getElementById('chatbot-input');
  if(!widget) return;
  function openPanel(){
    panel.hidden=false;
    toggle.setAttribute('aria-expanded','true');
    setTimeout(()=>input.focus(),120);
  }
  function closePanel(){
    panel.hidden=true;
    toggle.setAttribute('aria-expanded','false');
    toggle.focus();
  }
  toggle.addEventListener('click',function(){
    panel.hidden?openPanel():closePanel();
  });
  close.addEventListener('click',closePanel);
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var val = input.value.trim();
    if(!val) return;
    // print user message
    var userMsg = document.createElement('div');
    userMsg.className = 'chatbot-msg chatbot-msg-user';
    userMsg.textContent = val;
    history.appendChild(userMsg);
    history.scrollTop = history.scrollHeight;
    input.value = '';
    // print loading
    var botMsg = document.createElement('div');
    botMsg.className = 'chatbot-msg chatbot-msg-bot';
    botMsg.textContent = '...';
    history.appendChild(botMsg);
    history.scrollTop = history.scrollHeight;
    fetch('https://overstay-choosy-succulent.ngrok-free.dev/webhook/chat',{
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: val, companyId: "julians-fahrschule-repo", companyName: "Julians Fahrschule"})
    }).then(r=>r.json()).then(function(data){
      botMsg.textContent = data.reply || "Leider keine Antwort erhalten.";
      history.scrollTop = history.scrollHeight;
    }).catch(function(){
      botMsg.textContent = "Leider keine Antwort erhalten.";
      history.scrollTop = history.scrollHeight;
    });
  });
  // trap focus (minimal)
  panel.addEventListener('keydown',function(e){
    if(e.key==="Escape"){closePanel();}
  });
  // accessible keyboard nav for toggle
  toggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPanel();
    }
  });
})();