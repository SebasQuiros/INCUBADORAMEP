/* INEA — interacciones del sitio */
(function () {
  'use strict';

  // --- Menú móvil ---
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });

    // Cerrar al hacer clic en un enlace
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Botón "volver arriba" ---
  var backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) backTop.classList.add('show');
      else backTop.classList.remove('show');
    }, { passive: true });
  }

  // --- Año dinámico en el footer ---
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Contacto: WhatsApp y correo con mensaje según el tema ---
  var WA_PHONE = '50671656006'; // +506 7165-6006
  var MAIL = 'nelson.campos.vega@mep.go.cr';

  var TOPICS = {
    postular: {
      subject: 'Quiero postular mi proyecto a INEA',
      body: 'Hola Nelson, soy estudiante/egresado(a) de la zona y me gustaría postular mi proyecto a la Incubadora de Negocios de Alajuela (INEA). ¿Me podrías indicar los requisitos y los pasos para aplicar? ¡Gracias!'
    },
    mentor: {
      subject: 'Me interesa ser mentor(a) de INEA',
      body: 'Hola Nelson, me interesa sumarme como mentor(a) voluntario(a) de la Incubadora de Negocios de Alajuela (INEA). Me gustaría conocer cómo puedo participar y apoyar a los jóvenes emprendedores. ¡Gracias!'
    },
    info: {
      subject: 'Consulta sobre INEA',
      body: 'Hola Nelson, quisiera más información sobre la Incubadora de Negocios de Alajuela (INEA). ¿Me podrías ayudar? ¡Gracias!'
    }
  };

  var cwOptions = document.getElementById('cwOptions');
  var waBtn = document.getElementById('waBtn');
  var mailBtn = document.getElementById('mailBtn');

  function setTopic(topic) {
    if (!TOPICS[topic]) topic = 'info';
    var t = TOPICS[topic];
    if (waBtn) waBtn.href = 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(t.body);
    if (mailBtn) mailBtn.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(t.subject) + '&body=' + encodeURIComponent(t.body);
    if (cwOptions) {
      cwOptions.querySelectorAll('.cw-opt').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-topic') === topic);
      });
    }
  }

  // Botones directos de WhatsApp con un tema fijo (ej. video de requisitos)
  document.querySelectorAll('[data-wa-topic]').forEach(function (el) {
    var t = TOPICS[el.getAttribute('data-wa-topic')] || TOPICS.info;
    el.href = 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(t.body);
  });

  if (waBtn || mailBtn) {
    setTopic('postular'); // por defecto

    if (cwOptions) {
      cwOptions.querySelectorAll('.cw-opt').forEach(function (b) {
        b.addEventListener('click', function () { setTopic(b.getAttribute('data-topic')); });
      });
    }

    // Botones de otras secciones que llevan a contacto preseleccionando el tema
    document.querySelectorAll('.js-set-topic').forEach(function (link) {
      link.addEventListener('click', function () { setTopic(link.getAttribute('data-topic')); });
    });
  }

  // --- Videos: reproducir solos (muted) al entrar en pantalla, pausar al salir ---
  var videos = document.querySelectorAll('.auto-video');

  if (videos.length) {
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        });
      }, { threshold: [0, 0.5, 1] });

      videos.forEach(function (v) { obs.observe(v); });
    }

    // Clic en el video para activar/desactivar el sonido
    videos.forEach(function (v) {
      var frame = v.closest('.video-frame');
      var badge = frame ? frame.querySelector('.video-unmute') : null;

      v.addEventListener('click', function () {
        v.muted = !v.muted;
        if (!v.muted && v.paused) v.play().catch(function () {});
        if (badge) {
          badge.textContent = v.muted ? '🔇 Toca para activar el sonido' : '🔊 Sonido activado';
          if (!v.muted) frame.classList.add('sound-on');
          else frame.classList.remove('sound-on');
        }
      });
    });
  }
})();
