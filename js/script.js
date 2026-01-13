/* ================================
   CURSOR NEÓN SIGUIENDO EL RATÓN
==================================*/
const glow = document.querySelector('.cursor');

window.addEventListener('pointermove', (e) => {
  if (!glow) return;
  glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`;
});

/* ================================
   PARALLAX DEL HERO
==================================*/
const heroBg = document.getElementById('heroBg');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
}, { passive: true });

/* ================================
   ANIMACIÓN "REVEAL" AL HACER SCROLL
==================================*/
const onscreen = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          {
            duration: 700,
            easing: 'cubic-bezier(.2,.6,.2,1)',
            fill: 'both'
          }
        );
        onscreen.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.section, .card, .tile, .panel').forEach((el) => {
  onscreen.observe(el);
});

/* ================================
   CARRUSEL HORIZONTAL (RUEDA RATÓN)
==================================*/
const scroller = document.getElementById('cards');

if (scroller) {
  scroller.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scroller.scrollLeft += e.deltaY;
      }
    },
    { passive: true }
  );
}

/* ================================
   CATÁLOGO: FILTROS + EFECTO TILT
   (solo existe en index.html)
==================================*/
const grid = document.getElementById('grid');
const filters = document.getElementById('filters');

if (grid && filters) {
  // Filtros por tipo
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;

    // Si el chip es un <a> (Pinballs), dejamos que navegue
    if (btn.tagName === 'A') return;

    const filter = btn.dataset.filter;
    grid.querySelectorAll('.tile').forEach((tile) => {
      const type = tile.dataset.type;
      const show = filter === 'all' || type === filter;
      tile.style.display = show ? 'block' : 'none';
    });
  });

  // Tilt 3D en las tarjetas del catálogo
  grid.addEventListener('pointermove', (e) => {
    const t = e.target.closest('.tile');
    if (!t) return;
    const r = t.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * 10;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * -10;
    t.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  grid.addEventListener('pointerleave', () => {
    grid.querySelectorAll('.tile').forEach((t) => {
      t.style.transform = 'rotateX(0) rotateY(0)';
    });
  });
}

/* ================================
   MODAL GENÉRICO (FORM CONTACTO INDEX)
   openModal() / closeModal()
==================================*/
const modal = document.getElementById('modal');

function openModal() {
  if (modal && typeof modal.showModal === 'function') {
    modal.showModal();
  }
}

function closeModal() {
  if (modal) modal.close();
}

// Hacemos accesibles las funciones al HTML (onsubmit="openModal()")
window.openModal = openModal;
window.closeModal = closeModal;

/* ================================
   MENÚ MÓVIL (BOTÓN "MENÚ")
==================================*/
const openMenuBtn = document.getElementById('openMenu');

if (openMenuBtn) {
  openMenuBtn.addEventListener('click', () => {
    const menu = document.querySelector('.menu');
    if (!menu) return;
    const isOpen = menu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    openMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Cerrar si clicas fuera del menú
  document.addEventListener('click', (e) => {
    const menu = document.querySelector('.menu');
    if (!menu) return;
    if (!menu.classList.contains('open')) return;

    const clickInsideMenu = menu.contains(e.target);
    const clickOnButton = e.target === openMenuBtn;

    if (!clickInsideMenu && !clickOnButton) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
      openMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const menu = document.querySelector('.menu');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
      openMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ================================
   DROPDOWNS DEL NAV ("CATÁLOGO")
   Funciona en todas las páginas
==================================*/
document.querySelectorAll('.dropdown').forEach((dd) => {
  const toggle = dd.querySelector('.dropdown-toggle');
  const menu = dd.querySelector('.dropdown-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Cerrar otros dropdowns abiertos
    document.querySelectorAll('.dropdown.open').forEach((other) => {
      if (other !== dd) other.classList.remove('open');
    });

    dd.classList.toggle('open');
    toggle.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false');
  });

  // Evitar que el click dentro cierre el menú
  menu.addEventListener('click', (e) => e.stopPropagation());
});

// Cerrar dropdowns al clicar fuera
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown.open').forEach((dd) => dd.classList.remove('open'));
});

// Cerrar dropdowns con ESC
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.dropdown.open').forEach((dd) => dd.classList.remove('open'));
});

/* ================================
   MODAL ALQUILER PINBALLS
   (alquiler-pinballs.html)
==================================*/
(function () {
  const dlg = document.getElementById('rentModal');
  if (!dlg) return; // solo existe en la página de alquiler

  const title = document.getElementById('rentTitle');
  const subtitle = document.getElementById('rentSubtitle');
  const image = document.getElementById('rentImage');
  const feats = document.getElementById('rentFeatures');
  const desc = document.getElementById('rentDesc');
  const aCall = document.getElementById('rentCall');
  const aWa = document.getElementById('rentWhatsapp');
  const aMail = document.getElementById('rentEmail');

  // Datos de contacto
  const phoneHuman = '630 85 23 11';
  const phoneTel = '630852311';
  const phoneWa = '34630852311'; // +34 para WhatsApp
  const emailTo = 'pressstartmadridd@gmail.com';

  // Al hacer click en un botón "ALQUILAR AHORA"
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.rent-btn');
    if (!btn) return;

    const name = btn.dataset.name || 'este pinball';
    const text = btn.dataset.desc || '';
    const imgSrc = btn.dataset.image || '';
    const features = (btn.dataset.features || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Rellenar textos
    title.textContent = '¿Cómo quieres contactar?';
    subtitle.innerHTML = `Elige tu forma preferida para alquilar <b>${name}</b>.`;
    desc.textContent = text;

    // Imagen
    if (imgSrc) {
      image.src = "";
      image.alt = "";
      image.style.display = 'none';
    } else {
      image.style.display = 'none';
    }

    // Chips de características
    feats.innerHTML = features
      .map((f) => `<span class="chip-ghost">${f}</span>`)
      .join('');

    // Enlaces de contacto
    const waMsg = encodeURIComponent(`Hola, quiero información sobre el pinball ${name}.`);
    aWa.href = `https://wa.me/${phoneWa}?text=${waMsg}`;
    aMail.href = `mailto:${emailTo}?subject=${encodeURIComponent(
      'Consulta sobre ' + name
    )}&body=${waMsg}`;
    aCall.href = `tel:${phoneTel}`;
    aCall.textContent = `📞 Llamar Ahora · ${phoneHuman}`;

    // Abrir modal
    if (typeof dlg.showModal === 'function') {
      dlg.showModal();
    }
  });

  // Cerrar modal al clicar fuera del cuadro
  dlg.addEventListener('click', (e) => {
    const inner = dlg.querySelector('.modal-inner');
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!inside) dlg.close();
  });
})();

