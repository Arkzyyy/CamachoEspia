// ========================================================
// AGENCIA DE ESPIONAJE CAMACHO (A.E.C.) - SISTEMA DE CONTROL
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Audio Synthesis via Web Audio API (Zero external assets needed) ---
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.1, type = 'sine', gainVal = 0.15) {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  // Megalovania Iconic Mini Riff in Web Audio
  function playMegalovaniaRiff() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    
    // D4, D4, D5, A4, G#4, G4, F4, D4, F4, G4
    const notes = [
      { f: 293.66, d: 0.13 },
      { f: 293.66, d: 0.13 },
      { f: 587.33, d: 0.25 },
      { f: 440.00, d: 0.28 },
      { f: 415.30, d: 0.22 },
      { f: 392.00, d: 0.22 },
      { f: 349.23, d: 0.24 },
      { f: 293.66, d: 0.14 },
      { f: 349.23, d: 0.14 },
      { f: 392.00, d: 0.28 }
    ];

    let currentTime = audioCtx.currentTime + 0.05;
    notes.forEach((note) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, currentTime);
      gain.gain.setValueAtTime(0.12, currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.d);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(currentTime);
      osc.stop(currentTime + note.d);
      currentTime += note.d + 0.03;
    });
  }

  // Kirby Inhale Sound FX
  function playKirbyChomp() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // --- Sound Toggle Button ---
  const soundBtn = document.getElementById('sound-fx-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      soundBtn.querySelector('.ctrl-label').textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
      soundBtn.querySelector('.ctrl-icon').textContent = sfxEnabled ? '🔊' : '🔇';
      if (sfxEnabled) playTone(587, 0.15, 'sine');
    });
  }

  // --- Tactical Alarm Toggle ---
  const alarmBtn = document.getElementById('toggle-alarm');
  let alarmInterval = null;
  if (alarmBtn) {
    alarmBtn.addEventListener('click', () => {
      document.body.classList.toggle('alarm-active');
      const isActive = document.body.classList.contains('alarm-active');
      alarmBtn.querySelector('.ctrl-label').textContent = isActive ? 'ALARMA ACTIVA' : 'Alarma';
      
      if (isActive) {
        let toggleSiren = false;
        alarmInterval = setInterval(() => {
          playTone(toggleSiren ? 880 : 660, 0.22, 'square', 0.1);
          toggleSiren = !toggleSiren;
        }, 300);
      } else {
        if (alarmInterval) clearInterval(alarmInterval);
      }
    });
  }

  // --- El Camacho Morph Switcher ---
  const avatarWrapper = document.getElementById('camacho-avatar');
  const morphButtons = document.querySelectorAll('.morph-btn');
  const leaderQuote = document.getElementById('leader-quote');

  const quotes = {
    hybrid: `"¿Quieres pasar un mal rato o prefieres que te inhale con todo y tus tomates? Tú decides. Bienvenido a mi agencia."`,
    kirby: `"¡Poyo! Traducido del dialecto cósmico antiguo: 'Tus secretos de estado ahora me pertenecen y saben delicioso'."`,
    sans: `"es un hermoso día allá afuera. las aves cantan, las flores florecen... en días como estos, espías como tú deberían estar secuestrando tomates."`
  };

  morphButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      morphButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const form = btn.getAttribute('data-form');

      // Update avatar class
      avatarWrapper.className = 'camacho-avatar-wrapper';
      if (form === 'kirby') {
        avatarWrapper.classList.add('mode-kirby');
        playKirbyChomp();
      } else if (form === 'sans') {
        avatarWrapper.classList.add('mode-sans');
        playMegalovaniaRiff();
      } else {
        avatarWrapper.classList.add('mode-hybrid');
        playTone(523.25, 0.1, 'sine');
      }

      if (leaderQuote) {
        leaderQuote.innerHTML = `<em>${quotes[form]}</em>`;
      }
    });
  });

  // --- Supreme Wisdom Generator ---
  const wisdomBtn = document.getElementById('hear-wisdom-btn');
  const wisdomDisplay = document.getElementById('wisdom-display');
  const wisdomQuotes = [
    "“No confíes en nadie que corte los tomates en cubitos perfectos. Ocultan algo grave.”",
    "“Si un guardia te detiene, grita '¡POYO!' y desaparece corriendo en círculos.”",
    "“El hackeo ético consiste en pedir permiso antes de borrar la base de datos de impuestos.”",
    "“Un buen espía no duerme; simplemente recarga su batería cuántica con una siesta de 14 horas.”",
    "“Los marcianos nos enviaron un mensaje hace 3 años: 'Por favor apaguen el reggaetón los domingos'.”",
    "“He devorado tanques soviéticos enteros con salsa barbacoa. ¿Crees que me asusta tu firewall?”",
    "“Recuerda: si el niño no quiere comer verduras, no es desobediencia, es un intento de golpe de estado doméstico.”"
  ];

  if (wisdomBtn && wisdomDisplay) {
    wisdomBtn.addEventListener('click', () => {
      initAudio();
      playTone(440, 0.08, 'triangle');
      const randomIdx = Math.floor(Math.random() * wisdomQuotes.length);
      wisdomDisplay.style.opacity = '0.3';
      setTimeout(() => {
        wisdomDisplay.textContent = wisdomQuotes[randomIdx];
        wisdomDisplay.style.opacity = '1';
        playTone(659.25, 0.15, 'sine');
      }, 150);
    });
  }

  // --- Interactive Espionage Quiz ---
  const quizData = [
    {
      q: "Te encuentras frente a un láser de seguridad infrarrojo en la bóveda de tomates del Vaticano. ¿Cómo procedes?",
      options: [
        { text: "Uso acrobacias estilo Misión Imposible vestida de Kirby.", score: 3 },
        { text: "Le lanzo un hueso de Sans para reflejar el haz de luz.", score: 4 },
        { text: "Me como el láser para absorber su poder térmico.", score: 5 },
        { text: "Le pregunto al láser si tiene novia.", score: 2 }
      ]
    },
    {
      q: "Tu misión es derrocar un gobierno extranjero antes de las 5:00 PM. ¿Cuál es tu arma principal?",
      options: [
        { text: "Un meme tan ridículo que paraliza los tres poderes del estado.", score: 5 },
        { text: "Sobornar al presidente con una pizza repleta de tomates clandestinos.", score: 4 },
        { text: "Hackear la televisión nacional para emitir Megalovania en loop.", score: 4 },
        { text: "Esconder todos los bolígrafos de la casa de gobierno.", score: 3 }
      ]
    },
    {
      q: "Descubres a tu hijo navegando en la dark web a las 3:00 AM. ¿Qué protocolo aplicas?",
      options: [
        { text: "Fingir ser un agente secreto ruso a través del chat de Roblox.", score: 5 },
        { text: "Cambiar la contraseña del WiFi por la raíz cuadrada de pi.", score: 3 },
        { text: "Reclutarlo inmediatamente en la división infantil de espías Camacho.", score: 5 },
        { text: "Inhalar su computadora como un Kirby furioso.", score: 4 }
      ]
    },
    {
      q: "¿Cuál es tu postura moral sobre el secuestro y custodia de tomates?",
      options: [
        { text: "Los tomates son seres sensibles que merecen estar en la despensa del Camacho.", score: 5 },
        { text: "Es la única moneda que no se devalúa ante la inflación galáctica.", score: 4 },
        { text: "Solo los secuestro si vienen acompañados de queso mozzarella.", score: 3 },
        { text: "Todo por la causa del Líder Supremo.", score: 5 }
      ]
    }
  ];

  let currentQuestion = 0;
  let totalScore = 0;

  const quizCard = document.getElementById('quiz-card');
  const quizProgress = document.getElementById('quiz-progress');
  const quizQnum = document.getElementById('quiz-qnum');
  const quizQtext = document.getElementById('quiz-qtext');
  const quizOptions = document.getElementById('quiz-options');
  const quizResult = document.getElementById('quiz-result');
  const resultRank = document.getElementById('result-rank');
  const resultDesc = document.getElementById('result-desc');
  const restartQuizBtn = document.getElementById('restart-quiz-btn');

  function renderQuestion(index) {
    if (!quizCard) return;
    const q = quizData[index];
    quizQnum.textContent = `PREGUNTA ${index + 1} DE ${quizData.length}`;
    quizQtext.textContent = q.q;
    quizProgress.style.width = `${((index + 1) / quizData.length) * 100}%`;

    quizOptions.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.innerHTML = `<span class="quiz-opt-letter">${letters[i]}</span><span>${opt.text}</span>`;
      btn.addEventListener('click', () => {
        initAudio();
        playTone(330 + i * 100, 0.08, 'triangle');
        totalScore += opt.score;
        if (currentQuestion < quizData.length - 1) {
          currentQuestion++;
          renderQuestion(currentQuestion);
        } else {
          showQuizResults();
        }
      });
      quizOptions.appendChild(btn);
    });
  }

  function showQuizResults() {
    quizCard.style.display = 'none';
    quizResult.classList.remove('hidden');
    playTone(523.25, 0.2, 'sine');
    setTimeout(() => playTone(659.25, 0.3, 'sine'), 150);

    let rank = '';
    let desc = '';

    if (totalScore >= 18) {
      rank = 'RANGO: SUB-COMANDANTE DEVORADOR DE GALAXIAS (CLASE KIRBY-SANS)';
      desc = 'Posees una mente táctica brillante, hambre insaciable de victoria y cero piedad con las ensaladas ajenas. El Camacho te considera digno de heredar su sombrero de espía.';
    } else if (totalScore >= 14) {
      rank = 'RANGO: AGENTE ESPECIAL DE SECUESTRO DE TOMATES & HACKEO NO ÉTICO';
      desc = 'Tu capacidad para sembrar el caos cibernético mientras te robas los vegetales de una embajada es sobresaliente. Tu gabardina será de seda negra reforzada.';
    } else {
      rank = 'RANGO: INFILTRADOR DOMÉSTICO DE PELUCHES Y DETECTOR DE CHATURBATE';
      desc = 'Tienes el don de espiar a tus hijos y a los vecinos sin que sospechen. Comenzarás en misiones de sabotaje de café matutino.';
    }

    resultRank.textContent = rank;
    resultDesc.textContent = desc;
  }

  if (restartQuizBtn) {
    restartQuizBtn.addEventListener('click', () => {
      currentQuestion = 0;
      totalScore = 0;
      quizResult.classList.add('hidden');
      quizCard.style.display = 'block';
      renderQuestion(0);
    });
  }

  // Initialize Quiz
  renderQuestion(0);

  // --- Recruitment Form & Badge Generation ---
  const recruitForm = document.getElementById('recruit-form');
  const idCardOutput = document.getElementById('id-card-output');
  const badgeAlias = document.getElementById('badge-alias');
  const badgeRank = document.getElementById('badge-rank');
  const badgeDiv = document.getElementById('badge-div');
  const badgeCode = document.getElementById('badge-code');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const printBadgeBtn = document.getElementById('print-badge-btn');

  // --- Mobile Navigation Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      initAudio();
      mainNav.classList.toggle('mobile-open');
      playTone(520, 0.05, 'triangle');
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('mobile-open');
      });
    });
  }

  // --- Avatar Selection Logic ---
  const avatarOptions = document.querySelectorAll('.avatar-option');
  let selectedAvatarEmoji = '🕵️‍♂️';
  avatarOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      initAudio();
      avatarOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedAvatarEmoji = radio.value;
      }
      playTone(600, 0.06, 'sine');
    });
  });

  // --- Enemy Dossier Decoders ---
  const dossierBtns = document.querySelectorAll('.btn-dossier-toggle');
  dossierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      const targetId = btn.getAttribute('data-target');
      const targetBox = document.getElementById(`dossier-${targetId}`);
      if (targetBox) {
        const isHidden = targetBox.classList.contains('hidden');
        if (isHidden) {
          targetBox.classList.remove('hidden');
          btn.innerHTML = '<span>🔒 OCULTAR EXPEDIENTE</span>';
          playTone(450, 0.07, 'sawtooth');
          setTimeout(() => playTone(750, 0.1, 'sine'), 80);
        } else {
          targetBox.classList.add('hidden');
          btn.innerHTML = '<span>🔍 DECODIFICAR EXPEDIENTE</span>';
          playTone(300, 0.07, 'triangle');
        }
      }
    });
  });

  if (recruitForm) {
    recruitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();

      const aliasVal = document.getElementById('agent-alias').value.trim();
      const coatVal = document.getElementById('agent-coat').value;
      const divSelect = document.getElementById('agent-division');
      const divText = divSelect.options[divSelect.selectedIndex].text;
      const termsCheck = document.getElementById('terms-check').checked;

      if (!aliasVal) {
        alert('¡Alerta de seguridad! Necesitas especificar un Nombre Clave.');
        return;
      }
      if (!coatVal) {
        alert('Por favor selecciona tu talla de gabardina.');
        return;
      }
      if (!termsCheck) {
        alert('Debes jurar confidencialidad para recibir la credencial de El Camacho.');
        return;
      }

      // Generate random agent code
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const code = `CMC-${randomNum}-TOM`;

      badgeAlias.textContent = aliasVal.toUpperCase();
      badgeRank.textContent = coatVal === 'KIRBY' ? 'ESPÍA CÓSMICO ESFÉRICO' : 'AGENTE CAMACHO CLASE-A';
      badgeDiv.textContent = divText;
      badgeCode.textContent = code;

      // Update chosen avatar in badge
      const badgePhotoRender = document.getElementById('badge-photo-render');
      if (badgePhotoRender) {
        badgePhotoRender.innerHTML = `<span class="badge-emoji-avatar">${selectedAvatarEmoji}</span>`;
      }

      recruitForm.style.display = 'none';
      idCardOutput.classList.remove('hidden');

      playMegalovaniaRiff();
      idCardOutput.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      recruitForm.reset();
      recruitForm.style.display = 'block';
      idCardOutput.classList.add('hidden');
    });
  }

  if (printBadgeBtn) {
    printBadgeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- Self-Destruct Sequence ---
  const destructBtn = document.getElementById('self-destruct-btn');
  const destructCountdown = document.getElementById('destruct-countdown');

  if (destructBtn && destructCountdown) {
    destructBtn.addEventListener('click', () => {
      initAudio();
      destructBtn.disabled = true;
      destructCountdown.classList.remove('hidden');
      let count = 5;
      destructCountdown.textContent = count;

      const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          destructCountdown.textContent = count;
          playTone(800 + (5 - count) * 150, 0.15, 'sawtooth', 0.2);
        } else {
          clearInterval(countdownInterval);
          destructCountdown.textContent = '💥 BOOM 💥';
          playTone(150, 0.8, 'square', 0.3);
          document.body.classList.add('self-destructed');

          setTimeout(() => {
            const restored = confirm('⚠️ SISTEMA AUTODESTRUIDO.\n\nEl Camacho ha protegido tus datos con un escudo de tomates cuánticos.\n\n¿Deseas restaurar la página para seguir espiando?');
            if (restored || !restored) {
              document.body.classList.remove('self-destructed');
              destructCountdown.classList.add('hidden');
              destructBtn.disabled = false;
            }
          }, 1200);
        }
      }, 1000);
    });
  }
});
