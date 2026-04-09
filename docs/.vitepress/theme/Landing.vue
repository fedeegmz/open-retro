<script setup lang="ts">
import logoSvg from '@shared/assets/logo-icon.svg?raw'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="landing">
    <!-- NAV -->
    <nav>
      <div class="nav-logo" @click="scrollToTop" style="cursor: pointer">
        <div v-html="logoSvg"></div>
        <span>Open Retro</span>
      </div>
      <div class="nav-links">
        <a href="#features">Funcionalidades</a>
        <a href="#como-funciona">Cómo funciona</a>
        <a href="/guide/">Docs</a>
        <a class="nav-cta" href="#">Empezar gratis</a>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>
      <div class="hero-content">
        <div class="hero-badge"><span></span> Open Source · Tiempo real</div>
        <h1>Retrospectivas de equipo<br /><em>sin fricciones</em></h1>
        <p class="hero-sub">
          Una herramienta colaborativa y open source para que tu equipo reflexione, comparta y
          mejore — en tiempo real, sin complicaciones.
        </p>
        <div class="hero-actions">
          <a class="btn-primary" href="#">Probar ahora →</a>
          <a class="btn-secondary" href="https://github.com/fedeegmz/open-retro" target="_blank"
            >Ver en GitHub</a
          >
        </div>

        <!-- DEMO PREVIEW -->
        <div class="demo-wrapper">
          <div class="demo-bar">
            <div class="dot" style="background: #e5484d"></div>
            <div class="dot" style="background: #ef9f27"></div>
            <div class="dot" style="background: #3eaf7c"></div>
            <span class="demo-bar-title">Sprint 42 — Retrospectiva</span>
          </div>
          <div class="demo-board">
            <div class="demo-col">
              <div class="demo-col-header col-green">✓ Salió bien</div>
              <div class="demo-card">
                <div class="demo-card-tag tag-green">equipo</div>
                <div>La comunicación entre front y back mejoró mucho este sprint</div>
              </div>
              <div class="demo-card">
                <div class="demo-card-tag tag-green">proceso</div>
                <div>Las daily meetings fueron muy cortas y efectivas</div>
              </div>
            </div>
            <div class="demo-col">
              <div class="demo-col-header col-red">✗ A mejorar</div>
              <div class="demo-card">
                <div class="demo-card-tag tag-red">tech debt</div>
                <div>Acumulamos demasiada deuda técnica en el módulo de pagos</div>
              </div>
              <div class="demo-card">
                <div class="demo-card-tag tag-red">docs</div>
                <div>Falta documentar las APIs nuevas antes del merge</div>
              </div>
            </div>
            <div class="demo-col">
              <div class="demo-col-header col-amber">? Para discutir</div>
              <div class="demo-card">
                <div class="demo-card-tag tag-amber">proceso</div>
                <div>¿Deberíamos cambiar el tamaño de los sprints a 2 semanas?</div>
              </div>
              <div class="demo-card">
                <div class="demo-card-tag tag-amber">herramientas</div>
                <div>Evaluar si seguimos usando Jira o migramos a Linear</div>
              </div>
            </div>
            <div class="demo-col">
              <div class="demo-col-header col-blue">→ Acciones</div>
              <div class="demo-card">
                <div class="demo-card-tag tag-blue">@lucas</div>
                <div>Crear guía de documentación de APIs para el equipo</div>
              </div>
              <div class="demo-card">
                <div class="demo-card-tag tag-blue">@todos</div>
                <div>Definir criterios de done para la próxima planning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features">
      <div class="section-label">Funcionalidades</div>
      <h2 class="section-title">Todo lo que necesita tu equipo</h2>
      <p class="section-sub">
        Diseñado para ser simple de usar, pero con todo el poder que necesitás para retrospectivas
        efectivas.
      </p>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
          </div>
          <div class="feature-title">Tableros colaborativos</div>
          <div class="feature-desc">
            Múltiples participantes agregan tarjetas al mismo tiempo. Sin recargar, sin esperar.
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div class="feature-title">Tiempo real</div>
          <div class="feature-desc">
            Actualizaciones instantáneas con WebSockets. Lo que escribe uno, todos lo ven al
            instante.
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <div class="feature-title">Canvas infinito</div>
          <div class="feature-desc">
            Espacio sin límites para organizar tus ideas. Pané y movete con libertad total por el
            tablero.
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div class="feature-title">Modo de enfoque</div>
          <div class="feature-desc">
            Ocultá las notas de los demás durante la lluvia de ideas para evitar sesgos y fomentar
            la honestidad.
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div class="feature-title">Importá y Exportá</div>
          <div class="feature-desc">
            Guardá tus tableros en formato JSON. Tené el control total de tus datos sin depender de
            una nube.
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div class="feature-title">Self-hosteable</div>
          <div class="feature-desc">
            Desplegá OpenRetro en tu propia infra. Tus datos, tu control, sin dependencias externas.
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <div class="how-section" id="como-funciona">
      <div class="how-inner">
        <div class="section-label">Cómo funciona</div>
        <h2 class="section-title">Listo en minutos</h2>
        <p class="section-sub">
          Sin cuentas, sin configuración compleja. Tu equipo puede empezar una retro en segundos.
        </p>
        <div class="steps-grid">
          <div class="step">
            <div class="step-num">01</div>
            <div class="step-title">Creá una sesión</div>
            <div class="step-desc">
              Abrí OpenRetro, elegí el formato y compartí el link con tu equipo. Sin registro
              obligatorio.
            </div>
          </div>
          <div class="step">
            <div class="step-num">02</div>
            <div class="step-title">Agreguen tarjetas</div>
            <div class="step-desc">
              Cada integrante escribe sus comentarios de forma anónima o con nombre, en tiempo real.
            </div>
          </div>
          <div class="step">
            <div class="step-num">03</div>
            <div class="step-title">Revelen y agrupen</div>
            <div class="step-desc">
              El moderador revela las tarjetas, el equipo las discute y agrupa en áreas temáticas
              usando contenedores.
            </div>
          </div>
          <div class="step" style="border-right: none">
            <div class="step-num">04</div>
            <div class="step-title">Exporten y guarden</div>
            <div class="step-desc">
              Descargá el tablero completo en un archivo JSON para referencia futura o para seguir
              en otra sesión.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- OPEN SOURCE -->
    <div class="oss-section">
      <div class="section-label" style="display: block">Open Source</div>
      <h2 class="section-title">100% abierto y gratuito</h2>
      <p class="section-sub" style="max-width: 100%">
        OpenRetro es MIT. Podés usarlo, modificarlo y contribuir. La comunidad es bienvenida.
      </p>
      <div class="oss-actions">
        <div class="code-block">
          <span class="prompt">$</span>
          <span>git clone https://github.com/fedeegmz/open-retro</span>
        </div>
        <a class="github-btn" href="https://github.com/fedeegmz/open-retro" target="_blank">
          <svg viewBox="0 0 24 24">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          Ver en GitHub
        </a>
      </div>
    </div>

    <!-- FOOTER -->
    <footer>
      <div class="footer-brand">
        <div v-html="logoSvg" style="width: 22px; height: 22px"></div>
        <span style="font-size: 14px">Open Retro</span>
        <span class="footer-sep">·</span>
        <span style="font-size: 13px; color: var(--muted)">MIT License</span>
      </div>
      <div class="footer-links">
        <a href="/guide/">Documentación</a>
        <a href="https://github.com/fedeegmz/open-retro" target="_blank">GitHub</a>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