// =========================
// ANIMACIÓN FURGONETA TRANSPORTE
// =========================
(function(){
  const section = document.querySelector('.transporte-section');
  const van = document.querySelector('.transporte-van');
  const track = document.querySelector('.transporte-van-track');

  if(!section || !van || !track) return;

  function updateVanOnScroll(){
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    if(rect.bottom < 0 || rect.top > vh){
      track.classList.remove('active');
      return;
    }

    const total = rect.height + vh;
    const visibleFromTop = vh - rect.top;
    let progress = visibleFromTop / total;
    progress = Math.max(0, Math.min(1, progress));

    if(progress > 0 && progress < 1){
      track.classList.add('active');
    }else{
      track.classList.remove('active');
    }

    const x = -40 + progress * 220;
    van.style.transform = `translateX(${x}%)`;
  }

  window.addEventListener('scroll', updateVanOnScroll, { passive:true });
  window.addEventListener('resize', updateVanOnScroll);
  updateVanOnScroll();
})();

// =========================
// CARRUSEL HOME DESTACADOS
// =========================
(function(){
  const track = document.querySelector('.carousel-track');
  if(!track) return;

  const items = Array.from(track.children);
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));

  let index = 0;

  function goTo(i){
    const total = items.length;
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot,idx)=>{
      dot.classList.toggle('is-active', idx === index);
    });
  }

  prevBtn?.addEventListener('click', ()=>goTo(index - 1));
  nextBtn?.addEventListener('click', ()=>goTo(index + 1));

  dots.forEach((dot,idx)=>{
    dot.addEventListener('click', ()=>goTo(idx));
  });

  // click en toda la tarjeta → ir a la página
  items.forEach(item=>{
    item.addEventListener('click', e=>{
      // no pisar los <a> internos
      if(e.target.closest('a')) return;
      const link = item.dataset.link;
      if(link) window.location.href = link;
    });
  });

  // auto-rotación suave
  let auto = setInterval(()=>goTo(index + 1), 7000);

   // si el usuario interactúa, sigue el auto pero reiniciado
  [prevBtn, nextBtn, ...dots].forEach(el=>{
    el?.addEventListener('click', ()=>{
      clearInterval(auto);
      auto = setInterval(()=>goTo(index + 1), 7000);
    });
  });


  goTo(0);
})();









