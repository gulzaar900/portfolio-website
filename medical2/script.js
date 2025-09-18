/* script.js - simple interactions: store reviews in localStorage, add smooth nav */
document.addEventListener('DOMContentLoaded', function(){
  // smooth link scrolling for same page anchors (if any)
  document.querySelectorAll('a[data-scroll]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href');
      document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
    });
  });

  // Reviews storage
  const form = document.getElementById('reviewForm');
  const list = document.getElementById('reviewsList');
  if(form && list){
    function render(){
      const items = JSON.parse(localStorage.getItem('sm_reviews')||'[]');
      list.innerHTML = '';
      if(items.length===0){
        list.innerHTML = '<div class="small">Koi review nahi hai. Pehla review add karein.</div>';
        return;
      }
      items.slice().reverse().forEach(it=>{
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `<div style="font-weight:700">${escapeHtml(it.name)}</div>
                         <div class="small" style="margin-top:6px">${escapeHtml(it.text)}</div>
                         <div class="small" style="margin-top:8px;color:var(--muted)">On ${new Date(it.t).toLocaleString()}</div>`;
        list.appendChild(div);
      });
    }
    render();
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const name = form.querySelector('[name=name]').value.trim()||'Anonymous';
      const text = form.querySelector('[name=review]').value.trim();
      if(!text) return alert('Please write a review.');
      const items = JSON.parse(localStorage.getItem('sm_reviews')||'[]');
      items.push({name,text,t:Date.now()});
      localStorage.setItem('sm_reviews', JSON.stringify(items));
      form.reset();
      render();
    });
  }

  // helper
  function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  // contact form fallback: mailto
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', e=>{
      const name = contactForm.name.value||'';
      const email = contactForm.email.value||'';
      const msg = contactForm.message.value||'';
      const subj = encodeURIComponent(`Enquiry from ${name || 'visitor'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
      window.location.href = `mailto:info@example.com?subject=${subj}&body=${body}`;
      e.preventDefault();
    });
  }
});