.landing {
  --green: #3eaf7c;
  --green-light: #4abf8a;
  --green-glow: rgba(62, 175, 124, 0.18);
  --bg: #0f1117;
  --bg2: #161b25;
  --bg3: #1c2333;
  --surface: #1e2535;
  --border: rgba(255, 255, 255, 0.07);
  --text: #e8eaf0;
  --muted: #8b92a8;
  --font: 'DM Sans', sans-serif;
  --mono: 'DM Mono', monospace;

  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}

/* Reset VitePress layout interference */
.landing * {
  box-sizing: border-box;
}

/* NAV */
.landing nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 60px;
  background: rgba(15, 17, 23, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  margin: 0;
}

.landing .nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.landing .nav-logo :deep(svg) {
  width: 32px;
  height: 32px;
}

.landing .nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.landing .nav-links a {
  font-size: 14px;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}

.landing .nav-links a:hover {
  color: var(--text);
}

.landing .nav-cta {
  font-size: 14px;
  font-weight: 500;
  padding: 7px 18px;
  border-radius: 7px;
  background: var(--green);
  color: #fff !important;
  transition: background 0.2s !important;
}

.landing .nav-cta:hover {
  background: var(--green-light) !important;
}

/* HERO */
.landing .hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 140px 2rem 100px;
  position: relative;
  overflow: hidden;
  max-width: 100%;
}

.landing .hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(
    ellipse 70% 50% at 50% 30%,
    rgba(62, 175, 124, 0.12) 0%,
    transparent 70%
  );
}

.landing .hero-grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 80%);
}

.landing .hero-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.landing .hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-family: var(--mono);
  color: var(--green);
  border: 1px solid rgba(62, 175, 124, 0.3);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 2rem;
  background: rgba(62, 175, 124, 0.06);
}

.landing .hero-badge span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: landing-pulse 2s infinite;
}

@keyframes landing-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.landing h1 {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
  color: var(--text);
}

.landing h1 em {
  font-style: normal;
  color: var(--green);
}

.landing .hero-sub {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--muted);
  max-width: 540px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}

.landing .hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.landing .btn-primary {
  padding: 12px 28px;
  border-radius: 8px;
  background: var(--green);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}

.landing .btn-primary:hover {
  background: var(--green-light);
  transform: translateY(-1px);
}

.landing .btn-secondary {
  padding: 12px 28px;
  border-radius: 8px;
  background: transparent;
  color: var(--text);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--border);
  transition:
    border-color 0.2s,
    background 0.2s;
}

.landing .btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.04);
}

/* DEMO CARD */
.landing .demo-wrapper {
  margin-top: 4rem;
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--bg2);
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
}

.landing .demo-bar {
  padding: 12px 16px;
  background: var(--bg3);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}

.landing .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.landing .demo-bar-title {
  font-size: 12px;
  font-family: var(--mono);
  color: var(--muted);
  margin-left: 8px;
}

.landing .demo-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  min-height: 200px;
}

.landing .demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.landing .demo-col-header {
  font-size: 11px;
  font-weight: 500;
  font-family: var(--mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 6px 10px;
  border-radius: 6px;
}

.landing .col-green {
  background: rgba(62, 175, 124, 0.12);
  color: #3eaf7c;
}
.landing .col-red {
  background: rgba(229, 72, 77, 0.1);
  color: #e5484d;
}
.landing .col-amber {
  background: rgba(239, 159, 39, 0.1);
  color: #ef9f27;
}
.landing .col-blue {
  background: rgba(55, 138, 221, 0.1);
  color: #378add;
}

.landing .demo-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text);
  line-height: 1.5;
}

.landing .demo-card-tag {
  display: inline-block;
  font-size: 10px;
  font-family: var(--mono);
  padding: 2px 7px;
  border-radius: 4px;
  margin-bottom: 5px;
}

.landing .tag-green {
  background: rgba(62, 175, 124, 0.15);
  color: #3eaf7c;
}
.landing .tag-red {
  background: rgba(229, 72, 77, 0.12);
  color: #e5484d;
}
.landing .tag-amber {
  background: rgba(239, 159, 39, 0.12);
  color: #ef9f27;
}
.landing .tag-blue {
  background: rgba(55, 138, 221, 0.12);
  color: #378add;
}

/* FEATURES */
.landing section#features {
  padding: 96px 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.landing .section-label {
  font-size: 12px;
  font-family: var(--mono);
  color: var(--green);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 0.75rem;
}

.landing .section-title {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  color: var(--text);
}

.landing .section-sub {
  font-size: 1.05rem;
  color: var(--muted);
  max-width: 500px;
  line-height: 1.7;
}

.landing .features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 3.5rem;
}

.landing .feature-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  transition:
    border-color 0.2s,
    transform 0.2s;
}

.landing .feature-card:hover {
  border-color: rgba(62, 175, 124, 0.3);
  transform: translateY(-2px);
}

.landing .feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--green-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.landing .feature-icon svg {
  width: 20px;
  height: 20px;
  stroke: var(--green);
  fill: none;
  stroke-width: 1.8;
}

.landing .feature-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--text);
}

.landing .feature-desc {
  font-size: 13.5px;
  color: var(--muted);
  line-height: 1.6;
}

/* HOW IT WORKS */
.landing .how-section {
  padding: 96px 2rem;
  background: var(--bg2);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.landing .how-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.landing .steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0;
  margin-top: 3.5rem;
  position: relative;
}

.landing .step {
  padding: 2rem;
  position: relative;
  border-right: 1px solid var(--border);
}

.landing .step:last-child {
  border-right: none;
}

.landing .step-num {
  font-size: 11px;
  font-family: var(--mono);
  color: var(--green);
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
}

.landing .step-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--text);
}

.landing .step-desc {
  font-size: 13.5px;
  color: var(--muted);
  line-height: 1.6;
}

/* OPEN SOURCE */
.landing .oss-section {
  padding: 96px 2rem;
  background: var(--bg);
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.landing .oss-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 2.5rem;
}

.landing .code-block {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 20px;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s;
}

.landing .code-block:hover {
  border-color: rgba(62, 175, 124, 0.4);
}

.landing .code-block .prompt {
  color: var(--green);
}

.landing .github-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.landing .github-btn:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.04);
}

.landing .github-btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* FOOTER */
.landing footer {
  border-top: 1px solid var(--border);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 13px;
  color: var(--muted);
  max-width: 1100px;
  margin: 0 auto;
}

.landing .footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.landing .footer-sep {
  color: var(--border);
}

.landing .footer-links {
  display: flex;
  gap: 1.5rem;
}

.landing footer a {
  color: var(--muted);
  text-decoration: none;
}

.landing footer a:hover {
  color: var(--text);
}

/* ANIMATIONS */
@keyframes landing-fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.landing .hero-content > * {
  animation: landing-fadeUp 0.6s ease both;
}

.landing .hero-content > *:nth-child(1) {
  animation-delay: 0.05s;
}
.landing .hero-content > *:nth-child(2) {
  animation-delay: 0.15s;
}
.landing .hero-content > *:nth-child(3) {
  animation-delay: 0.25s;
}
.landing .hero-content > *:nth-child(4) {
  animation-delay: 0.35s;
}
.landing .demo-wrapper {
  animation: landing-fadeUp 0.7s ease 0.45s both;
}
</style>
